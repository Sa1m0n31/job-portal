import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {User_verification} from "../entities/user_verification";
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from "../common/jwt.strategy";

@Module({
  imports: [
      TypeOrmModule.forFeature([User, User_verification]),
      JwtModule.register({
          secret: process.env.JWT_KEY,
          signOptions: {expiresIn: 60 * 30}
      })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule {}
