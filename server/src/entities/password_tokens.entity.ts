import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Password_tokens {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    user: string;

    @Column()
    agency: string;

    @Column()
    expire: Date;
}
