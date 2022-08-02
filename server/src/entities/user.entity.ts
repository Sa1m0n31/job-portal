import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
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
        default: true
    })
    profileVisible: boolean;

    @Column({
        default: false
    })
    working: boolean;

    @Column({
        default: false
    })
    active: boolean;
}
