import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import {JwtStrategy} from "../common/jwt.strategy";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {Admin} from "../entities/admin.entity";
import {Agency} from "../entities/agency.entity";
import {User} from "../entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Agency, User]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {expiresIn: 60 * 300}
    })
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy]
})
export class AdminModule {}
