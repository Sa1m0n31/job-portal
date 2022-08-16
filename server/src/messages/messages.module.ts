import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {Messages} from "../entities/messages.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Messages]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {expiresIn: 60 * 300}
    })
  ],
  providers: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
