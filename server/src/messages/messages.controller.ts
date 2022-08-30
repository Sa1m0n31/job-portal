import {Body, Controller, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {MessagesService} from "./messages.service";
import {JwtAuthGuard} from "../common/jwt-auth.guard";

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getChat/:id')
    getChat(@Param('id') id) {
        return this.messagesService.getChat(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/sendMessage')
    sendMessage(@Body() body) {
        return this.messagesService.sendMessage(body.id, body.user, body.agency, body.title, body.chat);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getUserMessages/:user')
    getUserMessages(@Param('user') user) {
        return this.messagesService.getUserMessages(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/getAgencyMessages/:agency')
    getAgencyMessages(@Param('agency') agency) {
        return this.messagesService.getAgencyMessages(agency);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(`/archiveMessages`)
    archiveMessages(@Body() body) {
        return this.messagesService.archiveMessages(body.ids, body.byAgency);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(`/restoreMessages`)
    restoreMessages(@Body() body) {
        return this.messagesService.restoreMessages(body.ids, body.byAgency);
    }
}
