import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import {JwtStrategy} from "../common/jwt.strategy";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {User_verification} from "../entities/user_verification";
import {JwtModule} from "@nestjs/jwt";
import {MulterModule} from "@nestjs/platform-express";
import {Offer} from "../entities/offer.entity";
import {Agency} from "../entities/agency.entity";
import {Application} from "../entities/applications.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Agency, Application, User]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {expiresIn: 60 * 300}
    }),
    MulterModule.register({
      dest: './uploads/offer',
    }),
      HttpModule
  ],
  controllers: [OfferController],
  providers: [OfferService, JwtStrategy]
})
export class OfferModule {}
