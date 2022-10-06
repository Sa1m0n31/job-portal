import {Body, Controller, Post} from '@nestjs/common';
import {NewsletterService} from "./newsletter.service";

@Controller('newsletter')
export class NewsletterController {
    constructor(
        private readonly newsletterService: NewsletterService
    ) {
    }

    @Post('/addNewContact')
    addToNewsletter(@Body() body) {
        console.log('addNew');
        return this.newsletterService.addNewContact(body.email);
    }
}
