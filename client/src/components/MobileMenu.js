import React, {useContext, useEffect, useState} from 'react';
import closeIcon from '../static/img/left-blue-arrow.svg'
import {adminMenu, adminMenuLabels, agencyMenu, homeMenu, userMenu} from "../static/content";
import LanguageSwitcher from "./LanguageSwitcher";
import {LanguageContext} from "../App";
import {logoutAdmin} from "../helpers/admin";
import {logout} from "../helpers/user";
import logoutIcon from '../static/img/logout.svg'
import {isHomepage} from "../helpers/others";
import {UserAccountContext} from "./UserWrapper";

const MobileMenu = ({closeMenu, type, setLanguagePopupVisible}) => {
    const [menuLabels, setMenuLabels] = useState([]);
    const [menu, setMenu] = useState([]);

    const { c } = useContext(LanguageContext);
    const { realAccount } = useContext(UserAccountContext);

    useEffect(() => {
        if(type && c.userMenuLabels) {
            switch(type) {
                case 2:
                    setMenu(realAccount ? userMenu : userMenu.slice(0, -1));
                    setMenuLabels(realAccount ? JSON.parse(c.userMenuLabels) : JSON.parse(c.userMenuLabels).slice(0, -1));
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
    }, [type, c]);

    const hideMenu = (i) => {
        if(type === 1 && i !== 3 && i !== 0 && isHomepage()) {
            closeMenu();
        }
    }

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
                          onClick={() => { hideMenu(index); }}
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
            </div> : <button onClick={() => { type === 4 ? logoutAdmin() : logout(); }}
                             className="btn btn--white btn--logout center">
                <img className="img" src={logoutIcon} alt="logout" />
                {c.logout}
            </button>}

            {type !== 4 ? <div className="mobileMenu__bottom__bottom flex">
                <div className="mobileMenu__bottom__bottom__links flex flex--start">
                    <a href="/regulamin">
                        {c.termsOfServiceHeader}
                    </a>
                    <a href="/polityka-prywatnosci">
                        {c.privacyPolicyHeader}
                    </a>
                </div>

                <LanguageSwitcher setLanguagePopupVisible={setLanguagePopupVisible}
                                  mobile={true} />
            </div> : ''}
        </div>
    </div>
};

export default MobileMenu;
