import React, {useContext, useEffect} from 'react';
import closeIcon from "../static/img/close-icon.svg";
import {languageVersions} from "../static/content";
import {LanguageContext} from "../App";

const LanguagePopup = ({closeModal}) => {
    const { language, setLanguage } = useContext(LanguageContext);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                closeModal();
            }
        });
    }, []);

    return <div className="modal modal--filters modal--filters--users modal--languages center">
        <div className="modal__inner noscroll">
            <button className="modal__inner__closeBtn"
                    onClick={() => { closeModal(); }}
            >
                <img className="img" src={closeIcon} alt="zamknij" />
            </button>
            <h3 className="modal__header">
                Wybierz język
            </h3>
            <div className="languages flex">
                {languageVersions.map((item, index) => {
                    return <button className="languages__btn" key={index}
                                   onClick={() => { setLanguage(item); }}>
                        <span className={`fi fi-${item.toLowerCase()}`}></span>
                    </button>
                })}
            </div>
        </div>
    </div>
};

export default LanguagePopup;
