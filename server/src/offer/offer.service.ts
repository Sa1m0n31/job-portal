import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Offer} from "../entities/offer.entity";
import {Like, Repository} from "typeorm";
import {Agency} from "../entities/agency.entity";
import {Application} from "../entities/applications.entity";
import {User} from "../entities/user.entity";
import { HttpService } from '@nestjs/axios'
import {lastValueFrom} from "rxjs";
import {calculateDistance} from "../common/calculateDistance";
import {Fast_offer} from "../entities/fast_offer.entity";
import {Fast_applications} from "../entities/fast_applications.entity";
import {Notifications} from "../entities/notifications.entity";
import {TranslationService} from "../translation/translation.service";
import {Dynamic_translations} from "../entities/dynamic_translations";
import {
    agencyTranslateFields,
    agencyTranslateObject,
    offerTranslateFields,
    offerTranslateObject
} from "../common/translateObjects";
import {getGoogleTranslateLanguageCode} from "../common/getGoogleTranslateLanguageCode";
import {Cron} from "@nestjs/schedule";

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
        @InjectRepository(Dynamic_translations)
        private readonly dynamicTranslationsRepository: Repository<Dynamic_translations>,
        private readonly httpService: HttpService,
        private readonly translationService: TranslationService
    ) {
    }

    @Cron('59 59 23 * * *')
    async removeFastOffers() {
        await this.fastApplicationsRepository.delete({});
        return this.fastOfferRepository.delete({});
    }

    async isElementInArray(el, arr) {
        if(!arr?.length) return false;
        return arr.findIndex((item) => {
            return item === el;
        }) !== -1;
    }

    async getActiveOffers(page: number, lang: string) {
        if(lang === 'pl' || !lang) {
            return this.offerRepository
                .createQueryBuilder('offer')
                .where(`timeBounded = FALSE OR STR_TO_DATE(CONCAT(offer.expireDay,',',offer.expireMonth,',',offer.expireYear), '%d,%m,%Y') >= CURRENT_TIMESTAMP`)
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .where('a.accepted = true')
                .limit(parseInt(process.env.OFFERS_PER_PAGE))
                .offset((page-1) * parseInt(process.env.OFFERS_PER_PAGE))
                .getRawMany();
        }
        else {
            const jobOffers = await this.offerRepository
                .createQueryBuilder('offer')
                .where(`timeBounded = FALSE OR STR_TO_DATE(CONCAT(offer.expireDay,',',offer.expireMonth,',',offer.expireYear), '%d,%m,%Y') >= CURRENT_TIMESTAMP`)
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .where('a.accepted = true')
                .limit(parseInt(process.env.OFFERS_PER_PAGE))
                .offset((page - 1) * parseInt(process.env.OFFERS_PER_PAGE))
                .getRawMany();

            lang = getGoogleTranslateLanguageCode(lang);
            let i = 0;

            for(const item of jobOffers) {
                // Checking for translation in DB
                const offerId = item.offer_id;
                const agencyId = item.a_id;

                const storedTranslationOffer = await this.dynamicTranslationsRepository.findBy({
                    type: 3,
                    lang: lang,
                    id: offerId
                });
                const storedTranslationAgency = await this.dynamicTranslationsRepository.findBy({
                    type: 2,
                    lang: lang,
                    id: agencyId
                });

                let translatedOffer, translatedAgency;
                let translatedOfferArray, translatedAgencyArray;
                let orgAgency = JSON.parse(item.a_data);

                // Get stored offer or translate by Google API
                if(storedTranslationOffer?.length) {
                    translatedOffer = storedTranslationOffer.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                }
                else {
                    // Translate
                    translatedOfferArray = await this.translationService.translateContent([item.offer_title, item.offer_keywords, item.offer_description,
                        item.offer_responsibilities, item.offer_requirements, item.offer_benefits], lang);
                    translatedOffer = {
                        title: translatedOfferArray[0],
                        keywords: translatedOfferArray[1],
                        description: translatedOfferArray[2],
                        responsibilities: translatedOfferArray[3],
                        requirements: translatedOfferArray[4],
                        benefits: translatedOfferArray[5]
                    }

                    // Store in DB
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedOfferArray.map((item, index) => ({
                            type: 3,
                            id: offerId,
                            field: offerTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .orIgnore()
                        .execute();
                }

                // Get stored agency or translate by Google API
                if(storedTranslationAgency?.length) {
                    translatedAgency = storedTranslationAgency.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
                }
                else {
                    // Translate
                    translatedAgencyArray = await this.translationService.translateContent([orgAgency.description,
                        orgAgency.recruitmentProcess, orgAgency.benefits, orgAgency.roomDescription], lang);
                    translatedAgency = {
                        description: translatedAgencyArray[0],
                        recruitmentProcess: translatedAgencyArray[1],
                        benefits: translatedAgencyArray[2],
                        roomDescription: translatedAgencyArray[3]
                    }

                    // Store in DB
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedAgencyArray.map((item, index) => ({
                            type: 2,
                            id: agencyId,
                            field: agencyTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .orIgnore()
                        .execute();
                }

                jobOffers[i] = {
                    ...item,
                    offer_title: translatedOffer.title,
                    offer_keywords: translatedOffer.keywords,
                    offer_description: translatedOffer.description,
                    offer_responsibilities: translatedOffer.responsibilities,
                    offer_requirements: translatedOffer.requirements,
                    offer_benefits: translatedOffer.benefits,
                    a_data: JSON.stringify({
                        ...orgAgency,
                        description: translatedAgency.description,
                        recruitmentProcess: translatedAgency.recruitmentProcess,
                        benefits: translatedAgency.benefits,
                        roomDescription: translatedAgency.roomDescription
                    })
                }

                i++;
            }

            return jobOffers;
        }
    }

    async getActiveFastOffers(lang) {
        if(lang === 'pl' || !lang) {
            return this.fastOfferRepository
                .createQueryBuilder('offer')
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .where('a.accepted = true')
                .getRawMany();
        }
        else {
            const jobOffers = await this.fastOfferRepository
                .createQueryBuilder('offer')
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .where('a.accepted = true')
                .getRawMany();

            lang = getGoogleTranslateLanguageCode(lang);
            let i = 0;

            for(const item of jobOffers) {
                // Checking for translation in DB
                const offerId = item.offer_id;
                const agencyId = item.a_id;

                const storedTranslationOffer = await this.dynamicTranslationsRepository.findBy({
                    type: 4,
                    lang: lang,
                    id: offerId
                });
                const storedTranslationAgency = await this.dynamicTranslationsRepository.findBy({
                    type: 2,
                    lang: lang,
                    id: agencyId
                });

                let translatedOffer, translatedAgency;
                let translatedOfferArray, translatedAgencyArray;
                let orgAgency = JSON.parse(item.a_data);

                // Get stored offer or translate by Google API
                if(storedTranslationOffer?.length) {
                    translatedOffer = storedTranslationOffer.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                }
                else {
                    // Translate
                    translatedOfferArray = await this.translationService.translateContent([item.offer_title, item.offer_keywords, item.offer_description,
                        item.offer_responsibilities, item.offer_requirements, item.offer_benefits], lang);
                    translatedOffer = {
                        title: translatedOfferArray[0],
                        keywords: translatedOfferArray[1],
                        description: translatedOfferArray[2],
                        responsibilities: translatedOfferArray[3],
                        requirements: translatedOfferArray[4],
                        benefits: translatedOfferArray[5]
                    }

                    // Store in DB
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedOfferArray.map((item, index) => ({
                            type: 4,
                            id: offerId,
                            field: offerTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .orIgnore()
                        .execute();
                }

                // Get stored agency or translate by Google API
                if(storedTranslationAgency?.length) {
                    translatedAgency = storedTranslationAgency.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
                }
                else {
                    // Translate
                    translatedAgencyArray = await this.translationService.translateContent([orgAgency.description,
                        orgAgency.recruitmentProcess, orgAgency.benefits, orgAgency.roomDescription], lang);
                    translatedAgency = {
                        description: translatedAgencyArray[0],
                        recruitmentProcess: translatedAgencyArray[1],
                        benefits: translatedAgencyArray[2],
                        roomDescription: translatedAgencyArray[3]
                    }

                    // Store in DB
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedAgencyArray.map((item, index) => ({
                            type: 2,
                            id: agencyId,
                            field: agencyTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .orIgnore()
                        .execute();
                }

                jobOffers[i] = {
                    ...item,
                    offer_title: translatedOffer.title,
                    offer_keywords: translatedOffer.keywords,
                    offer_description: translatedOffer.description,
                    offer_responsibilities: translatedOffer.responsibilities,
                    offer_requirements: translatedOffer.requirements,
                    offer_benefits: translatedOffer.benefits,
                    a_data: JSON.stringify({
                        ...orgAgency,
                        description: translatedAgency.description,
                        recruitmentProcess: translatedAgency.recruitmentProcess,
                        benefits: translatedAgency.benefits,
                        roomDescription: translatedAgency.roomDescription
                    })
                }

                i++;
            }

            return jobOffers;
        }
    }

    removeDiacritics(input) {
        let output = "";

        let normalized = input.normalize("NFD");
        let i=0, j=0;

        while (i<input.length)
        {
            output += normalized[j];

            j += (input[i] == normalized[j]) ? 1 : 2;
            i++;
        }

        return output;
    }

    async filterOffers(page, title, keywords, category, country, city, distance, salaryFrom, salaryTo,
                       salaryType, salaryCurrency, lang) {
        let where = '';
        let parameters: any = {};
        const offersPerPage = parseInt(process.env.OFFERS_PER_PAGE);

        if(salaryFrom === null || salaryFrom === '') salaryFrom = 0;
        if(salaryTo === null || salaryTo === '') salaryTo = 999999;

        if(category !== -1 && country !== -1) {
            if(salaryFrom === 0 && salaryTo === 999999) {
                where = `(offer.category = :category 
            AND offer.country = :country AND 
            (
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            ))`;
                parameters = {
                    category, country, salaryType, salaryFrom, salaryTo
                }
            }
            else {
                where = `(offer.category = :category 
            AND offer.country = :country AND 
            (
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            ) AND offer.salaryCurrency = :salaryCurrency)`;
                parameters = {
                    category, country, salaryType, salaryFrom, salaryTo, salaryCurrency
                }
            }
        }
        else if(category !== -1) {
            if(salaryFrom === 0 && salaryTo === 999999) {
                where = `(category = :category AND 
            (
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            ))`;
                parameters = {
                    category, salaryType, salaryFrom, salaryTo
                }
            }
            else {
                where = `(category = :category AND 
            (
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            ) 
            AND salaryCurrency = :salaryCurrency)`;
                parameters = {
                    category, salaryType, salaryFrom, salaryTo, salaryCurrency
                }
            }
        }
        else if(country !== -1) {
            if(salaryFrom === 0 && salaryTo === 999999) {
                where = `(country = :country AND 
            (
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            ))`;
                parameters = {
                    country, salaryType, salaryFrom, salaryTo
                }
            }
            else {
                where = `(country = :country AND 
            (
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            )
            AND salaryCurrency = :salaryCurrency)`;
                parameters = {
                    country, salaryType, salaryFrom, salaryTo, salaryCurrency
                }
            }
        }
        else {
            if(salaryFrom === 0 && salaryTo === 999999) {
                where = `(
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            )`;
                parameters = {
                    salaryType, salaryFrom, salaryTo
                }
            }
            else {
                where = `((
            (
            IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            )
            OR 
            (
            IF(offer.salaryType = 1, offer.salaryTo * 4, offer.salaryTo) 
            BETWEEN IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) AND IF(:salaryType = 1, :salaryTo * 4, :salaryTo)
            ) 
            OR
            (
            IF(:salaryType = 1, :salaryFrom * 4, :salaryFrom) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            OR 
            (
            IF(:salaryType = 1, :salaryTo * 4, :salaryTo) 
            BETWEEN IF(offer.salaryType = 1, offer.salaryFrom * 4, offer.salaryFrom) AND IF(offer.salaryType = 1, offer.salaryTo* 4, offer.salaryTo)
            )
            )
            AND salaryCurrency = :salaryCurrency)`;
                parameters = {
                    salaryType, salaryFrom, salaryTo, salaryCurrency
                }
            }
        }

        if(city && distance !== null) {
            // Filter all offers by title, category, country and salary
            let filteredOffers = await this.offerRepository
                .createQueryBuilder('offer')
                .andWhere(where, parameters)
                .andWhere({title: Like(`%${title}%`)})
                .andWhere(`(timeBounded = FALSE OR STR_TO_DATE(CONCAT(offer.expireDay,',',offer.expireMonth,',',offer.expireYear), '%d,%m,%Y') >= CURRENT_TIMESTAMP)`)
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .getRawMany();

            // Filter by keywords
            if(keywords) {
                const filterKeywords = keywords.split(',');

                filteredOffers = filteredOffers.filter((item) => {
                    if(item.offer_keywords) {
                        const offerKeywords = item.offer_keywords.split(',');

                        for(const offerKeyword of offerKeywords) {
                            for(const filterKeyword of filterKeywords) {
                                if(this.removeDiacritics(offerKeyword.trim().toLowerCase()).includes(this.removeDiacritics(filterKeyword.trim().toLowerCase()))) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    }
                    else {
                        return false;
                    }
                });
            }

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
                offersToReturn = offersToReturn.slice(startIndex, startIndex + offersPerPage);

                // Translation
                if(lang === 'pl' || !lang) {
                    return offersToReturn;
                }
                else {
                    const jobOffers = offersToReturn;
                    lang = getGoogleTranslateLanguageCode(lang);
                    let i = 0;

                    for(const item of jobOffers) {
                        // Checking for translation in DB
                        const offerId = item.offer_id;
                        const agencyId = item.a_id;

                        const storedTranslationOffer = await this.dynamicTranslationsRepository.findBy({
                            type: 3,
                            lang: lang,
                            id: offerId
                        });
                        const storedTranslationAgency = await this.dynamicTranslationsRepository.findBy({
                            type: 2,
                            lang: lang,
                            id: agencyId
                        });

                        let translatedOffer, translatedAgency;
                        let translatedOfferArray, translatedAgencyArray;
                        let orgAgency = JSON.parse(item.a_data);

                        // Get stored offer or translate by Google API
                        if(storedTranslationOffer?.length) {
                            translatedOffer = storedTranslationOffer.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                        }
                        else {
                            // Translate
                            translatedOfferArray = await this.translationService.translateContent([item.offer_title, item.offer_keywords, item.offer_description,
                                item.offer_responsibilities, item.offer_requirements, item.offer_benefits], lang);
                            translatedOffer = {
                                title: translatedOfferArray[0],
                                keywords: translatedOfferArray[1],
                                description: translatedOfferArray[2],
                                responsibilities: translatedOfferArray[3],
                                requirements: translatedOfferArray[4],
                                benefits: translatedOfferArray[5]
                            }

                            // Store in DB
                            await this.dynamicTranslationsRepository
                                .createQueryBuilder()
                                .insert()
                                .values(translatedOfferArray.map((item, index) => ({
                                    type: 3,
                                    id: offerId,
                                    field: offerTranslateFields[index],
                                    lang: lang,
                                    value: item
                                })))
                                .orIgnore()
                                .execute();
                        }

                        // Get stored agency or translate by Google API
                        if(storedTranslationAgency?.length) {
                            translatedAgency = storedTranslationAgency.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
                        }
                        else {
                            // Translate
                            translatedAgencyArray = await this.translationService.translateContent([orgAgency.description,
                                orgAgency.recruitmentProcess, orgAgency.benefits, orgAgency.roomDescription], lang);
                            translatedAgency = {
                                description: translatedAgencyArray[0],
                                recruitmentProcess: translatedAgencyArray[1],
                                benefits: translatedAgencyArray[2],
                                roomDescription: translatedAgencyArray[3]
                            }

                            // Store in DB
                            await this.dynamicTranslationsRepository
                                .createQueryBuilder()
                                .insert()
                                .values(translatedAgencyArray.map((item, index) => ({
                                    type: 2,
                                    id: agencyId,
                                    field: agencyTranslateFields[index],
                                    lang: lang,
                                    value: item
                                })))
                                .orIgnore()
                                .execute();
                        }

                        jobOffers[i] = {
                            ...item,
                            offer_title: translatedOffer.title,
                            offer_keywords: translatedOffer.keywords,
                            offer_description: translatedOffer.description,
                            offer_responsibilities: translatedOffer.responsibilities,
                            offer_requirements: translatedOffer.requirements,
                            offer_benefits: translatedOffer.benefits,
                            a_data: JSON.stringify({
                                ...orgAgency,
                                description: translatedAgency.description,
                                recruitmentProcess: translatedAgency.recruitmentProcess,
                                benefits: translatedAgency.benefits,
                                roomDescription: translatedAgency.roomDescription
                            })
                        }

                        i++;
                    }

                    return jobOffers;
                }
            }
            else {
                return [];
            }
        }
        else {
            let offersToReturn = await this.offerRepository
                .createQueryBuilder('offer')
                .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
                .where(where, parameters)
                .andWhere({title: Like(`%${title}%`)})
                .andWhere(`(timeBounded = FALSE OR STR_TO_DATE(CONCAT(offer.expireDay,',',offer.expireMonth,',',offer.expireYear), '%d,%m,%Y') >= CURRENT_TIMESTAMP)`)
                .limit(offersPerPage)
                .offset((page-1) * offersPerPage)
                .getRawMany();

            // Filter by keywords
            if(keywords) {
                const filterKeywords = keywords.split(',');

                offersToReturn = offersToReturn.filter((item) => {
                    if(item.offer_keywords) {
                        const offerKeywords = item.offer_keywords.split(',');

                        for(const offerKeyword of offerKeywords) {
                            for(const filterKeyword of filterKeywords) {
                                if(this.removeDiacritics(offerKeyword.trim().toLowerCase()).includes(this.removeDiacritics(filterKeyword.trim().toLowerCase()))) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    }
                    else {
                        return false;
                    }
                });
            }

            if(lang === 'pl' || !lang) {
                return offersToReturn;
            }
            else {
                // Translation
                const jobOffers = offersToReturn;
                lang = getGoogleTranslateLanguageCode(lang);
                let i = 0;

                for(const item of jobOffers) {
                    // Checking for translation in DB
                    const offerId = item.offer_id;
                    const agencyId = item.a_id;

                    const storedTranslationOffer = await this.dynamicTranslationsRepository.findBy({
                        type: 3,
                        lang: lang,
                        id: offerId
                    });
                    const storedTranslationAgency = await this.dynamicTranslationsRepository.findBy({
                        type: 2,
                        lang: lang,
                        id: agencyId
                    });

                    let translatedOffer, translatedAgency;
                    let translatedOfferArray, translatedAgencyArray;
                    let orgAgency = JSON.parse(item.a_data);

                    // Get stored offer or translate by Google API
                    if(storedTranslationOffer?.length) {
                        translatedOffer = storedTranslationOffer.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                    }
                    else {
                        // Translate
                        translatedOfferArray = await this.translationService.translateContent([item.offer_title, item.offer_keywords, item.offer_description,
                            item.offer_responsibilities, item.offer_requirements, item.offer_benefits], lang);
                        translatedOffer = {
                            title: translatedOfferArray[0],
                            keywords: translatedOfferArray[1],
                            description: translatedOfferArray[2],
                            responsibilities: translatedOfferArray[3],
                            requirements: translatedOfferArray[4],
                            benefits: translatedOfferArray[5]
                        }

                        // Store in DB
                        await this.dynamicTranslationsRepository
                            .createQueryBuilder()
                            .insert()
                            .values(translatedOfferArray.map((item, index) => ({
                                type: 3,
                                id: offerId,
                                field: offerTranslateFields[index],
                                lang: lang,
                                value: item
                            })))
                            .orIgnore()
                            .execute();
                    }

                    // Get stored agency or translate by Google API
                    if(storedTranslationAgency?.length) {
                        translatedAgency = storedTranslationAgency.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
                    }
                    else {
                        // Translate
                        translatedAgencyArray = await this.translationService.translateContent([orgAgency.description,
                            orgAgency.recruitmentProcess, orgAgency.benefits, orgAgency.roomDescription], lang);
                        translatedAgency = {
                            description: translatedAgencyArray[0],
                            recruitmentProcess: translatedAgencyArray[1],
                            benefits: translatedAgencyArray[2],
                            roomDescription: translatedAgencyArray[3]
                        }

                        // Store in DB
                        await this.dynamicTranslationsRepository
                            .createQueryBuilder()
                            .insert()
                            .values(translatedAgencyArray.map((item, index) => ({
                                type: 2,
                                id: agencyId,
                                field: agencyTranslateFields[index],
                                lang: lang,
                                value: item
                            })))
                            .orIgnore()
                            .execute();
                    }

                    jobOffers[i] = {
                        ...item,
                        offer_title: translatedOffer.title,
                        offer_keywords: translatedOffer.keywords,
                        offer_description: translatedOffer.description,
                        offer_responsibilities: translatedOffer.responsibilities,
                        offer_requirements: translatedOffer.requirements,
                        offer_benefits: translatedOffer.benefits,
                        a_data: JSON.stringify({
                            ...orgAgency,
                            description: translatedAgency.description,
                            recruitmentProcess: translatedAgency.recruitmentProcess,
                            benefits: translatedAgency.benefits,
                            roomDescription: translatedAgency.roomDescription
                        })
                    }

                    i++;
                }

                return jobOffers;
            }
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

    async translateOfferData(offerData, data, files, updateMode = false) {
        // Detect language
        const lang = await this.translationService.detect(offerData.responsibilities[0]);

        if(lang === 'pl') {
            // Add filenames
            if(updateMode) {
                return {
                    ...offerData,
                    image: files.image ? files.image[0].path : offerData.imageUrl,
                    attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                        return {
                            name: offerData.attachments[index].name,
                            path: item.path
                        }
                    }).concat(offerData.oldAttachments) : offerData.oldAttachments
                }
            }
            else {
                return {
                    ...offerData,
                    image: files.image ? files.image[0].path : offerData.imageUrl,
                    attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                        return {
                            name: offerData.attachments[index].name,
                            path: item.path
                        }
                    }) : data.attachments
                }
            }
        }
        else {
            // Translate to Polish
            const polishVersionResponseTitle = await this.translationService.translateContent(offerData.title, 'pl', true);
            const polishVersionResponseKeywords = await this.translationService.translateContent(offerData.keywords, 'pl', true);
            const polishVersionResponseDescription = await this.translationService.translateContent(offerData.description, 'pl', true);
            const polishVersionResponseResponsibilities = await this.translationService.translateContent(offerData.responsibilities, 'pl', true);
            const polishVersionResponseRequirements = await this.translationService.translateContent(offerData.requirements, 'pl', true);
            const polishVersionResponseBenefits = await this.translationService.translateContent(offerData.benefits, 'pl', true);

            // Add filenames
            if(updateMode) {
                return {
                    ...offerData,
                    title: polishVersionResponseTitle,
                    keywords: polishVersionResponseKeywords,
                    description: polishVersionResponseDescription,
                    responsibilities: polishVersionResponseResponsibilities,
                    requirements: polishVersionResponseRequirements,
                    benefits: polishVersionResponseBenefits,
                    image: files.image ? files.image[0].path : offerData.imageUrl,
                    attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                        return {
                            name: offerData.attachments[index].name,
                            path: item.path
                        }
                    }).concat(offerData.oldAttachments) : offerData.oldAttachments
                }
            }
            else {
                return {
                    ...offerData,
                    title: polishVersionResponseTitle,
                    keywords: polishVersionResponseKeywords,
                    description: polishVersionResponseDescription,
                    responsibilities: polishVersionResponseResponsibilities,
                    requirements: polishVersionResponseRequirements,
                    benefits: polishVersionResponseBenefits,
                    image: files.image ? files.image[0].path : offerData.imageUrl,
                    attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                        return {
                            name: offerData.attachments[index].name,
                            path: item.path
                        }
                    }) : data.attachments
                }
            }
        }
    }

    async addOffer(data, files) {
        let offerData = JSON.parse(data.offerData);
        let lat = null, lng = null;

        offerData = await this.translateOfferData(offerData, data, files);

        // Get offer data
        const { title, category, keywords, country, postalCode, city, description,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded, expireDay, expireMonth, expireYear,
            image, attachments, extraInfo, show_agency_info, manyLocations
        } = offerData;

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Get lat and lng
        if(city) {
            const apiResponse = await lastValueFrom(this.httpService.get(encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${city}`)));
            const apiData = apiResponse.data.data;

            if(apiData) {
                lat = apiData[0]?.latitude;
                lng = apiData[0]?.longitude;
            }
        }

        // Add record to database
        const addOfferResult = await this.offerRepository.insert({
            id: null,
            agency: agencyId,
            title, category, keywords, country, postalCode, city, description,
            responsibilities: JSON.stringify(responsibilities),
            requirements: JSON.stringify(requirements),
            benefits: JSON.stringify(benefits),
            salaryType, salaryFrom, salaryTo,
            salaryCurrency,
            contractType: JSON.stringify(contractType),
            timeBounded,
            expireDay, expireMonth, expireYear, image,
            attachments: attachments ? JSON.stringify(attachments) : null,
            extraInfo,
            created_at: new Date(),
            lat,
            lng,
            manyLocations: manyLocations !== '-' ? manyLocations : null,
            show_agency_info
        });

        // Add notifications for agencies about matches
        await this.sendNotificationsToAgency(offerData, agencyId);

        // Add notifications for users with that category
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

        offerData = await this.translateOfferData(offerData, data, files);

        // Get offer data
        const { title, category, keywords, country, postalCode, city, street, description,
            accommodationCountry, accommodationCity, accommodationStreet, accommodationPostalCode,
            accommodationDay, accommodationMonth, accommodationYear, accommodationHour,
            startDay, startMonth, startYear, startHour, contactPerson, contactNumberCountry, contactNumber,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, image, attachments, extraInfo, show_agency_info
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
            salaryCurrency,
            contractType: JSON.stringify(contractType),
            contactPerson, contactNumberCountry, contactNumber, image,
            attachments: attachments ? JSON.stringify(attachments) : null,
            extraInfo,
            created_at: new Date(),
            show_agency_info
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
        let lat = null, lng = null;

        offerData = await this.translateOfferData(offerData, data, files, true);

        // Get offer data
        const { id, title, category, keywords, country, postalCode, city, description,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded, expireDay, expireMonth, expireYear,
            image, attachments, extraInfo, show_agency_info, manyLocations
        } = offerData;

        // Remove translations
        await this.dynamicTranslationsRepository.delete({
            type: 3,
            id: id
        });

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Get lat and lng
        if(city) {
            const apiResponse = await lastValueFrom(this.httpService.get(
                encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${city}`)));
            const apiData = apiResponse.data.data;

            if(apiData) {
                lat = apiData[0].latitude;
                lng = apiData[0].longitude;
            }
        }

        // Update record in database
        return this.offerRepository.createQueryBuilder()
            .update({
                agency: agencyId,
                title, category, keywords, country, postalCode, city, description,
                responsibilities: JSON.stringify(responsibilities),
                requirements: JSON.stringify(requirements),
                benefits: JSON.stringify(benefits),
                salaryType, salaryFrom, salaryTo,
                salaryCurrency,
                contractType: JSON.stringify(contractType),
                timeBounded,
                expireDay, expireMonth, expireYear, image,
                attachments: JSON.stringify(attachments),
                extraInfo,
                lat,
                lng,
                manyLocations: manyLocations !== '-' ? manyLocations : null,
                show_agency_info
            })
            .where({id})
            .execute();
    }

    async updateFastOffer(data, files) {
        let offerData = JSON.parse(data.offerData);

        offerData = this.translateOfferData(offerData, data, files, true);

        // Get offer data
        const { id, title, category, keywords, country, postalCode, city, street, description,
            accommodationCountry, accommodationCity, accommodationStreet, accommodationPostalCode,
            accommodationDay, accommodationMonth, accommodationYear, accommodationHour,
            startDay, startMonth, startYear, startHour, contactPerson, contactNumberCountry, contactNumber,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, image, attachments, extraInfo, show_agency_info
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
                salaryCurrency,
                contractType: JSON.stringify(contractType),
                image,
                attachments: JSON.stringify(attachments),
                extraInfo,
                show_agency_info
            })
            .where({id})
            .execute();
    }

    async getOffersByAgency(email, lang) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        if(lang === 'pl') {
            // Get job offers
            return this.offerRepository.findBy({agency: agencyId});
        }
        else {
            lang = getGoogleTranslateLanguageCode(lang);
            const jobOffers = await this.offerRepository.findBy({agency: agencyId});
            let i = 0;

            for(const item of jobOffers) {
                // Find offer translation
                const offerTranslation = await this.dynamicTranslationsRepository.findBy({
                    type: 3,
                    lang: lang,
                    id: item.id
                });

                if(offerTranslation?.length) {
                    // Get translation from DB
                    const translatedOffer = offerTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                    jobOffers[i] = {
                        ...item,
                        title: translatedOffer.title,
                        keywords: translatedOffer.keywords,
                        description: translatedOffer.description,
                        responsibilities: translatedOffer.responsibilities,
                        requirements: translatedOffer.requirements,
                        benefits: translatedOffer.benefits
                    }
                }
                else {
                    // Translate by Google API
                    const translatedOffer = await this.translationService.translateContent([item.title, item.keywords, item.description,
                        item.responsibilities, item.requirements, item.benefits], lang);

                    // Store in DB
                    const offerId = item.id;
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedOffer.map((item, index) => ({
                            type: 3,
                            id: offerId,
                            field: offerTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .execute();

                    jobOffers[i] = {
                        ...item,
                        title: translatedOffer[0],
                        keywords: translatedOffer[1],
                        description: translatedOffer[2],
                        responsibilities: translatedOffer[3],
                        requirements: translatedOffer[4],
                        benefits: translatedOffer[5]
                    }
                }

                i++;
            }

            return jobOffers;
        }
    }

    async getFastOffersByAgency(email, lang) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        if(lang === 'pl') {
            // Get job offers
            return this.fastOfferRepository.findBy({agency: agencyId});
        }
        else {
            lang = getGoogleTranslateLanguageCode(lang);
            const jobOffers = await this.fastOfferRepository.findBy({agency: agencyId});
            let i = 0;

            for(const item of jobOffers) {
                // Find offer translation
                const offerTranslation = await this.dynamicTranslationsRepository.findBy({
                    type: 4,
                    lang: lang,
                    id: item.id
                });

                if(offerTranslation?.length) {
                    // Get translation from DB
                    const translatedOffer = offerTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                    jobOffers[i] = {
                        ...item,
                        title: translatedOffer.title,
                        keywords: translatedOffer.keywords,
                        description: translatedOffer.description,
                        responsibilities: translatedOffer.responsibilities,
                        requirements: translatedOffer.requirements,
                        benefits: translatedOffer.benefits
                    }
                }
                else {
                    // Translate by Google API
                    const translatedOffer = await this.translationService.translateContent([item.title, item.keywords, item.description,
                        item.responsibilities, item.requirements, item.benefits], lang);

                    // Store in DB
                    const offerId = item.id;
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedOffer.map((item, index) => ({
                            type: 4,
                            id: offerId,
                            field: offerTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .execute();

                    jobOffers[i] = {
                        ...item,
                        title: translatedOffer[0],
                        keywords: translatedOffer[1],
                        description: translatedOffer[2],
                        responsibilities: translatedOffer[3],
                        requirements: translatedOffer[4],
                        benefits: translatedOffer[5]
                    }
                }

                i++;
            }

            return jobOffers;
        }
    }

    async deleteOffer(id) {
        return this.offerRepository.delete({id});
    }

    async deleteFastOffer(id) {
        return this.fastOfferRepository.delete({id});
    }

    async getOfferById(id, lang) {
        lang = getGoogleTranslateLanguageCode(lang);

        if(lang === 'pl') {
            return this.offerRepository
                .createQueryBuilder('o')
                .where(`o.id = :id`, {id})
                .innerJoinAndSelect('agency', 'a', 'o.agency = a.id')
                .getRawMany();
        }
        else {
            // Get original data
            const originalData = await this.offerRepository
                .createQueryBuilder('o')
                .where(`o.id = :id`, {id})
                .innerJoinAndSelect('agency', 'a', 'o.agency = a.id')
                .getRawMany();
            const org = originalData[0];
            const orgAgency = JSON.parse(org.a_data);

            // Checking for translation in DB
            const storedTranslationOffer = await this.dynamicTranslationsRepository.findBy({
                type: 3,
                lang: lang,
                id: id
            });
            const storedTranslationAgency = await this.dynamicTranslationsRepository.findBy({
                type: 2,
                lang: lang,
                id: org.a_id
            });

            let translatedOffer, translatedAgency;
            let translatedOfferArray, translatedAgencyArray;

            // Get stored offer or translate by Google API
            if(storedTranslationOffer?.length) {
                translatedOffer = storedTranslationOffer.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
            }
            else {
                // Translate
                translatedOfferArray = await this.translationService.translateContent([org.o_title, org.o_keywords, org.o_description,
                    org.o_responsibilities, org.o_requirements, org.o_benefits], lang);
                translatedOffer = {
                    title: translatedOfferArray[0],
                    keywords: translatedOfferArray[1],
                    description: translatedOfferArray[2],
                    responsibilities: translatedOfferArray[3],
                    requirements: translatedOfferArray[4],
                    benefits: translatedOfferArray[5]
                }

                // Store in DB
                await this.dynamicTranslationsRepository
                    .createQueryBuilder()
                    .insert()
                    .values(translatedOfferArray.map((item, index) => ({
                        type: 3,
                        id: id,
                        field: offerTranslateFields[index],
                        lang: lang,
                        value: item
                    })))
                    .execute();
            }

            // Get stored agency or translate by Google API
            if(storedTranslationAgency?.length) {
                translatedAgency = storedTranslationAgency.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
            }
            else {
                // Translate
                translatedAgencyArray = await this.translationService.translateContent([orgAgency.description,
                    orgAgency.recruitmentProcess, orgAgency.benefits, orgAgency.roomDescription], lang);
                translatedAgency = {
                    description: translatedAgencyArray[0],
                    recruitmentProcess: translatedAgencyArray[1],
                    benefits: translatedAgencyArray[2],
                    roomDescription: translatedAgencyArray[3]
                }

                // Store in DB
                await this.dynamicTranslationsRepository
                    .createQueryBuilder()
                    .insert()
                    .values(translatedAgencyArray.map((item, index) => ({
                        type: 2,
                        id: org.a_id,
                        field: agencyTranslateFields[index],
                        lang: lang,
                        value: item
                    })))
                    .execute();
            }

            return {
                ...org,
                o_title: translatedOffer.title,
                o_keywords: translatedOffer.keywords,
                o_description: translatedOffer.description,
                o_responsibilities: translatedOffer.responsibilities,
                o_requirements: translatedOffer.requirements,
                o_benefits: translatedOffer.benefits,
                a_data: JSON.stringify({
                    ...orgAgency,
                    description: translatedAgency.description,
                    recruitmentProcess: translatedAgency.recruitmentProcess,
                    benefits: translatedAgency.benefits,
                    roomDescription: translatedAgency.roomDescription
                })
            }
        }
    }

    async getFastOfferById(id, lang) {
        lang = getGoogleTranslateLanguageCode(lang);

        if(lang === 'pl') {
            return this.fastOfferRepository
                .createQueryBuilder('o')
                .where(`o.id = :id`, {id})
                .innerJoinAndSelect('agency', 'a', 'o.agency = a.id')
                .getRawMany();
        }
        else {
            // Get original data
            const originalData = await this.fastOfferRepository
                .createQueryBuilder('o')
                .where(`o.id = :id`, {id})
                .innerJoinAndSelect('agency', 'a', 'o.agency = a.id')
                .getRawMany();
            const org = originalData[0];
            const orgAgency = JSON.parse(org.a_data);

            // Checking for translation in DB
            const storedTranslationOffer = await this.dynamicTranslationsRepository.findBy({
                type: 4,
                lang: lang,
                id: id
            });
            const storedTranslationAgency = await this.dynamicTranslationsRepository.findBy({
                type: 2,
                lang: lang,
                id: org.a_id
            });

            let translatedOffer, translatedAgency;
            let translatedOfferArray, translatedAgencyArray;

            // Get stored offer or translate by Google API
            if(storedTranslationOffer?.length) {
                translatedOffer = storedTranslationOffer.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
            }
            else {
                // Translate
                translatedOfferArray = await this.translationService.translateContent([org.o_title, org.o_keywords, org.o_description,
                    org.o_responsibilities, org.o_requirements, org.o_benefits], lang);
                translatedOffer = {
                    title: translatedOfferArray[0],
                    keywords: translatedOfferArray[1],
                    description: translatedOfferArray[2],
                    responsibilities: translatedOfferArray[3],
                    requirements: translatedOfferArray[4],
                    benefits: translatedOfferArray[5]
                }

                // Store in DB
                await this.dynamicTranslationsRepository
                    .createQueryBuilder()
                    .insert()
                    .values(translatedOfferArray.map((item, index) => ({
                        type: 4,
                        id: id,
                        field: offerTranslateFields[index],
                        lang: lang,
                        value: item
                    })))
                    .execute();
            }

            // Get stored agency or translate by Google API
            if(storedTranslationAgency?.length) {
                translatedAgency = storedTranslationAgency.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
            }
            else {
                // Translate
                translatedAgencyArray = await this.translationService.translateContent([orgAgency.description,
                    orgAgency.recruitmentProcess, orgAgency.benefits, orgAgency.roomDescription], lang);
                translatedAgency = {
                    description: translatedAgencyArray[0],
                    recruitmentProcess: translatedAgencyArray[1],
                    benefits: translatedAgencyArray[2],
                    roomDescription: translatedAgencyArray[3]
                }

                // Store in DB
                await this.dynamicTranslationsRepository
                    .createQueryBuilder()
                    .insert()
                    .values(translatedAgencyArray.map((item, index) => ({
                        type: 2,
                        id: org.a_id,
                        field: agencyTranslateFields[index],
                        lang: lang,
                        value: item
                    })))
                    .execute();
            }

            return {
                ...org,
                o_title: translatedOffer.title,
                o_keywords: translatedOffer.keywords,
                o_description: translatedOffer.description,
                o_responsibilities: translatedOffer.responsibilities,
                o_requirements: translatedOffer.requirements,
                o_benefits: translatedOffer.benefits,
                a_data: JSON.stringify({
                    ...orgAgency,
                    description: translatedAgency.description,
                    recruitmentProcess: translatedAgency.recruitmentProcess,
                    benefits: translatedAgency.benefits,
                    roomDescription: translatedAgency.roomDescription
                })
            }
        }
    }

    async hideApplication(applicationId, userId) {
        return this.applicationRepository
            .createQueryBuilder()
            .update({
                hidden: true
            })
            .where({
                user: userId,
                id: applicationId
            })
            .execute();
    }

    async hideFastApplication(applicationId, userId) {
        return this.fastApplicationsRepository
            .createQueryBuilder()
            .update({
                hidden: true
            })
            .where({
                user: userId,
                id: applicationId
            })
            .execute();
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
                friendLink: body.friendLink,
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
                friendLink: body.friendLink,
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

    async getApplicationsByAgency(email, lang) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get applications
        const jobOffers = await this.offerRepository
            .createQueryBuilder('o')
            .leftJoinAndSelect('application', 'application', 'o.id = application.offer')
            .leftJoinAndSelect('user', 'u', 'u.id = application.user')
            .where('o.agency = :agencyId and application.hidden = 0', {agencyId})
            .getRawMany();

        if(lang === 'pl') {
            return jobOffers;
        }
        else {
            lang = getGoogleTranslateLanguageCode(lang);
            let i = 0;

            for(const item of jobOffers) {
                // Find offer translation
                const offerTranslation = await this.dynamicTranslationsRepository.findBy({
                    type: 3,
                    lang: lang,
                    id: item.o_id
                });

                if(offerTranslation?.length) {
                    // Get translation from DB
                    const translatedOffer = offerTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                    jobOffers[i] = {
                        ...item,
                        o_title: translatedOffer.title,
                        o_keywords: translatedOffer.keywords,
                        o_description: translatedOffer.description,
                        o_responsibilities: translatedOffer.responsibilities,
                        o_requirements: translatedOffer.requirements,
                        o_benefits: translatedOffer.benefits
                    }
                }
                else {
                    // Translate by Google API
                    const translatedOffer = await this.translationService.translateContent([item.o_title, item.o_keywords, item.o_description,
                        item.o_responsibilities, item.o_requirements, item.o_benefits], lang);

                    // Store in DB
                    const offerId = item.o_id;
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedOffer.map((item, index) => ({
                            type: 3,
                            id: offerId,
                            field: offerTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .execute();

                    jobOffers[i] = {
                        ...item,
                        o_title: translatedOffer[0],
                        o_keywords: translatedOffer[1],
                        o_description: translatedOffer[2],
                        o_responsibilities: translatedOffer[3],
                        o_requirements: translatedOffer[4],
                        o_benefits: translatedOffer[5]
                    }
                }

                i++;
            }

            return jobOffers;
        }
    }

    async getFastApplicationsByAgency(email, lang) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get applications
        const jobOffers = await this.fastOfferRepository
            .createQueryBuilder('o')
            .leftJoinAndSelect('fast_applications', 'app', 'o.id = app.offer')
            .leftJoinAndSelect('user', 'u', 'u.id = app.user')
            .where('o.agency = :agencyId and app.hidden = 0', {agencyId})
            .getRawMany();

        if(lang === 'pl' || !lang) {
            // Get job offers
            return jobOffers;
        }
        else {
            lang = getGoogleTranslateLanguageCode(lang);
            let i = 0;

            for(const item of jobOffers) {
                // Find offer translation
                const offerTranslation = await this.dynamicTranslationsRepository.findBy({
                    type: 4,
                    lang: lang,
                    id: item.o_id
                });

                if(offerTranslation?.length) {
                    // Get translation from DB
                    const translatedOffer = offerTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), offerTranslateObject);
                    jobOffers[i] = {
                        ...item,
                        o_title: translatedOffer.title,
                        o_keywords: translatedOffer.keywords,
                        o_description: translatedOffer.description,
                        o_responsibilities: translatedOffer.responsibilities,
                        o_requirements: translatedOffer.requirements,
                        o_benefits: translatedOffer.benefits
                    }
                }
                else {
                    // Translate by Google API
                    const translatedOffer = await this.translationService.translateContent([item.o_title, item.o_keywords, item.o_description,
                        item.o_responsibilities, item.o_requirements, item.o_benefits], lang);

                    // Store in DB
                    const offerId = item.o_id;
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedOffer.map((item, index) => ({
                            type: 4,
                            id: offerId,
                            field: offerTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .execute();

                    jobOffers[i] = {
                        ...item,
                        o_title: translatedOffer[0],
                        o_keywords: translatedOffer[1],
                        o_description: translatedOffer[2],
                        o_responsibilities: translatedOffer[3],
                        o_requirements: translatedOffer[4],
                        o_benefits: translatedOffer[5]
                    }
                }

                i++;
            }

            return jobOffers;
        }
    }

    async getAllOffers(page) {
        return this.offerRepository
            .createQueryBuilder('offer')
            .innerJoinAndSelect('agency', 'a', 'offer.agency = a.id')
            .orderBy('offer.created_at', 'DESC')
            .limit(parseInt(process.env.OFFERS_PER_PAGE))
            .offset((page-1) * parseInt(process.env.OFFERS_PER_PAGE))
            .getRawMany();
    }
}
