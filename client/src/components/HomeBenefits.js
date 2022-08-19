import React from 'react';
import HomeSectionHeader from "./HomeSectionHeader";
import icon1 from '../static/img/dostepnosc.svg'
import icon2 from '../static/img/friends.svg'
import icon3 from '../static/img/dostepnosc.svg'
import icon4 from '../static/img/friends.svg'

const benefits = [
    {
        img: icon1,
        header: 'Dostępność',
        text: 'Oferty pracy, kandydaci i firmy - wszyscy w jednym, łatwo dostępnym miejscu.'
    },
    {
        img: icon2,
        header: 'Intuicyjność',
        text: 'Oferty pracy, kandydaci i firmy - wszyscy w jednym, łatwo dostępnym miejscu.'
    },
    {
        img: icon1,
        header: 'Dostępność',
        text: 'Oferty pracy, kandydaci i firmy - wszyscy w jednym, łatwo dostępnym miejscu.'
    },
    {
        img: icon2,
        header: 'Intuicyjność',
        text: 'Oferty pracy, kandydaci i firmy - wszyscy w jednym, łatwo dostępnym miejscu.'
    }
]

const HomeBenefits = () => {
    return <div className="homeSection homeSection--benefits">
        <HomeSectionHeader content="Korzyści korzystania z platformy" />

        <div className="flex">
            {benefits?.map((item, index) => {
                return <div className="home__benefit flex" key={index}>
                    <figure className="home__benefit__figure center">
                        <img className="img" src={item.img} alt="korzyść" />
                    </figure>
                    <div className="home__benefit__content">
                        <h4 className="home__benefit__header">
                            {item.header}
                        </h4>
                        <p className="home__benefit__text">
                            {item.text}
                        </p>
                    </div>
                </div>
            })}
        </div>
    </div>
};

export default HomeBenefits;
