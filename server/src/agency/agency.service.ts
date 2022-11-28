import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import * as crypto from 'crypto'
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { v4 as uuid } from 'uuid';
import {MailerService} from "@nestjs-modules/mailer";
import {Agency} from "../entities/agency.entity";
import {Agency_verification} from "../entities/agency_verification";
import {JwtService} from "@nestjs/jwt";
import {lastValueFrom} from "rxjs";
import { HttpService } from '@nestjs/axios'
import {Offer} from "../entities/offer.entity";
import {calculateDistance} from "../common/calculateDistance";
import {Notifications} from "../entities/notifications.entity";
import {Password_tokens} from "../entities/password_tokens.entity";
import {TranslationService} from "../translation/translation.service";
import {Dynamic_translations} from "../entities/dynamic_translations";
import {getGoogleTranslateLanguageCode} from "../common/getGoogleTranslateLanguageCode";
import {
    agencyTranslateFields,
    agencyTranslateObject, userTranslateFields
} from "../common/translateObjects";

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
        @InjectRepository(Dynamic_translations)
        private readonly dynamicTranslationsRepository: Repository<Dynamic_translations>,
        private readonly mailerService: MailerService,
        private readonly jwtTokenService: JwtService,
        private readonly httpService: HttpService,
        private readonly translationService: TranslationService
    ) {
    }

    async registerAgency(email: string, password: string, mailContent) {
        const existingAgency = await this.agencyRepository.findOneBy({
            email
        });
        const content = JSON.parse(mailContent);

        if(existingAgency) {
            throw new HttpException(content[0], 400);
        }
        else {
            const passwordHash = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex');

            const token = await uuid();

            await this.mailerService.sendMail({
                to: email,
                from: process.env.EMAIL_ADDRESS,
                subject: content[1],
                html: `<div>
                    <h2>
                        ${content[2]}
                    </h2>
                    <p>
                        ${content[3]}
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
                accepted: false,
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
            // Send email notification to admin
            await this.mailerService.sendMail({
                to: process.env.ADMIN_EMAIL,
                from: process.env.EMAIL_ADDRESS,
                subject: 'Nowa firma zarejestrowała się na jooob.eu',
                html: `<div>
                    <h2>
                        Nowa firma zarejestrowała się na jooob.eu!
                    </h2>
                    <p style="margin-top: 20px;">
                        Zaloguj się do panelu administratora, aby sprawdzić szczegóły.
                    </p>
                    <a style="background: #0A73FE;
    color: #fff; padding: 10px 20px; font-size: 14px; display: flex; width: 300px;
    justify-content: center; align-items: center; margin-top: 20px; text-decoration: none;
    border-radius: 5px;" href="${process.env.WEBSITE_URL}/admin">
                        Zaloguj się do panelu administratora
                    </a>
                </div>`
            });

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

    async loginAgency(email: string, password: string, mailContent: string) {
        const payload = { username: email, sub: password, role: 'agency' };
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
        const content = JSON.parse(mailContent);

        const user = await this.agencyRepository.findOneBy({
            email,
            password: passwordHash
        });

        if(user) {
            if(user.active) {
                if(!user.blocked) {
                    return {
                        access_token: this.jwtTokenService.sign(payload, {
                            secret: process.env.JWT_KEY
                        })
                    };
                }
                else {
                    throw new HttpException(content[0], 423);
                }
            }
            else {
                throw new HttpException(content[1], 403);
            }
        }
        else {
            throw new HttpException(content[2], 401);
        }
    }

    getLanguageSample(data) {
        if(data.roomDescription) {
            return data.roomDescription;
        }
        else if(data.benefits) {
            return data.benefits.slice(0, 100);
        }
        else if(data.recruitmentProcess) {
            return data.recruitmentProcess.slice(0, 100);
        }
        else if(data.description) {
            return data.description.slice(0, 100);
        }
        else {
            return '';
        }
    }

    async translateAgencyData(agencyData, currentGallery, files, oldGallery) {
        // Detect language
        const languageSample = this.getLanguageSample(agencyData);
        const lang = languageSample ? await this.translationService.detect(languageSample) : 'pl';

        let newAgencyData = {
            ...agencyData,
            logo: files.logo ? files.logo[0].path : agencyData.logoUrl,
            gallery: files.gallery ? Array.from(files.gallery).map((item: any) => {
                return item.path ? item.path : (item?.url ? item.url : item);
            }).concat(oldGallery)?.filter((item) => (item)) : agencyData.gallery?.map((item) => (item.url))?.filter((item) => (item))
        }

        if(lang === 'pl') {
            return newAgencyData;
        }
        else {
            // Translate to Polish
            const translatedDescriptionRes = await this.translationService.translateString(agencyData.description, 'pl');
            const translatedDescription = translatedDescriptionRes[0];
            const translatedRecruitmentProcessRes = await this.translationService.translateString(agencyData.recruitmentProcess, 'pl');
            const translatedRecruitmentProcess = translatedRecruitmentProcessRes[0];
            const translatedBenefitsRes = await this.translationService.translateString(agencyData.benefits, 'pl');
            const translatedBenefits = translatedBenefitsRes[0];
            const translatedRoomDescriptionRes = await this.translationService.translateString(agencyData.roomDescription, 'pl');
            const translatedRoomDescription = translatedRoomDescriptionRes[0];

            // Add filenames
            return {
                ...newAgencyData,
                description: translatedDescription,
                recruitmentProcess: translatedRecruitmentProcess,
                benefits: translatedBenefits,
                roomDescription: translatedRoomDescription,
                originalLang: lang
            }
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
        let originalAgencyData = agencyData;

        // Detect language and translate if not Polish
        agencyData = await this.translateAgencyData(agencyData, currentGallery, files, data.oldGallery);

        // Get latitude and longitude
        if(agencyData.city) {
            try {
                const apiResponse = await lastValueFrom(this.httpService.get(
                    encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${agencyData.city}`)));
                const apiData = apiResponse.data.data;

                if(apiData?.length) {
                    lat = apiData[0].latitude;
                    lng = apiData[0].longitude;
                }
            }
            catch(err) {}
        }

        // Remove translations
        await this.dynamicTranslationsRepository.delete({
            type: 2,
            id: oldAgencyData.id
        });

        // Save original agency data in dynamic_translations
        if(agencyData.originalLang) {
            const agency = await this.agencyRepository.findOneBy({
                email
            });

            let translatedAgencyArray = [originalAgencyData.extraLanguages, originalAgencyData.courses,
                originalAgencyData.certificates, originalAgencyData.skills, originalAgencyData.situationDescription,
                originalAgencyData.jobs, originalAgencyData.schools];

            // Store in DB
            await this.dynamicTranslationsRepository
                .createQueryBuilder()
                .insert()
                .values(translatedAgencyArray.map((item, index) => ({
                    type: 2,
                    id: agency.id,
                    field: agencyTranslateFields[index],
                    lang: agencyData.originalLang,
                    value: typeof item === 'string' ? item : JSON.stringify(item)
                })))
                .orIgnore()
                .execute();
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

    async getAgencyData(email: string, lang: string) {
        if(lang === 'pl' || !lang) {
            return this.agencyRepository.findOneBy({email});
        }
        else {
            lang = getGoogleTranslateLanguageCode(lang);
            const agency = await this.agencyRepository.findOneBy({email});
            const agencyData = JSON.parse(agency.data);
            let agencyTranslationData;

            if(Object.keys(agencyData).length === 0 && agencyData.constructor === Object) {
                return {
                    ...agency,
                    data: JSON.stringify({})
                }
            }
            else {
                // Find agency translation
                const agencyTranslation = await this.dynamicTranslationsRepository.findBy({
                    type: 2,
                    lang: lang,
                    id: agency.id
                });

                if(agencyTranslation?.length) {
                    agencyTranslationData = agencyTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
                }
                else {
                    // Translate by Google API
                    const translatedDescriptionRes = await this.translationService.translateString(agencyData.description, lang);
                    const translatedDescription = translatedDescriptionRes[0];
                    const translatedRecruitmentProcessRes = await this.translationService.translateString(agencyData.recruitmentProcess, lang);
                    const translatedRecruitmentProcess = translatedRecruitmentProcessRes[0];
                    const translatedBenefitsRes = await this.translationService.translateString(agencyData.benefits, lang);
                    const translatedBenefits = translatedBenefitsRes[0];
                    const translatedRoomDescriptionRes = await this.translationService.translateString(agencyData.roomDescription, lang);
                    const translatedRoomDescription = translatedRoomDescriptionRes[0];

                    const translatedAgencyArray = [translatedDescription, translatedRecruitmentProcess, translatedBenefits, translatedRoomDescription];

                    agencyTranslationData = {
                        description: translatedDescription,
                        recruitmentProcess: translatedRecruitmentProcess,
                        benefits: translatedBenefits,
                        roomDescription: translatedRoomDescription
                    }

                    // Store in DB
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedAgencyArray.map((item, index) => ({
                            type: 2,
                            id: agency.id,
                            field: agencyTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .orIgnore()
                        .execute();
                }

                return {
                    ...agency,
                    data: JSON.stringify({
                        ...agencyData,
                        description: agencyTranslationData.description,
                        recruitmentProcess: agencyTranslationData.recruitmentProcess,
                        benefits: agencyTranslationData.benefits,
                        roomDescription: agencyTranslationData.roomDescription
                    })
                }
            }
        }
    }

    async getAgencyById(id, lang) {
        if(lang === 'pl' || !lang) {
            return this.agencyRepository.findOneBy({id});
        }
        else {
            lang = getGoogleTranslateLanguageCode(lang);
            const agency = await this.agencyRepository.findOneBy({id});
            const agencyData = JSON.parse(agency.data);
            let agencyTranslationData;

            if(Object.keys(agencyData).length === 0 && agencyData.constructor === Object) {
                return {
                    ...agency,
                    data: JSON.stringify({})
                }
            }
            else {
                // Find agency translation
                const agencyTranslation = await this.dynamicTranslationsRepository.findBy({
                    type: 2,
                    lang: lang,
                    id: agency.id
                });

                if(agencyTranslation?.length) {
                    agencyTranslationData = agencyTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), agencyTranslateObject);
                }
                else {
                    // Translate by Google API
                    const translatedDescriptionRes = await this.translationService.translateString(agencyData.description, lang);
                    const translatedDescription = translatedDescriptionRes[0];
                    const translatedRecruitmentProcessRes = await this.translationService.translateString(agencyData.recruitmentProcess, lang);
                    const translatedRecruitmentProcess = translatedRecruitmentProcessRes[0];
                    const translatedBenefitsRes = await this.translationService.translateString(agencyData.benefits, lang);
                    const translatedBenefits = translatedBenefitsRes[0];
                    const translatedRoomDescriptionRes = await this.translationService.translateString(agencyData.roomDescription, lang);
                    const translatedRoomDescription = translatedRoomDescriptionRes[0];

                    const translatedAgencyArray = [translatedDescription, translatedRecruitmentProcess, translatedBenefits, translatedRoomDescription];

                    agencyTranslationData = {
                        description: translatedDescription,
                        recruitmentProcess: translatedRecruitmentProcess,
                        benefits: translatedBenefits,
                        roomDescription: translatedRoomDescription
                    }

                    // Store in DB
                    await this.dynamicTranslationsRepository
                        .createQueryBuilder()
                        .insert()
                        .values(translatedAgencyArray.map((item, index) => ({
                            type: 2,
                            id: agency.id,
                            field: agencyTranslateFields[index],
                            lang: lang,
                            value: item
                        })))
                        .orIgnore()
                        .execute();
                }

                return {
                    ...agency,
                    data: JSON.stringify({
                        ...agencyData,
                        description: agencyTranslationData.description,
                        recruitmentProcess: agencyTranslationData.recruitmentProcess,
                        benefits: agencyTranslationData.benefits,
                        roomDescription: agencyTranslationData.roomDescription
                    })
                }
            }
        }
    }

    async getAllAgencies(page) {
        if(!isNaN(page)) {
            const perPage = parseInt(process.env.OFFERS_PER_PAGE);
            return await this.agencyRepository.createQueryBuilder()
                .where({
                    active: true
                })
                .orderBy('id', 'DESC')
                .limit(perPage)
                .offset((page-1) * perPage)
                .getMany();
        }
        else {
            return this.agencyRepository.createQueryBuilder()
                .where({
                    active: true
                })
                .getMany();
        }
    }

    async getAllApprovedAgencies(page) {
        if(!isNaN(page)) {
            const perPage = parseInt(process.env.OFFERS_PER_PAGE);
            return await this.agencyRepository.createQueryBuilder()
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

    async sortAgencies(allAgencies, sorting) {
        // Sorting
        sorting = parseInt(sorting);
        if(sorting >= 0) {
            if (sorting === 0) {
                // By name
                return allAgencies.sort((a, b) => {
                    const aData = JSON.parse(a.data);
                    const bData = JSON.parse(b.data);

                    if (aData.name > bData.name) return 1;
                    else return -1;
                });
            }
            else {
                // By number of offers
                const allOffers = await this.offerRepository.find();

                const getNumberOfOffersByAgency = (agency) => {
                    return allOffers.filter((item) => (item.agency === agency)).length;
                }

                if (sorting === 1) {
                    // Most
                    return allAgencies.sort((a, b) => {
                        const aOffers = getNumberOfOffersByAgency(a.id);
                        const bOffers = getNumberOfOffersByAgency(b.id);

                        if (aOffers < bOffers) return 1;
                        else return -1;
                    });
                } else if (sorting === 2) {
                    // Least
                    return allAgencies.sort((a, b) => {
                        const aOffers = getNumberOfOffersByAgency(a.id);
                        const bOffers = getNumberOfOffersByAgency(b.id);

                        if (aOffers > bOffers) return 1;
                        else return -1;
                    });
                }
                else {
                    return allAgencies;
                }
            }
        }
        else {
            return allAgencies;
        }
    }

    async filterAgencies(body) {
        let { country, distance, city, sorting, page } = body;

        const distances = [
            100, 50, 40, 30, 20, 10, 5
        ];
        const offersPerPage = parseInt(process.env.OFFERS_PER_PAGE);

        if(city) {
            // Get all agencies
            let allAgencies = await this.agencyRepository.findBy({
                accepted: true,
                active: true
            });

            allAgencies = await this.sortAgencies(allAgencies, sorting);

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
            let allAgencies = await this.agencyRepository
                .createQueryBuilder()
                .where({
                    active: true,
                    accepted: true
                })
                .getMany();

            allAgencies = await this.sortAgencies(allAgencies, sorting);

            const startIndex = offersPerPage * (page-1);
            return allAgencies.filter((item) => {
                return JSON.parse(item.data)?.country === country;
            }).slice(startIndex, startIndex + offersPerPage);
        }
        else {
            // Return all
            let allAgencies = await this.agencyRepository
                .createQueryBuilder()
                .where({
                    active: true,
                    accepted: true
                })
                .getMany();

            allAgencies = await this.sortAgencies(allAgencies, sorting);

            const startIndex = offersPerPage * (page-1);
            return allAgencies.slice(startIndex, startIndex + offersPerPage);
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

    async remindPassword(email: string, mailContent: string) {
        const user = await this.agencyRepository.findBy({
            active: true,
            email
        });
        const content = JSON.parse(mailContent);

        if(user?.length) {
            const token = await uuid();
            const expire = new Date();

            // Send email
            await this.mailerService.sendMail({
                to: email,
                from: process.env.EMAIL_ADDRESS,
                subject: content[0],
                html: `<div>
                    <p>
                        ${content[1]}
                    </p>
                    <a href="${process.env.WEBSITE_URL}/ustaw-nowe-haslo?token=${token}">
                         ${content[2]}
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
            throw new BadRequestException(content[3]);
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
