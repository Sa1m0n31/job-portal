import React from 'react';
import img from '../static/img/baner-testowy.png'
import img1 from '../static/img/logowanie.png'
import img2 from '../static/img/login-agencja.png'

const adsLink = 'https://facebook.com';

const AdsSection = () => {
    return <div className="adsSection center">
        <a href={adsLink} className="adsLink">
            <img className="img" src={img} alt="img" />
        </a>
        <div className="adsBottom flex">
            <figure className="adsBottom__item">
                <img className="img" src={img1} alt="img1" />
            </figure>
            <figure className="adsBottom__item">
                <img className="img" src={img2} alt="img1" />
            </figure>
        </div>
    </div>
};

export default AdsSection;
