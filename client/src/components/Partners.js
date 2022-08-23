import React, {useContext} from "react";
import HomeSectionHeader from "./HomeSectionHeader";
import logo from "../static/img/google.png"
import arrow from "../static/img/right-blue-arrow.svg"
import {LanguageContext} from "../App";

const logos = [logo, logo, logo, logo];
const links = ["https://google.com", "https://google.com", "https://google.com", "https://google.com"];

const Partners = () => {
    const { c } = useContext(LanguageContext);

    return <div className="homeSection homeSection--partners" id="partnerzy">
        <HomeSectionHeader content={c.partnersHeader} />

        <div className="partners flex">
            {JSON.parse(c.partnersContent)?.map((item, index) => {
                return <div className="partners__item flex flex--start" key={index}>
                    <figure className="partners__figure center">
                        <img className="img" src={logos[index]} alt="logo" />
                    </figure>
                    <div className="partners__content">
                        <h4 className="partners__header">
                            {item.name}
                        </h4>
                        <p className="partners__text">
                            {item.text}
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
