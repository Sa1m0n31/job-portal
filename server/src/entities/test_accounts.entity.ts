import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class TestAccounts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column()
    expire_date: Date;
}
