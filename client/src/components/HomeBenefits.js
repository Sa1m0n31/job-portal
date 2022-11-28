import React, {useContext, useEffect} from "react";
import HomeSectionHeader from "./HomeSectionHeader";
import icon1 from "../static/img/dostepnosc.svg"
import icon2 from "../static/img/friends.svg"
import icon3 from "../static/img/hand-shake.svg"
import icon4 from "../static/img/like-icon.svg"
import {LanguageContext} from "../App";

const icons = [icon1, icon2, icon3, icon4]

const HomeBenefits = () => {
    const { c } = useContext(LanguageContext);

    return <div className="homeSection homeSection--benefits">
        <HomeSectionHeader content={c.benefitsHeader} />

        <div className="flex">
            {c.benefitsContent ? JSON.parse(c.benefitsContent)?.map((item, index) => {
                return <div className="home__benefit flex" key={index}>
                    <figure className="home__benefit__figure center">
                        <img className="img" src={icons[index]} alt="korzyść" />
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
            }) : ''}
        </div>
    </div>
};

export default HomeBenefits;
