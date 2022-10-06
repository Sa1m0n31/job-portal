import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Notes} from "../entities/notes.entity";
import {Repository} from "typeorm";

@Injectable()
export class NotesService {
    constructor(
        @InjectRepository(Notes)
        private readonly notesRepository: Repository<Notes>
    ) {
    }

    async updateNotes(user: number, agency: number, content: string) {
        return this.notesRepository.save({
            user_id: user,
            agency_id: agency,
            content: content
        });
    }

    async getNotes(user: number, agency: number) {
        console.log(user, agency);
        return this.notesRepository.findOneBy({
            agency_id: agency,
            user_id: user
        });
    }
}
