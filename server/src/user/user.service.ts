import {BadRequestException, HttpException, Injectable} from '@nestjs/common';
import * as crypto from 'crypto'
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {Repository} from "typeorm";
import {User_verification} from "../entities/user_verification";
import {CreateUserDto} from "../dto/create-user.dto";
import { v4 as uuid } from 'uuid';
import {MailerService} from "@nestjs-modules/mailer";
import {JwtService} from "@nestjs/jwt";
import {Application} from '../entities/applications.entity'
import {HttpService} from "@nestjs/axios";
import {lastValueFrom} from "rxjs";
import {calculateDistance} from "../common/calculateDistance";
import {Fast_applications} from "../entities/fast_applications.entity";
import {Notifications} from "../entities/notifications.entity";
import {Password_tokens} from "../entities/password_tokens.entity";
import {Dynamic_translations} from "../entities/dynamic_translations";
import {TranslationService} from "../translation/translation.service";
import {
    userTranslateFields,
    userTranslateObject
} from "../common/translateObjects";
import {removeLanguageSpecificCharacters} from "../common/removeLanguageSpecificCharacters";
import {getGoogleTranslateLanguageCode} from "../common/getGoogleTranslateLanguageCode";
import { Response } from 'express'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(User_verification)
        private readonly userVerificationRepository: Repository<User_verification>,
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
        @InjectRepository(Fast_applications)
        private readonly fastApplicationRepository: Repository<Fast_applications>,
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

    async registerUser(email: string, password: string, newsletter: boolean, mailContent: string) {
        const existingUser = await this.userRepository.findOneBy({
            email
        });

        const content = JSON.parse(mailContent);

        if(existingUser) {
            throw new HttpException(content[0], 400);
        }
        else {
            const passwordHash = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex');

            const newUser = new CreateUserDto({
                email: email,
                password: passwordHash,
                data: '{}',
            });

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

            await this.userRepository.save(newUser);

            if(newsletter) {
                const res = await lastValueFrom(this.httpService.post(encodeURI(`${process.env.API_URL}/newsletter/addNewContact`), {
                    email
                }));
            }

            return this.userVerificationRepository.save({
                email,
                token
            });
        }
    }

    async verifyUser(token: string) {
        const user = await this.userVerificationRepository.findOneBy({ token });
        if(user) {
            return this.userRepository.createQueryBuilder()
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

    async loginUser(email: string, password: string, mailContent: string) {
        const payload = { username: email, sub: password, role: 'user' };
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const content = JSON.parse(mailContent);

        const user = await this.userRepository.findOneBy({
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

    async sendInvitation(email, name, createAccount, content, res: Response) {
        await this.mailerService.sendMail({
            to: email,
            from: process.env.EMAIL_ADDRESS,
            subject: `${content?.split('.')[1]} ${content?.split('.')[2]}`,
            html: `<div>
                    <h2>
                        ${name} ${content}
                    </h2>
                    <a style="background: #0A73FE;
    color: #fff; padding: 10px 20px; font-size: 14px; display: flex; width: 300px;
    justify-content: center; align-items: center; margin-top: 30px; text-decoration: none;
    border-radius: 5px;" href="${process.env.WEBSITE_URL}">
                        ${createAccount}
                    </a>
                </div>`
        });

        res.status(201).send();
    }

    getLanguageSample(data) {
        if(data?.courses?.length) return data.courses[0];
        if(data?.certificates?.length) return data.certificates[0];
        if(data.situationDescription) return data.situationDescription.slice(0, 100);
        if(data.extraLanguages) return data.extraLanguages;
        return '';
    }

    async translateArray(arr, lang) {
        let translatedArr = [];

        for(const el of arr) {
            const translatedEl = await this.translationService.translateString(el, lang);
            translatedArr.push(translatedEl[0]);
        }

        return translatedArr;
    }

    async translateUserData(userData, files) {
        const languageSample = this.getLanguageSample(userData);
        const lang = languageSample ? await this.translationService.detect(languageSample) : 'pl';

        let originalData = {
            ...userData,
            profileImage: files.profileImage ? files.profileImage[0].path : userData.profileImageUrl,
            bsnNumberDocument: files.bsnNumber ? files.bsnNumber[0].path : userData.bsnNumberDocument,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                return {
                    name: userData.attachments[index].name,
                    path: item.path
                }
            }).concat(userData.oldAttachments) : userData.oldAttachments
        }

        if(lang === 'pl') {
            return originalData;
        }
        else {
            // Translate to Polish
            console.log(originalData.jobs);

            let translatedJobs = [];
            for(const job of originalData.jobs) {
                let translatedTitle = await this.translationService.translateString(job.title, 'pl');
                translatedTitle = translatedTitle[0];
                let translatedResponsibilities = [];

                for(const responsibility of job.responsibilities) {
                    const res = await this.translationService.translateString(responsibility, 'pl');
                    translatedResponsibilities.push(res[0]);
                }

                translatedJobs.push({
                    ...job,
                    title: translatedTitle,
                    responsibilities: translatedResponsibilities
                })
            }

            const translatedSituationDescriptionResponse = await this.translationService.translateString(originalData.situationDescription, 'pl');
            const translatedExtraLanguagesResponse = await this.translationService.translateString(originalData.extraLanguages, 'pl');

            const translatedSituationDescription = translatedSituationDescriptionResponse[0];
            const translatedExtraLanguages = translatedExtraLanguagesResponse[0];

            const translatedCourses = await this.translateArray(typeof originalData.courses === 'string' ? JSON.parse(originalData.courses) : originalData.courses, lang);
            const translatedCertificates = await this.translateArray(typeof originalData.certificates === 'string' ? JSON.parse(originalData.certificates) : originalData.certificates, lang);
            const translatedSkills = await this.translateArray(typeof originalData.skills === 'string' ? JSON.parse(originalData.skills) : originalData.skills, lang);

            // Return translated to Polish version
            return {
                ...originalData,
                extraLanguages: translatedExtraLanguages,
                courses: translatedCourses,
                certificates: translatedCertificates,
                skills: translatedSkills,
                situationDescription: translatedSituationDescription,
                jobs: translatedJobs,
                profileImage: files.profileImage ? files.profileImage[0].path : userData.profileImageUrl,
                bsnNumberDocument: files.bsnNumber ? files.bsnNumber[0].path : userData.bsnNumberDocument,
                attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                    return {
                        name: userData.attachments[index].name,
                        path: item.path
                    }
                }).concat(userData.oldAttachments) : userData.oldAttachments
            }
        }
    }

    async updateUser(data, files) {
        // Modify user data JSON - add file paths
        const email = data.email;
        let userData = JSON.parse(data.userData);

        // Remove translations
        const user = await this.userRepository.findOneBy({
            email
        });
        await this.dynamicTranslationsRepository.delete({
            type: 1,
            id: user.id
        });

        // Translate if not Polish
        userData = await this.translateUserData(userData, files);

        // Add info about jobs length
        let jobsLength = [];
        for(const job of userData.jobs) {
            const fromArray = job.from.split('-');
            const toArray = job.to.split('-');

            if(fromArray.length === 2 && toArray.length === 2) {
                const fromYear = parseInt(fromArray[0]);
                const fromMonth = parseInt(fromArray[1]);

                const toYear = parseInt(toArray[0]);
                const toMonth = parseInt(toArray[1]);

                const yearSubtraction = toYear - fromYear;
                const monthSubtraction = toMonth - fromMonth;

                let years, months;

                if(monthSubtraction < 0) {
                    years = yearSubtraction - 1;
                    months = 12 + monthSubtraction;
                }
                else {
                    years = yearSubtraction;
                    months = monthSubtraction;
                }

                let durationText = '';

                if(years === 1) {
                    durationText += '1 rok';
                }
                else if(years > 1 && years < 5) {
                    durationText += `${years} lata`;
                }
                else if(years >= 5) {
                    durationText += `${years} lat`;
                }

                if(months === 1) {
                    if(years > 0) {
                        durationText += ' i 1 miesiąc';
                    }
                    else {
                        durationText += '1 miesiąc';
                    }
                }
                else if(months > 1 && months < 5) {
                    if(years > 0) {
                        durationText += ` i ${months} miesiące`;
                    }
                    else {
                        durationText += `${months} miesiące`;
                    }
                }
                else if(months >= 5) {
                    if(years > 0) {
                        durationText += ` i ${months} miesięcy`;
                    }
                    else {
                        durationText += `${months} miesięcy`;
                    }
                }

                jobsLength.push(durationText);
            }
            else {
                jobsLength.push('');
            }
        }

        userData = {
            ...userData,
            jobs: userData.jobs.map((item, index) => {
                return {
                    ...item,
                    jobLength: jobsLength[index]
                }
            })
        };

        // Get new latitude and longitude
        if(userData.city) {
            const apiResponse = await lastValueFrom(this.httpService.get(encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${userData.city}`)));
            const apiData = apiResponse.data.data;

            if(apiData?.length) {
                const lat = apiData[0].latitude;
                const lng = apiData[0].longitude;

                // Modify record in database
                return this.userRepository.createQueryBuilder()
                    .update({
                        data: JSON.stringify(userData),
                        email: userData.email,
                        lat,
                        lng
                    })
                    .where({
                        email
                    })
                    .execute();
            }
            else {
                // Modify record in database
                return this.userRepository.createQueryBuilder()
                    .update({
                        data: JSON.stringify(userData),
                        email: userData.email
                    })
                    .where({
                        email
                    })
                    .execute();
            }
        }
        else {
            // Modify record in database
            return this.userRepository.createQueryBuilder()
                .update({
                    data: JSON.stringify(userData),
                    email: userData.email
                })
                .where({
                    email
                })
                .execute();
        }
    }

    async getUser(user, id, lang) {
        const userData = JSON.parse(user.data);
        let userTranslationData;

        lang = getGoogleTranslateLanguageCode(lang);

        if(Object.keys(userData).length === 0 && userData.constructor === Object) {
            return {
                ...user,
                data: JSON.stringify({})
            }
        }
        else {
            // Checking for translation in DB
            const userTranslation = await this.dynamicTranslationsRepository.findBy({
                lang: lang,
                type: 1,
                id: id
            });

            if(userTranslation?.length) {
                userTranslationData = userTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), userTranslateObject);
                userTranslationData = {
                    ...userTranslationData,
                    courses: userTranslationData.courses ? JSON.parse(userTranslationData.courses) : '',
                    certificates: userTranslationData.certificates ? JSON.parse(userTranslationData.certificates) : '',
                    skills: userTranslationData.skills ? JSON.parse(userTranslationData.skills) : '',
                    jobs: userTranslationData.jobs ? JSON.parse(userTranslationData.jobs) : '',
                    schools: userTranslationData.schools ? JSON.parse(userTranslationData.schools) : ''
                }
            }
            else {
                // Translate by Google API
                let translatedJobs = [];
                for(const job of userData.jobs) {
                    let translatedTitleRes = await this.translationService.translateString(job.title, lang);
                    let translatedTitle = translatedTitleRes[0];
                    let translatedResponsibilities = [];

                    for(const responsibility of job.responsibilities) {
                        const res = await this.translationService.translateString(responsibility, lang);
                        translatedResponsibilities.push(res[0]);
                    }

                    let translatedJobLengthRes = await this.translationService.translateString(job.jobLength, lang);
                    let translatedJobLength = translatedJobLengthRes[0];

                    translatedJobs.push({
                        ...job,
                        title: translatedTitle,
                        responsibilities: translatedResponsibilities,
                        jobLength: translatedJobLength
                    });
                }

                let translatedSchools = [];
                for(const school of userData.schools) {
                    let translatedNameRes = await this.translationService.translateString(school.name, lang);
                    let translatedName = translatedNameRes[0];
                    let translatedTitleRes = await this.translationService.translateString(school.title, lang);
                    let translatedTitle = translatedTitleRes[0];

                    translatedSchools.push({
                        ...school,
                        name: translatedName,
                        title: translatedTitle
                    });
                }

                const translatedSituationDescriptionResponse = await this.translationService.translateString(userData.situationDescription, lang);
                const translatedExtraLanguagesResponse = await this.translationService.translateString(userData.extraLanguages, lang);

                const translatedSituationDescription = translatedSituationDescriptionResponse[0];
                const translatedExtraLanguages = translatedExtraLanguagesResponse[0];

                let translatedCourses = await this.translateArray(typeof userData.courses === 'string' ? JSON.parse(userData.courses) : userData.courses, lang);
                let translatedCertificates = await this.translateArray(typeof userData.certificates === 'string' ? JSON.parse(userData.certificates) : userData.certificates, lang);
                let translatedSkills = await this.translateArray(typeof userData.skills === 'string' ? JSON.parse(userData.skills) : userData.skills, lang);

                // Objects
                userTranslationData = {
                    extraLanguages: translatedExtraLanguages,
                    courses: translatedCourses,
                    certificates: translatedCertificates,
                    skills: translatedSkills,
                    situationDescription: translatedSituationDescription,
                    jobs: translatedJobs,
                    schools: translatedSchools
                }

                let translatedUserArray = [userTranslationData.extraLanguages, userTranslationData.courses,
                    userTranslationData.certificates, userTranslationData.skills, userTranslationData.situationDescription,
                    userTranslationData.jobs, userTranslationData.schools];

                // Store in DB
                await this.dynamicTranslationsRepository
                    .createQueryBuilder()
                    .insert()
                    .values(translatedUserArray.map((item, index) => ({
                        type: 1,
                        id: id,
                        field: userTranslateFields[index],
                        lang: lang,
                        value: typeof item === 'string' ? item : JSON.stringify(item)
                    })))
                    .orIgnore()
                    .execute();
            }

            return {
                ...user,
                data: JSON.stringify({
                    ...userData,
                    extraLanguages: userTranslationData.extraLanguages,
                    courses: userTranslationData.courses,
                    certificates: userTranslationData.certificates,
                    skills: userTranslationData.skills,
                    situationDescription: userTranslationData.situationDescription,
                    jobs: userTranslationData.jobs,
                    schools: userTranslationData.schools
                })
            }
        }
    }

    async getUserData(email : string, lang) {
        if(lang === 'pl' || !lang) {
            return this.userRepository.findOneBy({email});
        }
        else {
            const user = await this.userRepository.findOneBy({email});
            return this.getUser(user, user.id, lang);
        }
    }

    async getUserById(id, lang) {
        if(lang === 'pl' || !lang) {
            return this.userRepository.findOneBy({id});
        }
        else {
            const user = await this.userRepository.findOneBy({id});
            return this.getUser(user, id, lang);
        }
    }

    async toggleUserVisibility(email: string) {
        const user = await this.userRepository.findOneBy({email});
        return this.userRepository.createQueryBuilder()
            .update({
                profileVisible: !user.profileVisible
            })
            .where({email})
            .execute();
    }

    async toggleUserWorking(email: string) {
        const user = await this.userRepository.findOneBy({email});
        return this.userRepository.createQueryBuilder()
            .update({
                working: !user.working
            })
            .where({email})
            .execute();
    }

    async getUserApplications(email: string) {
        const user = await this.userRepository.findOneBy({email});
        return this.applicationRepository.findBy({user: user.id});
    }

    async getUserFastApplications(email: string) {
        const user = await this.userRepository.findOneBy({email});
        return this.fastApplicationRepository.findBy({user: user.id});
    }

    async getAllUsers(page) {
        if(!isNaN(page)) {
            const perPage = parseInt(process.env.OFFERS_PER_PAGE);
            return this.userRepository
                .createQueryBuilder()
                .where({
                    active: true
                })
                .limit(perPage)
                .offset((page-1) * perPage)
                .getMany();
        }
        else {
            return this.userRepository
                .createQueryBuilder()
                .where({
                    active: true
                })
                .getMany();
        }
    }

    async getAllVisibleUsers(page) {
        const perPage = parseInt(process.env.OFFERS_PER_PAGE);
        return this.userRepository
            .createQueryBuilder()
            .where({
                active: true,
                profileVisible: true
            })
            .limit(perPage)
            .offset((page-1) * perPage)
            .getMany();
    }

    isElementInArray(el, arr) {
        if(arr) {
            return arr.findIndex((item) => {
                return item === el
            }) !== -1;
        }
        else {
            return false;
        }
    }

    isOneOfElementsInArray(elements, arr) {
        if(arr?.length) {
            return arr.findIndex((item) => {
                return this.isElementInArray(item, elements);
            }) !== -1;
        }
        else {
            return false;
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

    async filter(body) {
        let { fullName, category, country, city, distance, salaryType, salaryFrom, salaryTo,
            salaryCurrency, ownTransport, bsnNumber, languages, drivingLicences, page } = body;

        const distances = [
            100, 50, 40, 30, 20, 10, 5
        ];
        const perPage = parseInt(process.env.OFFERS_PER_PAGE);

        let users = await this.userRepository.findBy({
            active: true,
            profileVisible: true
        });

        if(fullName) {
            users = users.filter((item) => {
                const userFullName = this.removeDiacritics(`${JSON.parse(item.data).firstName} ${JSON.parse(item.data).lastName}`).trim().toLowerCase();
                return userFullName.includes(this.removeDiacritics(fullName).trim().toLowerCase());
            });
        }

        if(category !== -1) {
            users = users.filter((item) => {
               return this.isElementInArray(category, JSON.parse(item.data).categories);
           });
        }

        if(country !== -1) {
            users = users.filter((item) => {
                return JSON.parse(item.data).country === country;
            });
        }

        if(city) {
            // Get distance of each user
            const maxDistance = distances[distance];
            let usersWithDistances = [];

            const apiResponse = await lastValueFrom(this.httpService.get(encodeURI(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${city}`)));
            const apiData = apiResponse.data.data;

            if(apiData?.length) {
                const lat = apiData[0].latitude;
                const lng = apiData[0].longitude;

                for (const user of users) {
                    const destinationLat = user.lat;
                    const destinationLng = user.lng;
                    if(destinationLat && destinationLng) {
                        const distanceResult = calculateDistance(lat, destinationLat, lng, destinationLng);
                        usersWithDistances.push({
                            ...user,
                            distance: distanceResult
                        });
                    }
                }

                // Filter - get only users within range send in filter
                usersWithDistances = usersWithDistances.filter((item) => (item.distance <= maxDistance));

                // Sort them by distance from city send in filter
                usersWithDistances.sort((a, b) => {
                    if(a.distance < b.distance) return 1;
                    else if(a.distance > b.distance) return -1;
                    else {
                        if(a.id < b.id) return 1;
                        else return -1;
                    }
                });

                users = usersWithDistances;
            }
        }

        if(salaryType !== -1 && (salaryFrom || salaryTo)) {
            if(!salaryFrom) salaryFrom = 0;
            if(!salaryTo) salaryTo = 999999;

            users = users.filter((item) => {
                const data = JSON.parse(item.data);
                if(salaryType === parseInt(data.salaryType)) {
                    return (parseInt(data.salaryFrom) >= salaryFrom) && (parseInt(data.salaryTo) <= salaryTo) && salaryCurrency === data.salaryCurrency;
                }
                else if(salaryType === 1 && data.salaryType === 0) {
                    return (parseInt(data.salaryFrom) >= salaryFrom * 4) || (parseInt(data.salaryTo) <= salaryTo * 4);
                }
                else {
                    return (parseInt(data.salaryFrom) * 4 >= salaryFrom) || (parseInt(data.salaryTo) * 4 <= salaryTo);
                }
            });
        }

        if(ownTransport !== null) {
            users = users.filter((item) => {
                return JSON.parse(item.data).ownTransport === ownTransport;
            });
        }

        if(bsnNumber !== null) {
            users = users.filter((item) => {
                return JSON.parse(item.data).hasBsnNumber === bsnNumber;
            });
        }

        if(languages?.length) {
            users = users.filter((item) => {
                const userLanguages = JSON.parse(item.data).languages?.map((item) => (item.language));
                return this.isOneOfElementsInArray(languages, userLanguages);
            });
        }

        if(drivingLicences?.length) {
            users = users.filter((item) => {
                const userDrivingLicences = JSON.parse(item.data).drivingLicenceCategories;
                return this.isOneOfElementsInArray(drivingLicences, userDrivingLicences);
            });
        }

        const startIndex = perPage * (page-1);
        return users.slice(startIndex, startIndex + perPage);
    }

    async getUserNotifications(email) {
        return this.notificationsRepository
            .createQueryBuilder('n')
            .leftJoinAndSelect('user', 'u', 'u.id = n.recipient')
            .leftJoinAndSelect('agency', 'a', 'a.id = n.agencyId')
            .where('u.email = :email AND (n.type = 1 OR n.type = 2)', {email})
            .getRawMany();
    }

    async readNotification(id) {
        return this.notificationsRepository
            .createQueryBuilder()
            .update({
                checked: true
            })
            .where({
                id: id
            })
            .execute();
    }

    async sendContactForm(name, email, msg, deliveryMail) {
        return this.mailerService.sendMail({
            to: deliveryMail,
            from: process.env.EMAIL_ADDRESS,
            subject: 'Nowa wiadomość w formularzu kontaktowym',
            html: `<div>
                    <h2>
                        Ktoś wysłał wiadomość w formularzu kontaktowym na Jooob.eu!
                    </h2>
                    <p>
                        Imię: ${name}<br/>
                        Email: ${email}<br/>
                        Wiadomość: ${msg}
                    </p>
                </div>`
        });
    }

    async remindPassword(email: string, mailContent: string) {
        const user = await this.userRepository.findBy({
            active: true,
            email
        });
        const content = JSON.parse(mailContent);

        if(user?.length) {
            const token = await uuid();
            let expire = new Date();
            expire.setHours(new Date().getHours()+1)
            console.log(expire);

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
                user: email,
                agency: null,
                expire: expire
            });
        }
        else {
            throw new BadRequestException(content[3]);
        }
    }

    async resetPassword(password, email) {
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        return this.userRepository
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

        const user = await this.userRepository.findBy({
            email,
            password: passwordHash
        });

        if(user?.length) {
            const newPasswordHash = crypto
                .createHash('sha256')
                .update(newPassword)
                .digest('hex');

            return this.userRepository
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

