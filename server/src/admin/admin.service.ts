import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Admin} from "../entities/admin.entity";
import {Repository} from "typeorm";
import * as crypto from 'crypto'
import {JwtService} from "@nestjs/jwt";
import {Agency} from "../entities/agency.entity";
import {User} from "../entities/user.entity";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtTokenService: JwtService,
        private readonly mailerService: MailerService,
    ) {
    }

    async loginAdmin(username: string, password: string) {
        const payload = { username: username, sub: password, role: 'admin' };
        const passwordHash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const user = await this.adminRepository.findOneBy({
            username,
            password: passwordHash
        });

        if(user) {
            return {
                access_token: this.jwtTokenService.sign(payload, {
                    secret: process.env.JWT_KEY
                })
            }
        }
        else {
            throw new HttpException('Niepoprawna nazwa użytkownika lub hasło', 401);
        }
    }

    async blockAgency(id: number) {
        return this.agencyRepository
            .createQueryBuilder()
            .update()
            .set({
                blocked: true
            })
            .where({
                id
            })
            .execute();
    }

    async blockUser(id: number) {
        return this.userRepository
            .createQueryBuilder()
            .update()
            .set({
                blocked: true
            })
            .where({
                id
            })
            .execute();
    }

    async unblockAgency(id: number) {
        return this.agencyRepository
            .createQueryBuilder()
            .update()
            .set({
                blocked: false
            })
            .where({
                id
            })
            .execute();
    }

    async unblockUser(id: number) {
        return this.userRepository
            .createQueryBuilder()
            .update()
            .set({
                blocked: false
            })
            .where({
                id
            })
            .execute();
    }

    async acceptAgency(id: number) {
        // Get agency email
        const res = await this.agencyRepository.findOneBy({
            id
        });
        const email = res.email;

        // Send mail with info to agency
        await this.mailerService.sendMail({
            to: email,
            from: process.env.EMAIL_ADDRESS,
            subject: 'Your profile was confirmed!',
            html: `<div>
                    <h2>
                        Your account at jooob.eu has been confirmed by our administrator!
                    </h2>
                    <p>
                        Log in to add new job offers and check candidates CVs at jooob.eu!
                    </p>
                    <a href="${process.env.WEBSITE_URL}/strefa-pracodawcy">
                        ${process.env.WEBSITE_URL}/strefa-pracodawcy
                    </a>
                </div>`
        });

        return this.agencyRepository
            .createQueryBuilder()
            .update()
            .set({
                accepted: true
            })
            .where({
                id
            })
            .execute();
    }
}
