import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Agency_verification {
    @PrimaryColumn()
    email: string;

    @Column()
    token: string;
}
