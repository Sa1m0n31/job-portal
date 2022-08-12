import { Module } from '@nestjs/common';
import {AgencyController} from './agency.controller';
import {AgencyService} from './agency.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Agency} from "../entities/agency.entity";
import {Agency_verification} from "../entities/agency_verification";
import {JwtModule} from "@nestjs/jwt";
import {MulterModule} from "@nestjs/platform-express";
import {Offer} from "../entities/offer.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [
      TypeOrmModule.forFeature([Agency, Agency_verification, Offer]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 300}
      }),
      MulterModule.register({
          dest: './uploads/agency',
      }),
      HttpModule
  ],
  controllers: [AgencyController],
  providers: [AgencyService]
})
export class AgencyModule {}
