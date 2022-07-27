import { Module } from '@nestjs/common';
import {AgencyController} from './agency.controller';
import {AgencyService} from './agency.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Agency} from "../entities/agency.entity";
import {Agency_verification} from "../entities/agency_verification";

@Module({
  imports: [
      TypeOrmModule.forFeature([Agency, Agency_verification])
  ],
  controllers: [AgencyController],
  providers: [AgencyService]
})
export class AgencyModule {}
