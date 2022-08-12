import {HttpException, Injectable} from '@nestjs/common';
import * as crypto from 'crypto'
import {InjectRepository} from "@nestjs/typeorm";
import {createQueryBuilder, Like, Repository} from "typeorm";
import {CreateUserDto} from "../dto/create-user.dto";
import { v4 as uuid } from 'uuid';
import {MailerService} from "@nestjs-modules/mailer";
import {Agency} from "../entities/agency.entity";
import {Agency_verification} from "../entities/agency_verification";
import {JwtService} from "@nestjs/jwt";
import {lastValueFrom, map} from "rxjs";
import { HttpService } from '@nestjs/axios'
import {Offer} from "../entities/offer.entity";
import {calculateDistance} from "../common/calculateDistance";

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>,
        @InjectRepository(Agency_verification)
        private readonly agencyVerificationRepository: Repository<Agency_verification>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        private readonly mailerService: MailerService,
        private readonly jwtTokenService: JwtService,
        private readonly httpService: HttpService
    ) {
    }

    async registerAgency(email: string, password: string) {
        const existingAgency = await this.agencyRepository.findOneBy({
            email
        });

        if(existingAgency) {
            throw new HttpException('Agencja z podanym adresem e-mail już istnieje', 400);
        }
        else {
            const passwordHash = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex');

            const newUser = new CreateUserDto({
                email: email,
                password: passwordHash,
                data: {}
            });

            const token = await uuid();

            await this.mailerService.sendMail({
                to: email,
                from: process.env.EMAIL_ADDRESS,
                subject: 'Aktywuj swoje konto w serwisie Jooob.eu',
                html: `<div>
                    <h2>
                        Cieszymy się, że jesteś z nami!
                    </h2>
                    <p>
                        W celu aktywacji swojego konta, kliknij w poniższy link:
                    </p>
                    <a href="${process.env.WEBSITE_URL}/weryfikacja?token=${token}">
                        ${process.env.WEBSITE_URL}/weryfikacja?token=${token}
                    </a>
                </div>`
            });

            await this.agencyRepository.save({
                ...newUser,
                accepted: false
            });

            return this.agencyVerificationRepository.save({
                email,
                token
            });
        }
    }

    async verifyAgency(token: string) {
        const user = await this.agencyVerificationRepository.findOneBy({ token });
        if(user) {
            return this.agencyRepository.createQueryBuilder()
                .update({
                    active: true
                })
                .where({
                    email: user.email
                })
                .execute();
        }
        else {
            throw new HttpException('Niepoprawny token', 400);
        }
    }

    async loginAgency(email: string, password: string) {
        const payload = { username: email, sub: password };
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const user = await this.agencyRepository.findOneBy({
            email,
            password: passwordHash
        });

        if(user) {
            if(user.active) {
                return {
                    access_token: this.jwtTokenService.sign(payload, {
                        secret: process.env.JWT_KEY
                    })
                };
            }
            else {
                throw new HttpException('Aktywuj swoje konto', 403);
            }
        }
        else {
            throw new HttpException('Niepoprawna nazwa użytkownika lub hasło', 401);
        }
    }

    async updateAgency(data, files) {
        console.log(files);

        // Get current gallery
        let currentGallery = [];
        const oldAgencyData = await this.agencyRepository.findOneBy({email: data.email});
        currentGallery = oldAgencyData.data ? JSON.parse(oldAgencyData.data)?.gallery : [];

        // Modify user data JSON - add file paths
        const email = data.email;
        let agencyData = JSON.parse(data.agencyData);
        agencyData = {
            ...agencyData,
            logo: files.logo ? files.logo[0].path : agencyData.logoUrl,
            gallery: files.gallery ? Array.from(files.gallery).map((item: any) => {
                console.log(item);
                return item.path ? item.path : (item?.url ? item.url : item);
            }).concat(currentGallery) : agencyData.gallery?.map((item) => (item.url))
        }

        // Modify record in database
        return this.agencyRepository.createQueryBuilder()
            .update({
                data: JSON.stringify(agencyData),
                email: agencyData.email
            })
            .where({
                email
            })
            .execute();
    }

    async getAgencyData(email: string) {
        return this.agencyRepository.findOneBy({email});
    }

    async getAllApprovedAgencies(page) {
        console.log('HERE');
        console.log(page);
        const perPage = parseInt(process.env.OFFERS_PER_PAGE);
        return this.agencyRepository.createQueryBuilder()
            .where({
                active: true,
                accepted: true
            })
            .limit(perPage)
            .offset((page-1) * perPage)
            .getMany();
    }

    async sortAgencies(sortType, page) {
        const perPage = parseInt(process.env.OFFERS_PER_PAGE);

        if(sortType === 0) {
            // Sort alphabetically
            const allAgencies = await this.agencyRepository.findBy({
                accepted: true,
                active: true
            });

            return allAgencies.sort((a, b) => {
                const aName = JSON.parse(a.data).name;
                const bName = JSON.parse(b.data).name;

                if(aName > bName) return 1;
                else if(aName < bName) return -1;
                else {
                    if(a.id > b.id) return -1;
                    else return 1;
                }
            })
        }
        else if(sortType === 1) {
            // Sort by number of offers (most)
            const allOffers = await this.offerRepository.find();
            const allAgencies = await this.agencyRepository.findBy({
                accepted: true,
                active: true
            });

            const getNumberOfOffers = (agency) => {
                return allOffers.filter((item) => {
                    return item.agency === agency;
                }).length;
            }

            // Add number of offers to each agency
            const agenciesWithNumberOfOffers = await allAgencies.map((item) => {
                return {
                    ...item,
                    offers: getNumberOfOffers(item.id)
                }
            });

            // Sort by number of offers
            const sortedAgencies = agenciesWithNumberOfOffers.sort((a, b) => {
                if(a.offers > b.offers) return 1;
                else if(a.offers < b.offers) return -1;
                else {
                    if(a.id > b.id) return -1;
                    else return 1;
                }
            });

            const startIndex = perPage * (page-1);
            return sortedAgencies.slice(startIndex, startIndex + perPage);
        }
        else {
            // Sort by number of offers (least)
        }
    }

    async filterAgencies(body) {
        const { country, distance, city, page } = body;

        const distances = [
            100, 50, 40, 30, 20, 10, 5
        ];
        const offersPerPage = parseInt(process.env.OFFERS_PER_PAGE);

        console.log(country, distance, city, page);

        if(city) {
            // Get all agencies
            const allAgencies = await this.agencyRepository.findBy({
                accepted: true,
                active: true
            });

            let filteredAgencies;
            if(country !== null && country !== undefined && country !== -1) {
                // Filter by country
                filteredAgencies = allAgencies.filter((item) => {
                    return JSON.parse(item.data)?.country === country;
                });
            }
            else {
                // All agencies
                filteredAgencies = allAgencies;
            }

            // Get distance of each agency
            const maxDistance = distances[distance];
            let agenciesToReturn = [];

            const apiResponse = await lastValueFrom(this.httpService.get(encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${city}`)));
            const apiData = apiResponse.data.data;

            if(apiData?.length) {
                const lat = apiData[0].latitude;
                const lng = apiData[0].longitude;

                for (const agency of filteredAgencies) {
                    const destinationLat = agency.lat;
                    const destinationLng = agency.lng;
                    const distanceResult = calculateDistance(lat, destinationLat, lng, destinationLng);
                    console.log(distanceResult);
                    agenciesToReturn.push({
                        ...agency,
                        distance: distanceResult
                    });
                }

                // Filter - get only agencies within range send in filter
                agenciesToReturn = agenciesToReturn.filter((item) => (item.distance <= maxDistance));

                // Sort them by distance from city send in filter
                agenciesToReturn.sort((a, b) => {
                    if(a.distance < b.distance) return 1;
                    else if(a.distance > b.distance) return -1;
                    else {
                        if(a.id < b.id) return 1;
                        else return -1;
                    }
                });

                const startIndex = offersPerPage * (page-1);
                return agenciesToReturn.slice(startIndex, startIndex + offersPerPage);
            }
            else {
                return this.agencyRepository
                    .createQueryBuilder()
                    .where({
                        active: true,
                        accepted: true
                    })
                    .getMany();
            }
        }
        else if(country !== null && country !== undefined && country !== -1) {
            // Filter by country
            const allAgencies = await this.agencyRepository
                .createQueryBuilder()
                .where({
                    active: true,
                    accepted: true
                })
                .getMany();

            const startIndex = offersPerPage * (page-1);
            return allAgencies.filter((item) => {
                console.log(JSON.parse(item.data)?.country, country);
                return JSON.parse(item.data)?.country === country;
            }).slice(startIndex, startIndex + offersPerPage);
        }
        else {
            // Return all
            return this.agencyRepository
                .createQueryBuilder()
                .where({
                    active: true,
                    accepted: true
                })
                .limit(offersPerPage)
                .offset((page-1) * offersPerPage)
                .getMany();
        }
    }
}
