import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Offer} from "../entities/offer.entity";
import {Repository} from "typeorm";
import {Agency} from "../entities/agency.entity";

@Injectable()
export class OfferService {
    constructor(
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
        @InjectRepository(Agency)
        private readonly agencyRepository: Repository<Agency>
    ) {
    }


    async addOffer(data, files) {
        let offerData = JSON.parse(data.offerData);

        // Add filenames
        offerData = {
            ...offerData,
            image: files.image ? files.image[0].path : offerData.imageUrl,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                return {
                    name: offerData.attachments[index].name,
                    path: item.path
                }
            }) : data.attachments
        }

        // Get offer data
        const { title, category, keywords, country, postalCode, city, description,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded, expireDay, expireMonth, expireYear,
            image, attachments
        } = offerData;

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Add record to database
        return this.offerRepository.insert({
            id: null,
            agency: agencyId,
            title, category, keywords, country, postalCode, city, description,
            responsibilities: JSON.stringify(responsibilities),
            requirements: JSON.stringify(requirements),
            benefits: JSON.stringify(benefits),
            salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded,
            expireDay, expireMonth, expireYear, image,
            attachments: JSON.stringify(attachments)
        });
    }

    async updateOffer(data, files) {
        let offerData = JSON.parse(data.offerData);

        // Add filenames
        offerData = {
            ...offerData,
            image: files.image ? files.image[0].path : offerData.imageUrl,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any, index) => {
                return {
                    name: offerData.attachments[index].name,
                    path: item.path
                }
            }).concat(offerData.oldAttachments) : offerData.oldAttachments
        }

        // Get offer data
        const { id, title, category, keywords, country, postalCode, city, description,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded, expireDay, expireMonth, expireYear,
            image, attachments
        } = offerData;

        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email: data.email});
        const agencyId = agency.id;

        // Update record in database
        return this.offerRepository.createQueryBuilder()
            .update({
                agency: agencyId,
                title, category, keywords, country, postalCode, city, description,
                responsibilities: JSON.stringify(responsibilities),
                requirements: JSON.stringify(requirements),
                benefits: JSON.stringify(benefits),
                salaryType, salaryFrom, salaryTo,
                salaryCurrency, contractType, timeBounded,
                expireDay, expireMonth, expireYear, image,
                attachments: JSON.stringify(attachments)
            })
            .where({id})
            .execute();
    }

    async getOffersByAgency(email) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get job offers
        return this.offerRepository.findBy({agency: agencyId});
    }

    async deleteOffer(id) {
        return this.offerRepository.delete({id});
    }

    async getOfferById(id) {
        return this.offerRepository.findOneBy({id});
    }
}
