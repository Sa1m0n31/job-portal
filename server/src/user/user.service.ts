import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
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

    async registerUser(email: string, password: string, newsletter: boolean) {
        const existingUser = await this.userRepository.findOneBy({
            email
        });

        if(existingUser) {
            throw new HttpException('Użytkownik z podanym adresem e-mail już istnieje', 400);
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

            await this.userRepository.save(newUser);

            console.log(newsletter);
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

    async loginUser(email: string, password: string) {
        const payload = { username: email, sub: password, role: 'user' };
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

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
                    throw new HttpException('Twoje konto zostało zablokowane', 423);
                }
            }
            else {
                throw new HttpException('Aktywuj swoje konto', 403);
            }
        }
        else {
            throw new HttpException('Niepoprawna nazwa użytkownika lub hasło', 401);
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

    async translateUserData(userData, files) {
        const languageSample = this.getLanguageSample(userData);
        const lang = languageSample ? await this.translationService.detect(languageSample) : 'pl';

        if(lang === 'pl') {
            return {
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
        }
        else {
            const originalData = {
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

            // Translate to Polish
            const jobTitles = originalData.jobs ? originalData.jobs.map((item) => (item.title)) : '';
            const jobResponsibilities = originalData.jobs ? originalData.jobs.map((item) => (item.responsibilities)) : '';
            const jobLength = originalData.jobs ? originalData.jobs.map((item) => (item.jobLength)) : '';

            const contentToTranslate = [originalData.extraLanguages, originalData.courses,
                originalData.certificates, originalData.situationDescription, jobTitles, jobResponsibilities, jobLength];
            const polishVersionResponse = await this.translationService.translateContent(JSON.stringify(contentToTranslate), 'pl');
            const polishVersion = JSON.parse(polishVersionResponse);

            console.log(polishVersionResponse);

            // Add filenames
            return {
                ...originalData,
                extraLanguages: polishVersion[0],
                courses: polishVersion[1],
                certificates: polishVersion[2],
                situationDescription: polishVersion[3],
                jobs: originalData.jobs.map((item, index) => {
                   return {
                       ...item,
                       title: polishVersion[4][index],
                       responsibilities: polishVersion[5][index],
                       jobLength: polishVersionResponse[6][index]
                   }
                }),
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
                    durationText += ' i 1 miesiąc';
                }
                else if(months > 1 && months < 5) {
                    durationText += ` i ${months} miesiące`;
                }
                else if(months >= 5) {
                    durationText += ` i ${months} miesięcy`;
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

        // Checking for translation in DB
        const userTranslation = await this.dynamicTranslationsRepository.findBy({
            lang: lang,
            type: 1,
            id: id
        });

        if(userTranslation?.length) {
            console.log('yes');
            userTranslationData = userTranslation.reduce((acc, cur) => ({...acc, [cur.field]: cur.value}), userTranslateObject);
            userTranslationData = {
                ...userTranslationData,
                courses: userTranslationData.courses ? JSON.parse(userTranslationData.courses) : '',
                certificates: userTranslationData.certificates ? JSON.parse(userTranslationData.certificates) : '',
                jobTitles: userTranslationData.jobTitles ? JSON.parse(userTranslationData.jobTitles) : '',
                jobResponsibilities: userTranslationData.jobResponsibilities ? JSON.parse(userTranslationData.jobResponsibilities) : '',
                jobLength: userTranslationData.jobLength ? JSON.parse(userTranslationData.jobLength) : ''
            }
        }
        else {
            // Translate by Google API
            const jobsTitles = userData.jobs ? userData.jobs.map((item) => (item.title)) : [];
            const jobsResponsibilities = userData.jobs ? userData.jobs.map((item) => (item.responsibilities)) : [];
            const jobsLength = userData.jobs ? userData.jobs.map((item) => (item.jobLength)) : [];

            let translatedUserArray = await this.translationService.translateContent([userData.extraLanguages,
                userData.courses, userData.certificates, userData.situationDescription,
                jobsTitles, jobsResponsibilities, jobsLength], lang);

            // Strings
            translatedUserArray = translatedUserArray.map((item, index) => {
                if (index === 1 || index === 2 || index === 4) {
                    if (typeof item === 'string') {
                        if(item.slice(0, 2) !== '["' || item.split("").reverse().join("").slice(0, 2) !== ']"') {
                            // Not array-like
                            return removeLanguageSpecificCharacters(`["${item}"]`);
                        }
                        else {
                            // Array-like
                            return removeLanguageSpecificCharacters(item);
                        }
                    }
                    else {
                        if(item) {
                            return removeLanguageSpecificCharacters(JSON.stringify(item));
                        }
                        else {
                            return "";
                        }
                    }
                } else if (index === 5) {
                    return item ? removeLanguageSpecificCharacters(item) : '';
                } else {
                    return item;
                }
            });

            // Objects
            userTranslationData = {
                extraLanguages: translatedUserArray[0],
                courses: translatedUserArray[1] ? JSON.parse(translatedUserArray[1]) : '',
                certificates: translatedUserArray[2] ? JSON.parse(translatedUserArray[2]) : '',
                situationDescription: translatedUserArray[3],
                jobTitles: translatedUserArray[4] ? JSON.parse(translatedUserArray[4]) : '',
                jobResponsibilities: translatedUserArray[5] ? JSON.parse(translatedUserArray[5]) : '',
                jobLength: translatedUserArray[6] ? JSON.parse(translatedUserArray[6]) : ''
            }

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
                situationDescription: userTranslationData.situationDescription,
                jobs: userData?.jobs ? userData.jobs.map((item, index) => {
                    return {
                        ...item,
                        title: userTranslationData.jobTitles[index],
                        responsibilities: userTranslationData.jobResponsibilities[index],
                        jobLength: userTranslationData.jobLength[index]
                    }
                }) : ''
            })
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

    async sendContactForm(name, email, msg) {
        return this.mailerService.sendMail({
            to: process.env.CONTACT_FORM_ADDRESS,
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

    async remindPassword(email: string) {
        const user = await this.userRepository.findBy({
            active: true,
            email
        });

        if(user?.length) {
            const token = await uuid();
            const expire = new Date().setHours(new Date().getHours()+1);

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
                user: email,
                agency: null,
                expire: expire
            });
        }
        else {
            throw new BadRequestException('Podany użytkownik nie istnieje');
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

