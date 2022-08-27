import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Admin} from "../entities/admin.entity";
import {Repository} from "typeorm";
import * as crypto from 'crypto'
import {JwtService} from "@nestjs/jwt";
import {Agency} from "../entities/agency.entity";
import {User} from "../entities/user.entity";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtTokenService: JwtService
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
