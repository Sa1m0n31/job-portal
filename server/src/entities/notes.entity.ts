import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Notes {
    @PrimaryColumn()
    agency_id: number;

    @PrimaryColumn()
    user_id: number;

    @Column()
    content: string;
}
