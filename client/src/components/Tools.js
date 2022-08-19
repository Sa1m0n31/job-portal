import React from 'react';
import HomeSectionHeader from "./HomeSectionHeader";
import icon1 from '../static/img/magnifier-icon.svg'

const items = [
    {
        img: icon1,
        header: 'Wyszukiwarka ofert',
        text: 'Portal umożliwia znajdowanie ofert, wyszukując na podstawie takich kryteriów jak branża, widełki płacowe czy miejsce pracy.'
    },
    {
        img: icon1,
        header: 'Wyszukiwarka ofert',
        text: 'Portal umożliwia znajdowanie ofert, wyszukując na podstawie takich kryteriów jak branża, widełki płacowe czy miejsce pracy.'
    },
    {
        img: icon1,
        header: 'Wyszukiwarka ofert',
        text: 'Portal umożliwia znajdowanie ofert, wyszukując na podstawie takich kryteriów jak branża, widełki płacowe czy miejsce pracy.'
    }
]

const Tools = () => {
    return <div className="homeSection homeSection--tools" id="funkcje">
        <HomeSectionHeader content="Dostępne narzędzia" />

        <div className="tools flex">
            {items?.map((item, index) => {
                return <div key={index} className="tools__item">
                    <figure className="tools__figure center">
                        <img className="img" src={item.img} alt="img" />
                    </figure>
                    <h5 className="tools__header">
                        {item.header}
                    </h5>
                    <p className="tools__text">
                        {item.text}
                    </p>
                </div>
            })}
        </div>
    </div>
};

export default Tools;
