import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user: number;

    @Column()
    offer: number;

    @Column()
    message: string;

    @Column()
    friendLink: string;

    @Column()
    preferableContact: string;

    @Column()
    attachments: string;
}
