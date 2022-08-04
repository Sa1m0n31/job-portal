import {Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import {AgencyService} from "./agency.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {Express} from "express";

@Controller('agency')
export class AgencyController {
    constructor(
        private readonly agencyService: AgencyService
    ) {
    }

    @Post('/register')
    registerUser(@Body() body) {
        return this.agencyService.registerAgency(body.email, body.password);
    }

    @Post('/login')
    loginAgency(@Body() body) {
        return this.agencyService.loginAgency(body.email, body.password);
    }

    @Post('/verify')
    verifyUser(@Body() body) {
        return this.agencyService.verifyAgency(body.token);
    }

    @Get('/getAgencyData/:email')
    getAgencyData(@Param('email') email) {
        return this.agencyService.getAgencyData(email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'logo', maxCount: 1},
        {name: 'gallery', maxCount: 15}
    ]))
    updateUser(@UploadedFiles() files: {
        logo?: Express.Multer.File[],
        gallery?: Express.Multer.File[]
    }, @Body() body) {
        return this.agencyService.updateAgency(body, files);
    }
}
