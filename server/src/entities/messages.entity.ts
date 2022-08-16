import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Messages {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    user: number;

    @Column()
    agency: number;

    @Column()
    chat: string;

    @Column()
    archivedByUser: boolean;

    @Column()
    archivedByAgency: boolean;
}
