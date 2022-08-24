import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Static_translations} from "../entities/static_translations";
import {Repository} from "typeorm";
import {Dynamic_translations} from "../entities/dynamic_translations";
const {Translate} = require('@google-cloud/translate').v2;
const translate = require('google-translate-api');

@Injectable()
export class TranslationService {
    constructor(
        @InjectRepository(Static_translations)
        private readonly staticRepository: Repository<Static_translations>,
        @InjectRepository(Dynamic_translations)
        private readonly dynamicRepository: Repository<Dynamic_translations>
    ) {
    }

    hasJSONStructure(str) {
        if (typeof str !== 'string') return false;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return type === '[object Object]'
                || type === '[object Array]';
        } catch (err) {
            return false;
        }
    }

    async getSiteContent(lang) {
        return this.staticRepository.findBy({
            lang
        });
    }

    async translate(from, to, saveAs) {
        const siteContent = await this.staticRepository.findBy({
            lang: from
        });
        const translationBase = siteContent.map((item) => {
            return {
                field: item.field,
                value: item.value
            }
        });

        const translate = new Translate();
        let translationResult = [];

        async function translateText(chunk, translateLanguage = null) {
            let [translations] = await translate.translate(chunk.value, translateLanguage ? translateLanguage : to);

            translations = Array.isArray(translations) ? translations : [translations];

            translations.forEach((translation, i) => {
                translationResult.push({
                    field: chunk.field,
                    value: translation
                });
            });
        }

        // const saveAsArray = ["DK", "DE", "EE", "FI", "FR", "NL",
        //     "GR", "HU", "IT", "LV", "LT", "MT", "PT", "RO", "SK",
        //     "SI", "ES", "SE", "NO", "UA", "TR", "BY"].map((item) => (item.toLowerCase()));
        // const languagesCodes = ['da', 'de', 'et', 'fi', 'fr', 'nl', 'el', 'hu', 'it', 'lv', 'lt', 'mt', 'pt',
        //     'ro', 'sk', 'si', 'es', 'sv', 'no', 'uk', 'tr', 'be'];

        const saveAsArray = ["SE", "NO", "UA", "TR", "BY"].map((item) => (item.toLowerCase()));
        const languagesCodes = ['sv', 'no', 'uk', 'tr', 'be'];

        if(to === 'all') {
            let i = 0;
            for(const lang of languagesCodes) {
                console.log(`lang = ${lang}...`);
                for(const chunk of translationBase) {
                    await translateText(chunk, lang);
                }

                await this.staticRepository
                    .createQueryBuilder()
                    .insert()
                    .values(translationResult.map((item) => ({
                        field: item.field,
                        lang: saveAsArray[i],
                        value: item.value
                    })))
                    .execute();
                translationResult = [];
                i++;
            }
        }
        else {
            for(const chunk of translationBase) {
                await translateText(chunk);
                console.log(translationResult[translationResult.length-1]);
            }

            // Save to DB
            return this.staticRepository
                .createQueryBuilder()
                .insert()
                .values(translationResult.map((item) => ({
                    field: item.field,
                    lang: saveAs,
                    value: item.value
                })))
                .execute();
        }
    }
}
