import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Notifications {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: number;

    @Column()
    link: string;

    @Column()
    recipient: number;

    @Column()
    agencyId: number;

    @Column()
    userId: number;

    @Column()
    checked: boolean;
}
