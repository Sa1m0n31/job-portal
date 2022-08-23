import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Dynamic_translations {
    @Column()
    type: number;

    @Column()
    id: number;

    @PrimaryColumn()
    field: string;

    @Column()
    lang: string;

    @Column()
    value: string;
}
