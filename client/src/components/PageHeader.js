import React, {useContext} from 'react';
import MobileHeader from "./MobileHeader";
import logo from '../static/img/logo-czarne.png'
import LanguageSwitcher from "./LanguageSwitcher";
import userIcon from "../static/img/user-in-circle.svg";
import {LanguageContext} from "../App";

const PageHeader = () => {
    const { c } = useContext(LanguageContext);

    return <header className="loggedUserHeader">
        <MobileHeader loggedUser={false} />

        <div className="loggedUserHeader__desktop flex">
            <div className="loggedUserHeader__desktop--guest flex">
                <a href="/" className="logo">
                    <img className="img" src={logo} alt="portal-pracy" />
                </a>

                <div className="home__header__menu flex d-700">
                    <a className="home__header__menu__item" href="/">
                        {c.homepage}
                    </a>
                    <a className="home__header__menu__item"
                       href="#funkcje">
                        {c.appFunctions}
                    </a>
                    <a className="home__header__menu__item" href="#partnerzy">
                        {c.partners}
                    </a>
                    <a className="home__header__menu__item" href="/kontakt">
                        {c.contact}
                    </a>
                </div>
                <a className="btn btn--quickLogin center" href="/strefa-pracownika">
                    <img className="img" src={userIcon} alt="logowanie" />
                    {c.quickLogin}
                </a>
                <div className="d-700">
                    <LanguageSwitcher homepage={true} />
                </div>
            </div>
        </div>
    </header>
};

export default PageHeader;
