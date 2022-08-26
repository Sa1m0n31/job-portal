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
import {fileExtensionFilter} from "../common/FileExtensionFilter";

@Controller('offer')
export class OfferController {
    constructor(
        private readonly offerService: OfferService
    ) {
    }

    @Get('/getActive/:page/:lang')
    getActiveOffers(@Param('page') page, @Param('lang') lang) {
        return this.offerService.getActiveOffers(page, lang);
    }

    @Get('/get/:id/:lang')
    getOfferById(@Param('id') id, @Param('lang') lang) {
        return this.offerService.getOfferById(id, lang);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/add')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'attachments', maxCount: 5}
    ], {
        fileFilter: fileExtensionFilter,
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
        fileFilter: fileExtensionFilter,
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

    @Get('/getOffersByAgency/:email/:lang')
    getOffersByAgency(@Param('email') email, @Param('lang') lang) {
        return this.offerService.getOffersByAgency(email, lang);
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
        fileFilter: fileExtensionFilter,
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

    @Post('/filter')
    filterOffers(@Body() body) {
        const { page, title, category, country, city, distance, salaryFrom, salaryTo, salaryType,
            salaryCurrency, lang } = body;
        return this.offerService.filterOffers(page, title, category, country, city, distance,
            salaryFrom, salaryTo, salaryType, salaryCurrency, lang);
    }

    @Get('/getActiveFastOffers/:lang')
    getActiveFastOffers(@Param('lang') lang) {
        return this.offerService.getActiveFastOffers(lang);
    }

    @Get('/getFastOffer/:id/:lang')
    getFastOfferById(@Param('id') id, @Param('lang') lang) {
        return this.offerService.getFastOfferById(id, lang);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/addFastOffer')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'attachments', maxCount: 5}
    ], {
        fileFilter: fileExtensionFilter,
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads/offer'
        })
    }))
    addFastOffer(@UploadedFiles() files: {
        image?: Express.Multer.File[],
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.offerService.addFastOffer(body, files);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/updateFastOffer')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'attachments', maxCount: 5}
    ], {
        fileFilter: fileExtensionFilter,
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads/offer'
        })
    }))
    updateFastOffer(@UploadedFiles() files: {
        image?: Express.Multer.File[],
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.offerService.updateFastOffer(body, files);
    }

    @Get('/getFastOffersByAgency/:email/:lang')
    getFastOffersByAgency(@Param('email') email, @Param('lang') lang) {
        return this.offerService.getFastOffersByAgency(email, lang);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/deleteFastOffer/:id')
    deleteFastOffer(@Param('id') id) {
        return this.offerService.deleteFastOffer(id);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'attachments', maxCount: 5}
    ], {
        fileFilter: fileExtensionFilter,
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: './uploads/offer'
        })
    }))
    @Post('/addFastApplication')
    addFastApplication(@UploadedFiles() files: {
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.offerService.addFastApplication(body, files);
    }

    @Get('/getApplicationsByAgency/:email')
    getApplicationsByAgency(@Param('email') email) {
        return this.offerService.getApplicationsByAgency(email);
    }

    @Get('/getFastApplicationsByAgency/:email')
    getFastApplicationsByAgency(@Param('email') email) {
        return this.offerService.getFastApplicationsByAgency(email);
    }
}
