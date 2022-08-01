import React, {useContext, useEffect, useState} from 'react';
import poland from '../static/img/poland.svg'
import {LanguageContext} from "../App";
import arrowDown from '../static/img/arrow-down.svg'

const languages = [
    {
        code: 'PL',
        flag: poland
    },
    {
        code: 'EN',
        flag: poland
    },
    {
        code: 'NL',
        flag: poland
    }
]

const LanguageSwitcher = ({horizontal}) => {
    const { language, setLanguage } = useContext(LanguageContext);

    const [currentLanguage, setCurrentLanguage] = useState(0);
    const [languagesVisible, setLanguagesVisible] = useState(false);

    useEffect(() => {
        localStorage.setItem('lang', language);
        setLanguagesVisible(false);
        setCurrentLanguage(languages.findIndex((item) => {
            return item.code === language;
        }));
    }, [language]);

    return <div className={horizontal ? "languageSwitcher languageSwitcher--horizontal" : "languageSwitcher"}>
        {currentLanguage >= 0 ?  <button className="languageSwitcher__currentLang flex"
                                         onClick={() => { !languagesVisible ? setLanguagesVisible(true) : setLanguagesVisible(false); }}>
            <img className="img" src={languages[currentLanguage].flag} alt={languages[currentLanguage].code} />
            {languages[currentLanguage].code}
            <img className="arrowDown" src={arrowDown} alt="rozwiń" />
        </button> : ''}
        {languagesVisible ? <div className="languageSwitcher__languages">
            {languages.map((item, index) => {
                if(index !== currentLanguage) {
                    return <button key={index}
                                   className="languageSwitcher__btn flex"
                                   onClick={() => { setLanguage(languages[index].code); }}>
                            <img className="img" src={item.flag} alt={item.code} />
                        {item.code}
                    </button>
                }
            })}
        </div> : ''}
    </div>
};

export default LanguageSwitcher;
