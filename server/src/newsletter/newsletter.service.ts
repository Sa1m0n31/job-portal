import { Injectable } from '@nestjs/common';
const mailchimp = require("@mailchimp/mailchimp_marketing");

@Injectable()
export class NewsletterService {
    async addNewContact(email) {
        mailchimp.setConfig({
            apiKey: process.env.MAILCHIMP_API_KEY,
            server: process.env.MAILCHIMP_API_SERVER
        });

        const listId = process.env.MAILCHIMP_AUDIENCE_ID;
        const subscribingUser = {
            firstName: email,
            lastName: "Nazwisko",
            email: email
        };

        console.log(email);
        console.log('add new service');

        return mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed"
        });
    }
}
