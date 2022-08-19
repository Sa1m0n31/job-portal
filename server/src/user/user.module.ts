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

@Module({
  imports: [
      TypeOrmModule.forFeature([User, User_verification, Application, Fast_applications, Notifications]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 300}
      }),
      MulterModule.register({
          dest: './uploads/user',
      }),
      HttpModule
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
