import {Body, Controller, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../common/jwt-auth.guard";
import {JwtService} from "@nestjs/jwt";
import {AdminService} from "./admin.service";

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/auth')
    auth(@Req() req) {
        const decodedJwt: any = this.jwtService.decode(req.headers.authorization.split(' ')[1]);

        if((decodedJwt.username !== req.body.username) ||
            (decodedJwt.role !== req.body.role) ||
            (decodedJwt.role !== 'admin')) {
            throw new UnauthorizedException();
        }

        return true;
    }

    @Post('/login')
    loginAdmin(@Body() body) {
        return this.adminService.loginAdmin(body.username, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/blockAgency')
    blockAgency(@Body() body) {
        return this.adminService.blockAgency(body.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/blockUser')
    blockUser(@Body() body) {
        return this.adminService.blockUser(body.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/unblockAgency')
    unblockAgency(@Body() body) {
        return this.adminService.unblockAgency(body.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/unblockUser')
    unblockUser(@Body() body) {
        return this.adminService.unblockUser(body.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/acceptAgency')
    acceptAgency(@Body() body) {
        return this.adminService.acceptAgency(body.id);
    }
}
