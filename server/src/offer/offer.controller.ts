import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {Express} from "express";
import {OfferService} from "./offer.service";
import {diskStorage} from "multer";
import {FileUploadHelper} from "../common/FileUploadHelper";

@Controller('offer')
export class OfferController {
    constructor(
        private readonly offerService: OfferService
    ) {
    }

    @Get('/getActive')
    getActiveOffers() {
        return this.offerService.getActiveOffers();
    }

    @Get('/get/:id')
    getOfferById(@Param('id') id) {
        return this.offerService.getOfferById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'attachments', maxCount: 5}
    ], {
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads/offer'
        })
    }))
    addOffer(@UploadedFiles() files: {
        image?: Express.Multer.File[],
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.offerService.addOffer(body, files);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'attachments', maxCount: 5}
    ], {
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads/offer'
        })
    }))
    updateOffer(@UploadedFiles() files: {
        image?: Express.Multer.File[],
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.offerService.updateOffer(body, files);
    }

    @Get('/getOffersByAgency/:email')
    getOffersByAgency(@Param('email') email) {
        return this.offerService.getOffersByAgency(email);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    deleteOffer(@Param('id') id) {
        return this.offerService.deleteOffer(id);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'attachments', maxCount: 5}
    ], {
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads/offer'
        })
    }))
    @Post('/addApplication')
    addApplication(@UploadedFiles() files: {
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.offerService.addApplication(body, files);
    }
}
