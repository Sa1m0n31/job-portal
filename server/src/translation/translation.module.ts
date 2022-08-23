import { Module } from '@nestjs/common';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {Static_translations} from "../entities/static_translations";
import {Dynamic_translations} from "../entities/dynamic_translations";

@Module({
  imports: [
    TypeOrmModule.forFeature([Static_translations, Dynamic_translations]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {expiresIn: 60 * 300}
    })
  ],
  controllers: [TranslationController],
  providers: [TranslationService]
})
export class TranslationModule {}
