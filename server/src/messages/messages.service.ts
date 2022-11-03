import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Messages} from "../entities/messages.entity";
import {In, Repository} from "typeorm";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Messages)
        private readonly messagesRepository: Repository<Messages>,
        private readonly mailerService: MailerService
    ) {
    }

    async getChat(id: number) {
        return this.messagesRepository.findOneBy({
            id
        });
    }

    async sendMessage(id: number, user: number, agency: number, title: string, chat, email) {
        if(user && agency && title) {
            // Send mail notification
            await this.mailerService.sendMail({
                to: email,
                from: process.env.EMAIL_ADDRESS,
                subject: 'You have new message at jooob.eu!',
                html: `<div>
                    <h2>
                        Someone wrote to you at jooob.eu!
                    </h2>
                    <p>
                        Log in to check your message and respond:
                    </p>
                    <a href="${process.env.WEBSITE_URL}">
                        Go to jooob.eu
                    </a>
                </div>`
            });

            return this.messagesRepository.save({
                id, user, agency, title,
                chat: JSON.stringify(chat),
                archivedByUser: false,
                archivedByAgency: false
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
        return this.messagesRepository
            .createQueryBuilder('m')
            .where({user})
            .innerJoinAndSelect('agency', 'a', 'a.id = m.agency')
            .innerJoinAndSelect('user', 'u', 'u.id = m.user')
            .getRawMany();
    }

    async getAgencyMessages(agency: number) {
        return this.messagesRepository
            .createQueryBuilder('m')
            .where({agency})
            .innerJoinAndSelect('user', 'u', 'u.id = m.user')
            .innerJoinAndSelect('agency', 'a', 'a.id = m.agency')
            .getRawMany();
    }

    async archiveMessages(ids, byAgency) {
        return this.messagesRepository
            .createQueryBuilder()
            .update(byAgency ? {
                archivedByAgency: true
            } : {
                archivedByUser: true
            })
            .where({
                id: In(ids)
            })
            .execute();
    }

    async restoreMessages(ids, byAgency) {
        return this.messagesRepository
            .createQueryBuilder()
            .update(byAgency ? {
                archivedByAgency: false
            } : {
                archivedByUser: false
            })
            .where({
                id: In(ids)
            })
            .execute();
    }
}
