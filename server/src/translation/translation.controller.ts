import {Controller, Get, Param} from '@nestjs/common';
import {TranslationService} from "./translation.service";

@Controller('translation')
export class TranslationController {
    constructor(
        private readonly translationService: TranslationService
    ) {
    }

    @Get('/getSiteContent/:lang')
    getSiteContent(@Param('lang') lang) {
        return this.translationService.getSiteContent(lang);
    }
}
