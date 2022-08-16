import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Fast_offer {
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
    street: string;

    @Column()
    accommodationCountry: number;

    @Column()
    accommodationPostalCode: string;

    @Column()
    accommodationCity: string;

    @Column()
    accommodationStreet: string;

    @Column()
    accommodationDay: number;

    @Column()
    accommodationMonth: number;

    @Column()
    accommodationYear: number;

    @Column()
    accommodationHour: string;

    @Column()
    startDay: number;

    @Column()
    startMonth: number;

    @Column()
    startYear: number;

    @Column()
    startHour: string;

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
    contractType: number;

    @Column()
    contactPerson: string;

    @Column()
    contactNumberCountry: number;

    @Column()
    contactNumber: string;

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
    created_at: Date;

    @Column()
    lat: number;

    @Column()
    lng: number;
}
