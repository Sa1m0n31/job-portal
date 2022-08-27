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

    @Post('/blockAgency')
    blockAgency(@Body() body) {
        return this.adminService.blockAgency(body.id);
    }

    @Post('/blockUser')
    blockUser(@Body() body) {
        return this.adminService.blockUser(body.id);
    }

    @Post('/unblockAgency')
    unblockAgency(@Body() body) {
        return this.adminService.unblockAgency(body.id);
    }

    @Post('/unblockUser')
    unblockUser(@Body() body) {
        return this.adminService.unblockUser(body.id);
    }

    @Post('/acceptAgency')
    acceptAgency(@Body() body) {
        return this.adminService.acceptAgency(body.id);
    }
}
