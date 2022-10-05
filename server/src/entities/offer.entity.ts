import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    agency: number;

    @Column()
    title: string;

    @Column()
    category: string;

    @Column()
    keywords: string;

    @Column()
    country: number;

    @Column()
    postalCode: string;

    @Column()
    city: string;

    @Column()
    manyLocations: string;

    @Column()
    description: string;

    @Column()
    responsibilities: string;

    @Column()
    requirements: string;

    @Column()
    benefits: string;

    @Column()
    salaryType: number;

    @Column()
    salaryFrom: number;

    @Column()
    salaryTo: number;

    @Column()
    salaryCurrency: number;

    @Column()
    contractType: string;

    @Column()
    timeBounded: boolean;

    @Column()
    expireDay: number;

    @Column()
    expireMonth: number;

    @Column()
    expireYear: number;

    @Column()
    image: string;

    /*
        {
            name: 'filename.txt',
            path: 'dsfjdkljlkejdes'
        }
     */
    @Column()
    attachments: string;

    @Column()
    extraInfo: string;

    @Column()
    created_at: Date;

    @Column()
    lat: number;

    @Column()
    lng: number;

    @Column()
    show_agency_info: boolean;
}
