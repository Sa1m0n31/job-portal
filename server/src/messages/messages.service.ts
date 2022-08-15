import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Messages} from "../entities/messages.entity";
import {Repository} from "typeorm";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Messages)
        private readonly messagesRepository: Repository<Messages>
    ) {
    }

    async getChat(id: number) {
        return this.messagesRepository.findOneBy({
            id
        });
    }

    async sendMessage(id: number, user: number, agency: number, title: string, chat) {
        if(user && agency && title) {
            return this.messagesRepository.save({
                id, user, agency, title,
                chat: JSON.stringify(chat)
            });
        }
        else if(id) {
            return this.messagesRepository.save({
                id,
                chat: JSON.stringify(chat)
            });
        }
    }

    async getUserMessages(user: number) {
        return this.messagesRepository.findBy({user});
    }

    async getAgencyMessages(agency: number) {
        return this.messagesRepository.findBy({agency});
    }
}
