import {Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
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

    @UseGuards(JwtAuthGuard)
    @Get('/getAgencyData/:email/:lang')
    getAgencyData(@Param('email') email, @Param('lang') lang) {
        return this.agencyService.getAgencyData(email, lang);
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

    @UseGuards(JwtAuthGuard)
    @Get('/getAllApproved/:page')
    getAllApprovedAgencies(@Param('page') page) {
        return this.agencyService.getAllApprovedAgencies(page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getAllAgencies/:page')
    getAllAgencies(@Param('page') page) {
        return this.agencyService.getAllAgencies(page);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/filter')
    filterAgencies(@Body() body) {
        return this.agencyService.filterAgencies(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getAgencyById/:id/:lang')
    getAgencyById(@Param('id') id, @Param('lang') lang) {
        return this.agencyService.getAgencyById(id, lang);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getNotifications/:email')
    getAgencyNotifications(@Param('email') email) {
        return this.agencyService.getAgencyNotifications(email);
    }

    @Post('/remindPassword')
    remindPassword(@Body() body) {
        return this.agencyService.remindPassword(body.email);
    }

    @Get('/verifyPasswordToken/:token')
    verifyToken(@Param('token') token) {
        return this.agencyService.verifyPasswordToken(token);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/changePassword')
    changePassword(@Body() body) {
        return this.agencyService.changePassword(body.oldPassword, body.newPassword, body.email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/resetPassword')
    resetPassword(@Body() body) {
        return this.agencyService.resetPassword(body.password, body.email);
    }
}
