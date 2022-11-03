import React, {useContext, useEffect, useState} from "react";
import HomeSectionHeader from "./HomeSectionHeader";
import logo1 from '../static/img/partner1.png'
import appLogo from '../static/img/logo-czarne.png'
import arrow from "../static/img/right-blue-arrow.svg"
import {LanguageContext} from "../App";

const logos = [logo1, appLogo, logo1, logo1];
const links = ["https://kampania.euro-tax.pl/zwrot-podatku/b2b/?source=AMB", "https://skylo-test4.pl/kontakt", "https://google.com", "https://google.com"];

const Partners = () => {
    const { c } = useContext(LanguageContext);

    const [parts, setParts] = useState('[]');

    useEffect(() => {
        if(c) {
            setParts(c.partnersContent.replace(' name ', 'name').replace(' text ', 'text'));
        }
    }, [c]);

    return <div className="homeSection homeSection--partners" id="partnerzy">
        <HomeSectionHeader content={c.partnersHeader} />

        <div className="partners flex">
            {JSON.parse(parts)?.map((item, index) => {
                return <div className="partners__item flex flex--start" key={index}>
                    <figure className="partners__figure center">
                        <img className="img" src={logos[index]} alt="logo" />
                    </figure>
                    <div className="partners__content">
                        <h4 className="partners__header">
                            {item.name}
                        </h4>
                        <p className="partners__text" dangerouslySetInnerHTML={{
                            __html: item.text
                        }}>
                        </p>
                        <a href={links[index]}
                           className="partners__link"
                           target="_blank" rel="noreferrer">
                            {c.getToKnowMore}
                            <img className="img" src={arrow} alt="arrow" />
                        </a>
                    </div>
                </div>
            })}
        </div>
    </div>
};

export default Partners;
