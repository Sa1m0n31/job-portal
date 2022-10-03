import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from "../App";
import arrowDown from '../static/img/arrow-down.svg'
import LanguagePopup from "./LanguagePopup";
import {languageVersions} from "../static/content";

const LanguageSwitcher = ({horizontal, mobile, mobileHomepage, setLanguagePopupVisible}) => {
    const { language } = useContext(LanguageContext);

    const [currentLanguage, setCurrentLanguage] = useState(0);
    const [languagesVisible, setLanguagesVisible] = useState(false);

    useEffect(() => {
        if(!currentLanguage || currentLanguage < 0) {
            setCurrentLanguage(5);
        }
    }, [currentLanguage]);

    useEffect(() => {
        localStorage.setItem('lang', language);
        setLanguagesVisible(false);
        setCurrentLanguage(languageVersions.findIndex((item) => {
            return item === language;
        }));
    }, [language]);

    const toggleLanguagePopup = () => {
        if(!languagesVisible) {
            if(mobile) {
                setLanguagePopupVisible(true);
            }
            else {
                setLanguagesVisible(true);
            }
        }
        else {
            if(mobile) {
                setLanguagePopupVisible(false);
            }
            else {
                setLanguagesVisible(false);
            }
        }
    }

    return <div className={horizontal ? "languageSwitcher languageSwitcher--horizontal" : (mobileHomepage ? "languageSwitcher languageSwitcher--mobileHomepage" : "languageSwitcher")}>
        {currentLanguage >= 0 ?  <button className="languageSwitcher__currentLang flex"
                                         onClick={() => { toggleLanguagePopup(); }}>
            <span className={`fi fi-${languageVersions[currentLanguage].toLowerCase()}`}></span>

            {!mobileHomepage ? languageVersions[currentLanguage] : ''}

            {!mobileHomepage ? <img className="arrowDown" src={arrowDown} alt="rozwiń" /> : ''}
        </button> : ''}

        {languagesVisible && !mobile ? <LanguagePopup closeModal={() => { setLanguagesVisible(false); }} /> : ''}
    </div>
};

export default LanguageSwitcher;
