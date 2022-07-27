import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/auth')
    auth() {
        console.log('auth user');
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
}
