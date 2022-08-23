import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Static_translations} from "../entities/static_translations";
import {Repository} from "typeorm";
import {Dynamic_translations} from "../entities/dynamic_translations";

@Injectable()
export class TranslationService {
    constructor(
        @InjectRepository(Static_translations)
        private readonly staticRepository: Repository<Static_translations>,
        @InjectRepository(Dynamic_translations)
        private readonly dynamicRepository: Repository<Dynamic_translations>
    ) {
    }

    async getSiteContent(lang) {
        return this.staticRepository.findBy({
            lang
        });
    }
}
