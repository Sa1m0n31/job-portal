import {Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {Express} from "express";
import {OfferService} from "./offer.service";

@Controller('offer')
export class OfferController {
    constructor(
        private readonly offerService: OfferService
    ) {
    }


    @UseGuards(JwtAuthGuard)
    @Post('/add')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'attachments', maxCount: 5}
    ]))
    updateUser(@UploadedFiles() files: {
        image?: Express.Multer.File[],
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.offerService.addOffer(body, files);
    }

    @Get('/getOffersByAgency/:email')
    getOffersByAgency(@Param('email') email) {
        return this.offerService.getOffersByAgency(email);
    }
}
