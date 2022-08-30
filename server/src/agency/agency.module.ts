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
import {Notifications} from "../entities/notifications.entity";
import {Password_tokens} from "../entities/password_tokens.entity";
import {TranslationModule} from "../translation/translation.module";
import {TranslationService} from "../translation/translation.service";
import {Static_translations} from "../entities/static_translations";
import {Dynamic_translations} from "../entities/dynamic_translations";

@Module({
  imports: [
      TypeOrmModule.forFeature([Agency, Agency_verification, Offer, Notifications,
          Password_tokens, Static_translations, Dynamic_translations]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 300}
      }),
      MulterModule.register({
          dest: '../uploads/agency',
      }),
      HttpModule,
      TranslationModule
  ],
  controllers: [AgencyController],
  providers: [AgencyService, TranslationService]
})
export class AgencyModule {}
