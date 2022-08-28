import {Body, Controller, Get, Param, Post} from '@nestjs/common';
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

    @Post('/translate')
    translateSiteContent(@Body() body) {
        return this.translationService.translate(body.from, body.to, body.saveAs, body.field);
    }

    @Post('/detect')
    detectLanguage(@Body() body) {
        return this.translationService.detect(body.text);
    }
}
