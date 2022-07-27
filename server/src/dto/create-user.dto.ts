import {IsJSON, IsString} from 'class-validator';

export class CreateUserDto {
    constructor(props) {
        this.email = props.email;
        this.password = props.password;
        this.data = props.data;
    }

    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsJSON()
    readonly data: string;
}
