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
        private readonly mailerService: MailerService,
        private readonly jwtTokenService: JwtService,
        private readonly httpService: HttpService
    ) {
    }

    async registerUser(email: string, password: string) {
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

            await this.userRepository.save(newUser);

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

    async updateUser(data, files) {
        // Modify user data JSON - add file paths
        const email = data.email;
        let userData = JSON.parse(data.userData);

        userData = {
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

    async getUserData(email : string) {
        return this.userRepository.findOneBy({email});
    }

    async getUserById(id) {
        return this.userRepository.findOneBy({id});
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

    async filter(body) {
        let { category, country, city, distance, salaryType, salaryFrom, salaryTo,
            salaryCurrency, ownTransport, bsnNumber, languages, drivingLicences, page } = body;

        const distances = [
            100, 50, 40, 30, 20, 10, 5
        ];
        const perPage = parseInt(process.env.OFFERS_PER_PAGE);

        let users = await this.userRepository.findBy({
            active: true,
            profileVisible: true
        });

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

