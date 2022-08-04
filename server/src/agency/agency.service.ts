import {HttpException, Injectable} from '@nestjs/common';
import * as crypto from 'crypto'
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateUserDto} from "../dto/create-user.dto";
import { v4 as uuid } from 'uuid';
import {MailerService} from "@nestjs-modules/mailer";
import {Agency} from "../entities/agency.entity";
import {Agency_verification} from "../entities/agency_verification";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>,
        @InjectRepository(Agency_verification)
        private readonly agencyVerificationRepository: Repository<Agency_verification>,
        private readonly mailerService: MailerService,
        private readonly jwtTokenService: JwtService
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
                data: null
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
}
