import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Agency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column({
        nullable: true,
        length: 64000
    })
    data: string;

    @Column({
        default: false
    })
    active: boolean;

    @Column({
        default: false
    })
    accepted: boolean;
}
