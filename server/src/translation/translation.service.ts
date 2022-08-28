import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Static_translations} from "../entities/static_translations";
import {Repository} from "typeorm";
import {Dynamic_translations} from "../entities/dynamic_translations";
import {removeLanguageSpecificCharacters} from "../common/removeLanguageSpecificCharacters";
const {Translate} = require('@google-cloud/translate').v2;

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

    async detect(text) {
        const translate = new Translate();

        async function detectLanguage() {
            let [detections] = await translate.detect(text);
            detections = Array.isArray(detections) ? detections : [detections];
            return detections[0].language;
        }

        return detectLanguage();
    }

    async translateContent(content, to) {
        const translate = new Translate();
        let translationResult = [];

        async function translateText(chunk) {
            let translations = [];

            if(chunk?.length) {
                if(Array.isArray(chunk[0])) {
                    for(const el of chunk) {
                        let res = await translate.translate(el, to);
                        translations.push(res[1].data.translations.map((item) => {
                            return item.translatedText;
                        }));
                    }
                }
                else {
                    console.log('else');
                    console.log(chunk);
                    console.log(typeof chunk);
                    const res  = await translate.translate(chunk, to);
                    if(res[1].data.translations.length === 1) {
                        translations = res[1].data.translations[0].translatedText;
                    }
                    else {
                        translations = res[1].data.translations.map((item) => (item.translatedText));
                    }
                }

                translations = Array.isArray(translations) ? removeLanguageSpecificCharacters(JSON.stringify(translations.map((item) => (item)))) : translations;
                translationResult.push(translations);
            }
            else {
                console.log('empty');
                translationResult.push('');
            }
        }

        if(Array.isArray(content)) {
            console.log('content is array');
            for(const chunk of content) {
                await translateText(chunk);
            }
        }
        else {
            await translateText(content);
        }

        return translationResult.length === 1 ? translationResult[0].toString() : translationResult;
    }

    async translate(from, to, saveAs, field = '') {
        let siteContent;

        if(field) {
            siteContent = await this.staticRepository.findBy({
                lang: from,
                field: field
            });
        }
        else {
            siteContent = await this.staticRepository.findBy({
                lang: from
            });
        }

        console.log(siteContent);

        const translationBase = siteContent.map((item) => {
            return {
                field: item.field,
                value: item.value
            }
        });

        console.log(translationBase);

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

        const saveAsArray = ["BG", "HR", "CZ", "DK", "DE", "GB", "EE", "FI", "FR", "NL",
            "GR", "HU", "IT", "LV", "LT", "MT", "PT", "RO", "SK",
            "SI", "ES", "SE", "NO", "UA", "TR", "BY"].map((item) => (item.toLowerCase()));
        const languagesCodes = ['bg', 'hr', 'cs', 'da', 'de', 'en', 'et', 'fi', 'fr', 'nl', 'el', 'hu', 'it', 'lv', 'lt', 'mt', 'pt',
            'ro', 'sk', 'si', 'es', 'sv', 'no', 'uk', 'tr', 'be'];

        if(to === 'all') {
            let i = 0;
            for(const lang of languagesCodes) {
                for(const chunk of translationBase) {
                    console.log('translating... ' + chunk);
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
