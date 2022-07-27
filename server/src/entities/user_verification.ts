import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class User_verification {
    @PrimaryColumn()
    email: string;

    @Column()
    token: string;
}
