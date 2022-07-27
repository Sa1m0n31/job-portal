import {Body, Controller, Post} from '@nestjs/common';
import {AgencyService} from "./agency.service";

@Controller('agency')
export class AgencyController {
    constructor(
        private readonly agencyService: AgencyService
    ) {
    }

    @Post('/register')
    registerUser(@Body() body) {
        return this.agencyService.registerAgency(body.email, body.password);
    }

    @Post('/verify')
    verifyUser(@Body() body) {
        return this.agencyService.verifyAgency(body.token);
    }
}
