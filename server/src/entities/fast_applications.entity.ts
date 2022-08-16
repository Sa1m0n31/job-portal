import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Fast_applications {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user: number;

    @Column()
    offer: number;

    @Column()
    message: string;

    @Column()
    preferableContact: string;

    @Column()
    attachments: string;
}
