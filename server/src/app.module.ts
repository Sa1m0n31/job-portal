import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import * as Joi from "@hapi/joi";
import {MailerModule} from "@nestjs-modules/mailer";
import {AgencyModule} from "./agency/agency.module";
import {join} from "path";
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [UserModule, AgencyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(3306)
      })
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true, // models will be loaded automatically
      synchronize: false // your entities will be synced with the database(recommended: disable in prod)
    }),
    MailerModule.forRoot({
      transport: `smtp://${process.env.EMAIL_ADDRESS}:${process.env.EMAIL_PASSWORD}@${process.env.EMAIL_HOST}`,
      defaults: {
        from: process.env.EMAIL_ADDRESS,
        tls: {
          rejectUnauthorized: false
        },
        secure: false
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
