import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Static_translations {
    @PrimaryColumn()
    field: string;

    @Column()
    lang: string;

    @Column()
    value: string;
}
