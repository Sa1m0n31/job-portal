import React from 'react';
import img from '../static/img/baner-testowy.png'

const adsLink = 'https://facebook.com';

const AdsSection = () => {
    return <div className="adsSection center">
        <a href={adsLink} className="adsLink">
            <img className="img" src={img} alt="img" />
        </a>
    </div>
};

export default AdsSection;
