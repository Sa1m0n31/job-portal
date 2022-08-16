import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Offer} from "../entities/offer.entity";
import {Like, MoreThan, Repository} from "typeorm";
import {Agency} from "../entities/agency.entity";
import {Application} from "../entities/applications.entity";
import {User} from "../entities/user.entity";
import * as axios from 'axios'
import { HttpService } from '@nestjs/axios'
import {lastValueFrom, map} from "rxjs";
import {calculateDistance} from "../common/calculateDistance";
import {Fast_offer} from "../entities/fast_offer.entity";
import {Fast_applications} from "../entities/fast_applications.entity";

// 0 - miesiecznie
// 1 - tygodniowo

const distances = [
    100, 50, 40, 30, 20, 10, 5
];

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Fast_offer)
        private readonly fastOfferRepository: Repository<Fast_offer>,
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>,
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        @InjectRepository(Fast_applications)
        private readonly fastApplicationsRepository: Repository<Fast_applications>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService
    ) {
    }

    async getActiveOffers(page: number) {
        return this.offerRepository
            .createQueryBuilder('offer')
            .where(`timeBounded = FALSE OR STR_TO_DATE(CONCAT(offer.expireDay,',',offer.expireMonth,',',offer.expireYear), '%d,%m,%Y') >= CURRENT_TIMESTAMP`)
            .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
            .limit(parseInt(process.env.OFFERS_PER_PAGE))
            .offset((page-1) * parseInt(process.env.OFFERS_PER_PAGE))
            .getRawMany();
    }

    async getActiveFastOffers() {
        return this.fastOfferRepository
            .createQueryBuilder('offer')
            .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
            .getRawMany();
    }

    async filterOffers(page, title, category, country, city, distance, salaryFrom, salaryTo, salaryType, salaryCurrency) {
        let where = '';
        let parameters = {};
        const offersPerPage = parseInt(process.env.OFFERS_PER_PAGE);

        if(salaryFrom === null || salaryFrom === '') salaryFrom = 0;
        if(salaryTo === null || salaryFrom === '') salaryTo = 999999;

        if(category !== -1 && country !== -1) {
            where = `offer.category = :category 
            AND offer.country = :country AND 
            (IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) >= IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom)) AND
            (IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) <= IF(:salaryType = 1, :salaryTo * 4, :salaryTo)) 
            AND offer.salaryCurrency = :salaryCurrency`;
            parameters = {
                category, country, salaryType, salaryFrom, salaryTo, salaryCurrency
            }
        }
        else if(category !== -1) {
            where = `category = :category AND 
            (IF(salaryType = 1, salaryFrom * 4, salaryFrom) >= IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom)) AND
            (IF(salaryType = 1, salaryTo * 4, salaryTo) <= IF(:salaryType = 1, :salaryTo * 4, :salaryTo)) 
            AND salaryCurrency = :salaryCurrency`;
            parameters = {
                category, salaryType, salaryFrom, salaryTo, salaryCurrency
            }
        }
        else if(country !== -1) {
            where = `country = :country AND 
            (IF(salaryType = 1, salaryFrom * 4, salaryFrom) >= IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom)) AND
            (IF(salaryType = 1, salaryTo * 4, salaryTo) <= IF(:salaryType = 1, :salaryTo * 4, :salaryTo)) 
            AND salaryCurrency = :salaryCurrency`;
            parameters = {
                country, salaryType, salaryFrom, salaryTo, salaryCurrency
            }
        }
        else {
            where = `(IF(salaryType = 1, salaryFrom * 4, salaryFrom) >= IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom)) AND
            (IF(salaryType = 1, salaryTo * 4, salaryTo) <= IF(:salaryType = 1, :salaryTo * 4, :salaryTo)) 
            AND salaryCurrency = :salaryCurrency`;
            parameters = {
                salaryType, salaryFrom, salaryTo, salaryCurrency
            }
        }

        if(city && distance !== null) {
            // Filter all offers by title, category, country and salary
            const filteredOffers = await this.offerRepository
                .createQueryBuilder('offer')
                .where(where, parameters)
                .andWhere({title: Like(`%${title}%`)})
                .andWhere(`(timeBounded = FALSE OR STR_TO_DATE(CONCAT(offer.expireDay,',',offer.expireMonth,',',offer.expireYear), '%d,%m,%Y') >= CURRENT_TIMESTAMP)`)
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .getRawMany();

            // Get filter city latitude and longitude
            const apiResponse = await lastValueFrom(this.httpService.get(encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${city}`)));
            const apiData = apiResponse.data.data;

            if(apiData?.length) {
                const lat = apiData[0].latitude;
                const lng = apiData[0].longitude;

                // Get distance of each offer
                const maxDistance = distances[distance];
                let offersToReturn = [];

                for(const offer of filteredOffers) {
                    const destinationLat = offer.offer_lat;
                    const destinationLng = offer.offer_lng;
                    const distanceResult = calculateDistance(lat, destinationLat, lng, destinationLng);
                    console.log(distanceResult);
                    offersToReturn.push({
                        ...offer,
                        distance: distanceResult
                    });
                }

                // Filter - get only offers within range send in filter
                offersToReturn = offersToReturn.filter((item) => (item.distance <= maxDistance));

                // Sort them by distance from city send in filter
                offersToReturn.sort((a, b) => {
                    if(a.distance < b.distance) return 1;
                    else if(a.distance > b.distance) return -1;
                    else {
                        if(a.offer_id < b.offer_id) return 1;
                        else return -1;
                    }
                });

                const startIndex = offersPerPage * (page-1);
                return offersToReturn.slice(startIndex, startIndex + offersPerPage);
            }
            else {
                return [];
            }
        }
        else {
            return await this.offerRepository
                .createQueryBuilder('offer')
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .andWhere(where, parameters)
                .andWhere({title: Like(`%${title}%`)})
                .andWhere(`(timeBounded = FALSE OR STR_TO_DATE(CONCAT(offer.expireDay,',',offer.expireMonth,',',offer.expireYear), '%d,%m,%Y') >= CURRENT_TIMESTAMP)`)
                .limit(offersPerPage)
                .offset((page-1) * offersPerPage)
                .getRawMany();
        }
    }

    async addOffer(data, files) {
        let offerData = JSON.parse(data.offerData);

        // Add filenames
        offerData = {
            ...offerData,
            image: files.image ? files.image[0].path : offerData.imageUrl,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                return {
                    name: offerData.attachments[index].name,
                    path: item.path
                }
            }) : data.attachments
        }

        // Get offer data
        const { title, category, keywords, country, postalCode, city, description,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded, expireDay, expireMonth, expireYear,
            image, attachments
        } = offerData;

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Add record to database
        return this.offerRepository.insert({
            id: null,
            agency: agencyId,
            title, category, keywords, country, postalCode, city, description,
            responsibilities: JSON.stringify(responsibilities),
            requirements: JSON.stringify(requirements),
            benefits: JSON.stringify(benefits),
            salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded,
            expireDay, expireMonth, expireYear, image,
            attachments: JSON.stringify(attachments)
        });
    }

    async addFastOffer(data, files) {
        let offerData = JSON.parse(data.offerData);

        // Add filenames
        offerData = {
            ...offerData,
            image: files.image ? files.image[0].path : offerData.imageUrl,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                return {
                    name: offerData.attachments[index].name,
                    path: item.path
                }
            }) : data.attachments
        }

        // Get offer data
        const { title, category, keywords, country, postalCode, city, street, description,
            accommodationCountry, accommodationCity, accommodationStreet, accommodationPostalCode,
            accommodationDay, accommodationMonth, accommodationYear, accommodationHour,
            startDay, startMonth, startYear, startHour, contactPerson, contactNumberCountry, contactNumber,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, image, attachments
        } = offerData;

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Add record to database
        return this.fastOfferRepository.insert({
            id: null,
            agency: agencyId,
            title, category, keywords, country, postalCode, city, street, description,
            accommodationCountry, accommodationCity, accommodationPostalCode, accommodationStreet,
            accommodationDay, accommodationHour, accommodationMonth, accommodationYear,
            startDay, startMonth, startYear, startHour,
            responsibilities: JSON.stringify(responsibilities),
            requirements: JSON.stringify(requirements),
            benefits: JSON.stringify(benefits),
            salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType,
            contactPerson, contactNumberCountry, contactNumber, image,
            attachments: JSON.stringify(attachments)
        });
    }

    async updateOffer(data, files) {
        let offerData = JSON.parse(data.offerData);

        // Add filenames
        offerData = {
            ...offerData,
            image: files.image ? files.image[0].path : offerData.imageUrl,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                return {
                    name: offerData.attachments[index].name,
                    path: item.path
                }
            }).concat(offerData.oldAttachments) : offerData.oldAttachments
        }

        // Get offer data
        const { id, title, category, keywords, country, postalCode, city, description,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded, expireDay, expireMonth, expireYear,
            image, attachments
        } = offerData;

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Update record in database
        return this.offerRepository.createQueryBuilder()
            .update({
                agency: agencyId,
                title, category, keywords, country, postalCode, city, description,
                responsibilities: JSON.stringify(responsibilities),
                requirements: JSON.stringify(requirements),
                benefits: JSON.stringify(benefits),
                salaryType, salaryFrom, salaryTo,
                salaryCurrency, contractType, timeBounded,
                expireDay, expireMonth, expireYear, image,
                attachments: JSON.stringify(attachments)
            })
            .where({id})
            .execute();
    }

    async updateFastOffer(data, files) {
        let offerData = JSON.parse(data.offerData);

        // Add filenames
        offerData = {
            ...offerData,
            image: files.image ? files.image[0].path : offerData.imageUrl,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                return {
                    name: offerData.attachments[index].name,
                    path: item.path
                }
            }).concat(offerData.oldAttachments) : offerData.oldAttachments
        }

        // Get offer data
        const { id, title, category, keywords, country, postalCode, city, street, description,
            accommodationCountry, accommodationCity, accommodationStreet, accommodationPostalCode,
            accommodationDay, accommodationMonth, accommodationYear, accommodationHour,
            startDay, startMonth, startYear, startHour, contactPerson, contactNumberCountry, contactNumber,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, image, attachments
        } = offerData;

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Update record in database
        return this.fastOfferRepository.createQueryBuilder()
            .update({
                agency: agencyId,
                title, category, keywords, country, postalCode, city, street, description,
                accommodationCountry, accommodationCity, accommodationPostalCode, accommodationStreet,
                accommodationDay, accommodationHour, accommodationMonth, accommodationYear,
                startDay, startMonth, startYear, startHour,
                responsibilities: JSON.stringify(responsibilities),
                requirements: JSON.stringify(requirements),
                benefits: JSON.stringify(benefits),
                salaryType, salaryFrom, salaryTo,
                contactPerson, contactNumberCountry, contactNumber,
                salaryCurrency, contractType, image,
                attachments: JSON.stringify(attachments)
            })
            .where({id})
            .execute();
    }

    async getOffersByAgency(email) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get job offers
        return this.offerRepository.findBy({agency: agencyId});
    }

    async getFastOffersByAgency(email) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get job offers
        return this.fastOfferRepository.findBy({agency: agencyId});
    }

    async deleteOffer(id) {
        return this.offerRepository.delete({id});
    }

    async deleteFastOffer(id) {
        return this.fastOfferRepository.delete({id});
    }

    async getOfferById(id) {
        return this.offerRepository
            .createQueryBuilder('o')
            .where(`o.id = :id`, {id})
            .innerJoinAndSelect('agency', 'a', 'o.agency = a.id')
            .getRawMany();
    }

    async getFastOfferById(id) {
        return this.fastOfferRepository
            .createQueryBuilder('o')
            .where(`o.id = :id`, {id})
            .innerJoinAndSelect('agency', 'a', 'o.agency = a.id')
            .getRawMany();
    }

    async addApplication(body, files) {
        let attachments = [];
        const attachmentNames = JSON.parse(body.attachmentsNames);

        // Get user id
        const user = await this.userRepository.findOneBy({email: body.email});
        const userId = user.id;

        // Check if user already applied for that offer
        const userApplication = await this.applicationRepository.findBy({
            user: userId,
            offer: body.id
        });

        if(userApplication?.length) {
            throw new HttpException('Aplikowałeś już na tę ofertę pracy', 502);
        }
        else {
            if(files?.attachments) {
                attachments = files.attachments.map((item, index) => {
                    return {
                        name: attachmentNames[index],
                        path: item.filename
                    }
                });
            }

            return this.applicationRepository.save({
                user: userId,
                offer: body.id,
                message: body.message,
                preferableContact: body.contactForms,
                attachments: JSON.stringify(attachments)
            });
        }
    }

    async addFastApplication(body, files) {
        let attachments = [];
        const attachmentNames = JSON.parse(body.attachmentsNames);

        // Get user id
        const user = await this.userRepository.findOneBy({email: body.email});
        const userId = user.id;

        // Check if user already applied for that offer
        const userApplication = await this.fastApplicationsRepository.findBy({
            user: userId,
            offer: body.id
        });

        if(userApplication?.length) {
            throw new HttpException('Aplikowałeś już na tę ofertę pracy', 502);
        }
        else {
            if(files?.attachments) {
                attachments = files.attachments.map((item, index) => {
                    return {
                        name: attachmentNames[index],
                        path: item.filename
                    }
                });
            }

            return this.fastApplicationsRepository.save({
                user: userId,
                offer: body.id,
                message: body.message,
                preferableContact: body.contactForms,
                attachments: JSON.stringify(attachments)
            });
        }
    }
}
