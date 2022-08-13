import {HttpException, Injectable} from '@nestjs/common';
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

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(User_verification)
        private readonly userVerificationRepository: Repository<User_verification>,
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
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
        const payload = { username: email, sub: password };
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
            attachments: files.attachments ? Array.from(files.attachments).map((item: any) => {
                console.log(item);
                return item.path;
            }) : data.attachments
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

    async getAllUsers(page) {
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
}

