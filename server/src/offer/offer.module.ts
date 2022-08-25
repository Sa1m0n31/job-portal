import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import {JwtStrategy} from "../common/jwt.strategy";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {MulterModule} from "@nestjs/platform-express";
import {Offer} from "../entities/offer.entity";
import {Agency} from "../entities/agency.entity";
import {Application} from "../entities/applications.entity";
import {HttpModule} from "@nestjs/axios";
import {Fast_offer} from "../entities/fast_offer.entity";
import {Fast_applications} from "../entities/fast_applications.entity";
import {Notifications} from "../entities/notifications.entity";
import {TranslationModule} from "../translation/translation.module";
import {TranslationService} from "../translation/translation.service";
import {Static_translations} from "../entities/static_translations";
import {Dynamic_translations} from "../entities/dynamic_translations";

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer, Agency, Application, User, Fast_offer,
      Fast_applications, Notifications, Static_translations, Dynamic_translations]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {expiresIn: 60 * 300}
    }),
    MulterModule.register({
      dest: './uploads/offer',
    }),
      HttpModule,
      TranslationModule
  ],
  controllers: [OfferController],
  providers: [OfferService, TranslationService, JwtStrategy]
})
export class OfferModule {}
