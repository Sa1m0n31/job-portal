import React, {useContext, useEffect} from "react";
import HomeSectionHeader from "./HomeSectionHeader";
import icon1 from "../static/img/magnifier-icon.svg"
import icon2 from '../static/img/bubble-chat.svg'
import icon3 from '../static/img/approved.svg'
import {LanguageContext} from "../App";

const icons = [icon1, icon2, icon3];

const Tools = () => {
    const { c } = useContext(LanguageContext);

    return <div className="homeSection homeSection--tools" id="funkcje">
        <HomeSectionHeader content={c.toolsHeader} />

        <div className="tools flex">
            {JSON.parse(c.toolsContent)?.map((item, index) => {
                if(index !== 2) {
                    return <div key={index} className="tools__item">
                        <figure className="tools__figure center">
                            <img className="img" src={icons[index]} alt="img" />
                        </figure>
                        <h5 className="tools__header">
                            {item.header}
                        </h5>
                        <p className="tools__text">
                            {item.text}
                        </p>
                    </div>
                }
            })}
        </div>
    </div>
};

export default Tools;
