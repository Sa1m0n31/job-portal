import {Body, Controller, Get, Param, Post} from '@nestjs/common';
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

    @Get('/getAgencyData/:email')
    getAgencyData(@Param('email') email) {
        return this.agencyService.getAgencyData(email);
    }
}
