import {HttpException, Injectable} from '@nestjs/common';
import * as crypto from 'crypto'
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateUserDto} from "../dto/create-user.dto";
import { v4 as uuid } from 'uuid';
import {MailerService} from "@nestjs-modules/mailer";
import {Agency} from "../entities/agency.entity";
import {Agency_verification} from "../entities/agency_verification";

@Injectable()
export class AgencyService {
    constructor(
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>,
        @InjectRepository(Agency_verification)
        private readonly agencyVerificationRepository: Repository<Agency_verification>,
        private readonly mailerService: MailerService
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

            await this.agencyRepository.save(newUser);

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

    async getAgencyData(email: string) {
        return this.agencyRepository.findOneBy({email});
    }
}
