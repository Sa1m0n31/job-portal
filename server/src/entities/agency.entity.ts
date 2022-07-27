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
        nullable: true
    })
    data: string;

    @Column({
        default: false
    })
    active: boolean;
}
