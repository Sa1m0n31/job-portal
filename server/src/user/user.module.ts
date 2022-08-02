import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {User_verification} from "../entities/user_verification";
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from "../common/jwt.strategy";
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
      TypeOrmModule.forFeature([User, User_verification]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 300}
      }),
      MulterModule.register({
          dest: './uploads/user',
      })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
