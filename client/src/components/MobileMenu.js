import React, {useContext, useEffect, useState} from 'react';
import closeIcon from '../static/img/left-blue-arrow.svg'
import {adminMenu, adminMenuLabels, agencyMenu, homeMenu, userMenu} from "../static/content";
import LanguageSwitcher from "./LanguageSwitcher";
import {LanguageContext} from "../App";

const MobileMenu = ({closeMenu, type}) => {
    const [menuLabels, setMenuLabels] = useState([]);
    const [menu, setMenu] = useState([]);
    const { c } = useContext(LanguageContext);

    useEffect(() => {
        if(type && c.userMenuLabels) {
            console.log(type);
            switch(type) {
                case 2:
                    setMenu(userMenu);
                    setMenuLabels(JSON.parse(c.userMenuLabels));
                    break;
                case 3:
                    setMenu(agencyMenu);
                    setMenuLabels(JSON.parse(c.agencyMenuLabels));
                    break;
                case 4:
                    setMenu(adminMenu);
                    setMenuLabels(adminMenuLabels);
                    break;
                default:
                    setMenu(homeMenu);
                    setMenuLabels(JSON.parse(c.homeMenuLabels));
                    break;
            }
        }
    }, [type, c])

    return <div className="mobileMenu">
        <div className="mobileMenu__top flex">
            <h3 className="mobileMenu__top__header">
                {c.navigation}
            </h3>
            <button className="mobileMenu__close" onClick={() => { closeMenu(); }}>
                <img className="img" src={closeIcon} alt="zamknij" />
            </button>
        </div>

        <div className="mobileMenu__menu">
            {menu.map((item, index) => {
                return <a className="mobileMenu__link"
                          onClick={() => { closeMenu(); }}
                          key={index}
                          href={item.link}>
                    {menuLabels[index]}
                </a>
            })}
        </div>

        <div className="mobileMenu__bottom">
            {type === 1 ? <div className="mobileMenu__bottom__user">
                <a href="/strefa-pracownika" className="btn--bare">
                    {c.loginLong}
                </a>
                <a href="/rejestracja" className="btn btn--white">
                    {c.createAccount}
                </a>
            </div> : ''}
            {type !== 4 ? <div className="mobileMenu__bottom__bottom flex">
                <div className="mobileMenu__bottom__bottom__links flex flex--start">
                    <a href="/regulamin">
                        {c.termsOfServiceHeader}
                    </a>
                    <a href="/polityka-prywatnosci">
                        {c.privacyPolicyHeader}
                    </a>
                </div>

                <LanguageSwitcher />
            </div> : ''}
        </div>
    </div>
};

export default MobileMenu;
