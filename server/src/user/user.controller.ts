import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req, UnauthorizedException,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {JwtService} from "@nestjs/jwt";

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
        return this.userService.registerUser(body.email, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/verify')
    verifyUser(@Body() body) {
        return this.userService.verifyUser(body.token);
    }

    @Post('/login')
    loginUser(@Body() body) {
        return this.userService.loginUser(body.email, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'bsnNumber', maxCount: 1},
        {name: 'profileImage', maxCount: 1},
        {name: 'attachments', maxCount: 5}
    ]))
    updateUser(@UploadedFiles() files: {
        profileImage?: Express.Multer.File[],
        bsnNumber?: Express.Multer.File[],
        attachments?: Express.Multer.File[]
    }, @Body() body) {
        return this.userService.updateUser(body, files);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserData/:email')
    getUserData(@Param('email') email) {
        return this.userService.getUserData(email);
    }

    @Patch('/toggleUserVisibility/:email')
    toggleUserVisibility(@Param('email') email) {
        return this.userService.toggleUserVisibility(email);
    }

    @Patch('/toggleUserWorking/:email')
    toggleUserWorking(@Param('email') email) {
        return this.userService.toggleUserWorking(email);
    }

    @Get('/getUserApplications/:email')
    getUserApplications(@Param('email') email) {
        return this.userService.getUserApplications(email);
    }

    @Get('/getUserFastApplications/:email')
    getUserFastApplications(@Param('email') email) {
        return this.userService.getUserFastApplications(email);
    }

    @Get('/getAll/:page')
    getAll(@Param('page') page) {
        return this.userService.getAllUsers(page);
    }

    @Get('/getAllVisible/:page')
    getAllVisible(@Param('page') page) {
        return this.userService.getAllVisibleUsers(page);
    }

    @Post('/filter')
    filterUsers(@Body() body) {
        return this.userService.filter(body);
    }

    @Get('/getUserById/:id')
    getUserById(@Param('id') id) {
        return this.userService.getUserById(id);
    }

    @Get('/getNotifications/:email')
    getUserNotifications(@Param('email') email) {
        return this.userService.getUserNotifications(email);
    }

    @Patch('/readNotification')
    readNotification(@Body() body) {
        return this.userService.readNotification(body.id);
    }

    @Post('/sendContactForm')
    sendContactForm(@Body() body) {
        return this.userService.sendContactForm(body.name, body.email, body.msg);
    }
}
