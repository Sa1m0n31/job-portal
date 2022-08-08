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
        let agencyData = JSON.parse(data.agencyData);

        // Add filenames
        agencyData = {
            ...agencyData,
            image: files.image ? files.image[0].path : agencyData.imageUrl,
            attachments: files.attachments ? Array.from(files.attachments).map((item: any) => {
                return item.path;
            }) : data.attachments
        }

        const { title, category, keywords, country, postalCode, city, description,
            responsibilities, requirements, benefits, salaryType, salaryFrom, salaryTo,
            salaryCurrency, contractType, timeBounded, expireDay, expireMonth, expireYear,
            image, attachments
        } = agencyData;

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

    async getOffersByAgency(email) {
        // Get agency id
        const agency = await this.agencyRepository.findOneBy({email});
        const agencyId = agency.id;

        // Get job offers
        return this.offerRepository.findBy({agency: agencyId});
    }
}
