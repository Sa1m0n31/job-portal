import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {MessagesService} from "./messages.service";

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService
    ) {
    }

    @Get('/getChat/:id')
    getChat(@Param('id') id) {
        return this.messagesService.getChat(id);
    }

    @Post('/sendMessage')
    sendMessage(@Body() body) {
        return this.messagesService.sendMessage(body.id, body.user, body.agency, body.title, body.chat);
    }

    @Get('/getUserMessages/:user')
    getUserMessages(@Param('user') user) {
        return this.messagesService.getUserMessages(user);
    }

    @Get('/getAgencyMessages/:agency')
    getAgencyMessages(@Param('agency') agency) {
        return this.messagesService.getAgencyMessages(agency);
    }

    @Patch(`/archiveMessages`)
    archiveMessages(@Body() body) {
        return this.messagesService.archiveMessages(body.ids, body.byAgency);
    }

    @Patch(`/restoreMessages`)
    restoreMessages(@Body() body) {
        return this.messagesService.restoreMessages(body.ids, body.byAgency);
    }
}
