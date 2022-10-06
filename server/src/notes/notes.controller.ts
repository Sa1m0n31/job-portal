import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {NotesService} from "./notes.service";

@Controller('notes')
export class NotesController {
    constructor(
        private readonly notesService: NotesService
    ) {
    }

    @Post('/updateNotes')
    updateNotes(@Body() body) {
        return this.notesService.updateNotes(body.user, body.agency, body.content);
    }

    @Get('/getNotes/:user/:agency')
    getNotes(@Param() params) {
        return this.notesService.getNotes(params.user, params.agency);
    }
}
