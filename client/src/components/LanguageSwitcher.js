import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from "../App";
import arrowDown from '../static/img/arrow-down.svg'
import LanguagePopup from "./LanguagePopup";
import {languageVersions} from "../static/content";

const LanguageSwitcher = ({horizontal}) => {
    const { language } = useContext(LanguageContext);

    const [currentLanguage, setCurrentLanguage] = useState(0);
    const [languagesVisible, setLanguagesVisible] = useState(false);

    useEffect(() => {
        localStorage.setItem('lang', language);
        setLanguagesVisible(false);
        setCurrentLanguage(languageVersions.findIndex((item) => {
            return item === language;
        }));
    }, [language]);

    return <div className={horizontal ? "languageSwitcher languageSwitcher--horizontal" : "languageSwitcher"}>
        {currentLanguage >= 0 ?  <button className="languageSwitcher__currentLang flex"
                                         onClick={() => { !languagesVisible ? setLanguagesVisible(true) : setLanguagesVisible(false); }}>
            <span className={`fi fi-${languageVersions[currentLanguage].toLowerCase()}`}></span>
            {languageVersions[currentLanguage]}
            <img className="arrowDown" src={arrowDown} alt="rozwiń" />
        </button> : ''}

        {languagesVisible ? <LanguagePopup closeModal={() => { setLanguagesVisible(false); }} /> : ''}
    </div>
};

export default LanguageSwitcher;
