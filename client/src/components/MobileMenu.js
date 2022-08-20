import React, {useEffect, useState} from 'react';
import closeIcon from '../static/img/left-blue-arrow.svg'
import {agencyMenu, homeMenu, userMenu} from "../static/content";
import LanguageSwitcher from "./LanguageSwitcher";

const MobileMenu = ({closeMenu, type}) => {
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        if(type) {
            switch(type) {
                case 2:
                    setMenu(userMenu);
                    break;
                case 3:
                    setMenu(agencyMenu);
                    break;
                default:
                    setMenu(homeMenu);
                    break;
            }
        }
    }, [type])

    return <div className="mobileMenu">
        <div className="mobileMenu__top flex">
            <h3 className="mobileMenu__top__header">
                Nawigacja
            </h3>
            <button className="mobileMenu__close" onClick={() => { closeMenu(); }}>
                <img className="img" src={closeIcon} alt="zamknij" />
            </button>
        </div>

        <div className="mobileMenu__menu">
            {menu.map((item, index) => {
                return <a className="mobileMenu__link"
                          onClick={(e) => { closeMenu(); }}
                          key={index}
                          href={item.link}>
                    {item.label}
                </a>
            })}
        </div>

        <div className="mobileMenu__bottom">
            {type === 1 ? <div className="mobileMenu__bottom__user">
                <a href="/strefa-pracownika" className="btn--bare">
                    Logowanie
                </a>
                <a href="/rejestracja" className="btn btn--white">
                    Załóż konto
                </a>
            </div> : ''}
            <div className="mobileMenu__bottom__bottom flex">
                <div className="mobileMenu__bottom__bottom__links flex flex--start">
                    <a href="/regulamin">
                        Regulamin
                    </a>
                    <a href="/polityka-prywatnosci">
                        Polityka prywatności
                    </a>
                </div>

                <LanguageSwitcher />
            </div>
        </div>
    </div>
};

export default MobileMenu;
