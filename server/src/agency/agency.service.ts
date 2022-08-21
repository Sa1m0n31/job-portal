import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
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
import {Notifications} from "../entities/notifications.entity";
import {Password_tokens} from "../entities/password_tokens.entity";

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>,
        @InjectRepository(Agency_verification)
        private readonly agencyVerificationRepository: Repository<Agency_verification>,
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Notifications)
        private readonly notificationsRepository: Repository<Notifications>,
        @InjectRepository(Password_tokens)
        private readonly passwordRepository: Repository<Password_tokens>,
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
                email: email,
                password: passwordHash,
                data: '{}',
                accepted: true, // TODO: admin panel
                active: false,
                lat: null,
                lng: null
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
        const payload = { username: email, sub: password, role: 'agency' };
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
        // Get current gallery
        let currentGallery = [];
        let lat, lng;
        const oldAgencyData = await this.agencyRepository.findOneBy({email: data.email});
        currentGallery = oldAgencyData.data && oldAgencyData.data !== '{}' ? JSON.parse(oldAgencyData.data)?.gallery : [];

        // Modify user data JSON - add file paths
        const email = data.email;
        let agencyData = JSON.parse(data.agencyData);

        agencyData = {
            ...agencyData,
            logo: files.logo ? files.logo[0].path : agencyData.logoUrl,
            gallery: files.gallery ? Array.from(files.gallery).map((item: any) => {
                return item.path ? item.path : (item?.url ? item.url : item);
            }).concat(currentGallery) : agencyData.gallery?.map((item) => (item.url))
        }

        // TODO: email update

        const apiResponse = await lastValueFrom(this.httpService.get(encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${agencyData.city}`)));
        const apiData = apiResponse.data.data;

        if(apiData?.length) {
            lat = apiData[0].latitude;
            lng = apiData[0].longitude;
        }

        // Modify record in database
        return this.agencyRepository.createQueryBuilder()
            .update({
                data: JSON.stringify(agencyData),
                email: agencyData.email,
                lat, lng
            })
            .where({
                email
            })
            .execute();
    }

    async getAgencyData(email: string) {
        return this.agencyRepository.findOneBy({email});
    }

    async getAgencyById(id) {
        return this.agencyRepository.findOneBy({id});
    }

    async getAllApprovedAgencies(page) {
        if(!isNaN(page)) {
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
        else {
            return this.agencyRepository.createQueryBuilder()
                .where({
                    active: true,
                    accepted: true
                })
                .getMany();
        }
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
            });
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

    async getAgencyNotifications(email) {
        return this.notificationsRepository
            .createQueryBuilder('n')
            .leftJoinAndSelect('agency', 'a', 'a.id = n.recipient')
            .leftJoinAndSelect('user', 'u', 'u.id = n.userId')
            .where('a.email = :email AND (n.type = 3 OR n.type = 4)', {email})
            .getRawMany();
    }

    async remindPassword(email: string) {
        const user = await this.agencyRepository.findBy({
            active: true,
            email
        });

        if(user?.length) {
            const token = await uuid();
            const expire = new Date();

            // Send email
            await this.mailerService.sendMail({
                to: email,
                from: process.env.EMAIL_ADDRESS,
                subject: 'Odzyskaj swoje hasło na portalu Jooob.eu',
                html: `<div>
                    <p>
                        Zresetuj swoje hasło na portalu Jooob.eu klikając w poniższy link i ustawiając nowe hasło:  
                    </p>
                    <a href="${process.env.WEBSITE_URL}/ustaw-nowe-haslo?token=${token}">
                         Resetuj hasło
                    </a>
                </div>`
            });

            // Add token to DB
            return this.passwordRepository.save({
                token: token,
                user: null,
                agency: email,
                expire: expire
            });
        }
        else {
            throw new BadRequestException('Podany użytkownik nie istnieje');
        }
    }

    async verifyPasswordToken(token) {
        return this.passwordRepository.findBy({token});
    }

    async resetPassword(password, email) {
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        return this.agencyRepository
            .createQueryBuilder()
            .update({
                password: passwordHash
            })
            .where({
                email
            })
            .execute();
    }

    async changePassword(oldPassword, newPassword, email) {
        const passwordHash = crypto
            .createHash('sha256')
            .update(oldPassword)
            .digest('hex');

        const user = await this.agencyRepository.findBy({
            email,
            password: passwordHash
        });

        if(user?.length) {
            const newPasswordHash = crypto
                .createHash('sha256')
                .update(newPassword)
                .digest('hex');

            return this.agencyRepository
                .createQueryBuilder()
                .update({
                    password: newPasswordHash
                })
                .where({
                    email
                })
                .execute();
        }
        else {
            throw new BadRequestException('Niepoprawne hasło');
        }
    }
}
