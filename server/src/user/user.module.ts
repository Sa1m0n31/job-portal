import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {User_verification} from "../entities/user_verification";
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from "../common/jwt.strategy";
import {MulterModule} from "@nestjs/platform-express";
import {Application} from "../entities/applications.entity";
import {HttpModule} from "@nestjs/axios";
import {Fast_applications} from "../entities/fast_applications.entity";
import {Notifications} from "../entities/notifications.entity";
import {Password_tokens} from "../entities/password_tokens.entity";
import {Static_translations} from "../entities/static_translations";
import {Dynamic_translations} from "../entities/dynamic_translations";
import {TranslationModule} from "../translation/translation.module";
import {TranslationService} from "../translation/translation.service";

@Module({
  imports: [
      TypeOrmModule.forFeature([User, User_verification, Application, Fast_applications,
          Notifications, Password_tokens, Static_translations, Dynamic_translations]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 300}
      }),
      MulterModule.register({
          dest: './uploads/user',
      }),
      HttpModule,
      TranslationModule
  ],
  controllers: [UserController],
  providers: [UserService, TranslationService, JwtStrategy]
})
export class UserModule {}
