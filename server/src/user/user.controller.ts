import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req, Res, UnauthorizedException,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {JwtService} from "@nestjs/jwt";
import {fileExtensionFilter} from "../common/FileExtensionFilter";
import {diskStorage} from "multer";
import {FileUploadHelper} from "../common/FileUploadHelper";
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/auth')
    auth(@Req() req) {
        const decodedJwt: any = this.jwtService.decode(req.headers.authorization.split(' ')[1]);

        if((decodedJwt.username !== req.body.email) || (decodedJwt.role !== req.body.role) || (decodedJwt.role !== 'user')) {
            throw new UnauthorizedException();
        }

        return true;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/authAgency')
    authAgency(@Req() req) {
        const decodedJwt: any = this.jwtService.decode(req.headers.authorization.split(' ')[1]);

        if((decodedJwt.username !== req.body.email) || (decodedJwt.role !== req.body.role) || (decodedJwt.role !== 'agency')) {
            throw new UnauthorizedException();
        }

        return true;
    }

    @Post('/register')
    registerUser(@Body() body) {
        return this.userService.registerUser(body.email, body.password, body.newsletter, body.mailContent);
    }

    @Post('/verify')
    verifyUser(@Body() body) {
        return this.userService.verifyUser(body.token);
    }

    @Post('/login')
    loginUser(@Body() body) {
        return this.userService.loginUser(body.email, body.password, body.mailContent);
    }

    @Post('/sendInvitation')
    sendInvitation(@Body() body, @Res() res: Response) {
        return this.userService.sendInvitation(body.email, body.name, body.createAccount, body.content, res);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'bsnNumber', maxCount: 1},
        {name: 'profileImage', maxCount: 1},
        {name: 'attachments', maxCount: 5},
        {name: 'test', maxCount: 1}
    ], {
        fileFilter: fileExtensionFilter,
        storage: diskStorage({
            filename: FileUploadHelper.customFileName,
            destination: '../uploads/user'
        })
    }))
    updateUser(@UploadedFiles() files: {
        profileImage?: Express.Multer.File[],
        bsnNumber?: Express.Multer.File[],
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.userService.updateUser(body, files);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserData/:email/:lang')
    getUserData(@Param('email') email, @Param('lang') lang) {
        return this.userService.getUserData(email, lang);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/toggleUserVisibility/:email')
    toggleUserVisibility(@Param('email') email) {
        return this.userService.toggleUserVisibility(email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/toggleUserWorking/:email')
    toggleUserWorking(@Param('email') email) {
        return this.userService.toggleUserWorking(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserApplications/:email')
    getUserApplications(@Param('email') email) {
        return this.userService.getUserApplications(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserFastApplications/:email')
    getUserFastApplications(@Param('email') email) {
        return this.userService.getUserFastApplications(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getAll/:page')
    getAll(@Param('page') page) {
        return this.userService.getAllUsers(page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getAllVisible/:page')
    getAllVisible(@Param('page') page) {
        return this.userService.getAllVisibleUsers(page);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/filter')
    filterUsers(@Body() body) {
        return this.userService.filter(body);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('/getUserById/:id/:lang')
    getUserById(@Param('id') id, @Param('lang') lang) {
        return this.userService.getUserById(id, lang);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getNotifications/:email')
    getUserNotifications(@Param('email') email) {
        return this.userService.getUserNotifications(email);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/readNotification')
    readNotification(@Body() body) {
        return this.userService.readNotification(body.id);
    }

    @Post('/sendContactForm')
    sendContactForm(@Body() body) {
        return this.userService.sendContactForm(body.name, body.email, body.msg, body.deliveryMail);
    }

    @Post('/remindPassword')
    remindPassword(@Body() body) {
        return this.userService.remindPassword(body.email, body.mailContent);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/changePassword')
    changePassword(@Body() body) {
        return this.userService.changePassword(body.oldPassword, body.newPassword, body.email);
    }

    @Patch('/resetPassword')
    resetPassword(@Body() body) {
        return this.userService.resetPassword(body.password, body.email);
    }
}
