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
import {Notifications} from "../entities/notifications.entity";

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
        @InjectRepository(Notifications)
        private readonly notificationsRepository: Repository<Notifications>,
        private readonly httpService: HttpService
    ) {
    }

    async isElementInArray(el, arr) {
        if(!arr?.length) return false;
        return arr.findIndex((item) => {
            return item === el;
        }) !== -1;
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

    getMultipleRandom(arr, num) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    async sendNotificationsToAgency(offer, agencyId) {
        const allUsers = await this.userRepository.findBy({active: true});

        let matches = allUsers.filter((item) => {
            const userData = JSON.parse(item.data);
            if(userData) {
                const userSalaryFrom = userData.salaryType === 1 ? userData.salaryFrom * 4 : userData.salaryFrom;
                const offerSalaryFrom = offer.salaryType === 1 ? offer.salaryFrom * 4 : offer.salaryFrom;
                const offerSalaryTo = offer.salaryType === 1 ? offer.salaryTo * 4 : offer.salaryTo;

                console.log(userSalaryFrom, offerSalaryFrom, offerSalaryTo);

                // Match by category and salary
                return this.isElementInArray(offer.category, userData.categories)
                    && ((userSalaryFrom > offerSalaryFrom) && (userSalaryFrom < offerSalaryTo));
            }
            else {
                return false;
            }
        });

        const matchesLength = matches?.length
        if(matchesLength) {
            if(matchesLength > 3) {
                matches = this.getMultipleRandom(matches, 3);
            }

            return this.notificationsRepository
                .createQueryBuilder()
                .insert()
                .values(
                    matches.map((item) => {
                        return {
                            type: 4,
                            link: `${process.env.WEBSITE_URL}/profil-kandydata?id=${item.id}`,
                            recipient: agencyId,
                            agencyId: null,
                            userId: item.id,
                            checked: false
                        }
                    })
                )
                .execute();
        }
        else {
            return true;
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
        const addOfferResult = await this.offerRepository.insert({
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

        // Add notifications for agencies about matches
        await this.sendNotificationsToAgency(offerData, agencyId);

        // Add notifications for users with that category
        if(addOfferResult) {
            const offerId = addOfferResult.identifiers[0].id;

            // Get users with given category
            const allUsers = await this.userRepository.find();
            const notificationRecipients = allUsers.filter((item) => {
                const data = JSON.parse(item.data);
                if(data) {
                    return this.isElementInArray(category, data.categories);
                }
                else {
                    return false;
                }
            }).map((item) => (item.id));

            if(notificationRecipients?.length) {
                return this.notificationsRepository.createQueryBuilder()
                    .insert()
                    .values(
                        notificationRecipients.map((item) => {
                            return {
                                type: 1,
                                link: `${process.env.WEBSITE_URL}/oferta-pracy?id=${offerId}`,
                                recipient: item,
                                agencyId: agencyId,
                                userId: null,
                                checked: false
                            }
                        })
                    )
                    .execute();
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
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
        const addOfferResult = await this.fastOfferRepository.insert({
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

        if(addOfferResult) {
            const offerId = addOfferResult.identifiers[0].id;

            const isElementInArray = (el, arr) => {
                if(!arr?.length) return false;
                return arr.findIndex((item) => {
                    return item === el;
                }) !== -1;
            }

            // Get users with given category
            const allUsers = await this.userRepository.find();
            const notificationRecipients = allUsers.filter((item) => {
                const data = JSON.parse(item.data);
                if(data) {
                    return isElementInArray(category, data.categories);
                }
                else {
                    return false;
                }
            }).map((item) => (item.id));

            if(notificationRecipients?.length) {
                return this.notificationsRepository.createQueryBuilder()
                    .insert()
                    .values(
                        notificationRecipients.map((item) => {
                            return {
                                type: 2,
                                link: `${process.env.WEBSITE_URL}/blyskawiczna-oferta-pracy?id=${offerId}`,
                                recipient: item,
                                agencyId: agencyId,
                                userId: null,
                                checked: false
                            }
                        })
                    )
                    .execute();
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
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

            const applicationResult = await this.applicationRepository.save({
                user: userId,
                offer: body.id,
                message: body.message,
                preferableContact: body.contactForms,
                attachments: JSON.stringify(attachments)
            });

            // Add notification to agency
            if(applicationResult) {
                return this.notificationsRepository.insert({
                    type: 3,
                    link: `${process.env.WEBSITE_URL}/profil-kandydata?id=${userId}`,
                    recipient: body.agencyId,
                    agencyId: null,
                    userId: userId,
                    checked: false
                });
            }
            else {
                return false;
            }
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

            const applicationResult = await this.fastApplicationsRepository.save({
                user: userId,
                offer: body.id,
                message: body.message,
                preferableContact: body.contactForms,
                attachments: JSON.stringify(attachments)
            });

            // Add notification to agency
            if(applicationResult) {
                return this.notificationsRepository.insert({
                    type: 3,
                    link: `${process.env.WEBSITE_URL}/profil-kandydata?id=${userId}`,
                    recipient: body.agencyId,
                    agencyId: null,
                    userId: userId,
                    checked: false
                });
            }
            else {
                return false;
            }
        }
    }

    async getApplicationsByAgency(email) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get applications
        return this.offerRepository
            .createQueryBuilder('o')
            .leftJoinAndSelect('application', 'application', 'o.id = application.offer')
            .leftJoinAndSelect('user', 'u', 'u.id = application.user')
            .where('o.agency = :agencyId', {agencyId})
            .getRawMany();
    }

    async getFastApplicationsByAgency(email) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get applications
        return this.fastOfferRepository
            .createQueryBuilder('o')
            .leftJoinAndSelect('fast_applications', 'app', 'o.id = app.offer')
            .leftJoinAndSelect('user', 'u', 'u.id = app.user')
            .where('o.agency = :agencyId', {agencyId})
            .getRawMany();
    }
}
