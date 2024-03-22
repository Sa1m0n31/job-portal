import React, {useContext, useEffect, useRef, useState} from 'react';
import MobileHeader from "./MobileHeader";
import logo from '../static/img/logo-czarne.png'
import messageIcon from '../static/img/message-blue.svg'
import bellIcon from '../static/img/bell-ring.svg'
import arrowDown from '../static/img/arrow-down.svg'
import settings from "../static/settings";
import {getUserData, getUserNotifications, logout, readNotification} from "../helpers/user";
import logoutIcon from '../static/img/logout.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'
import {getAgencyMessages, getUserMessages} from "../helpers/messages";
import {getAgencyData, getAgencyNotifications} from "../helpers/agency";
import messagesIcon from '../static/img/messages-arrow.svg'
import {LanguageContext} from "../App";
import {UserAccountContext} from "./UserWrapper";
import userIcon from "../static/img/user-in-circle.svg";
import LanguageSwitcher from "./LanguageSwitcher";

const NotLoggedUserHeader = () => {
    const { c } = useContext(LanguageContext);

    const [newMessages, setNewMessages] = useState(0);
    const [newNotifications, setNewNotifications] = useState(false);

    return <header className="loggedUserHeader">
        <MobileHeader loggedUser={false}
                      loggedAgency={false}
                      newMessages={newMessages}
                      newNotifications={newNotifications} />

        <div className="loggedUserHeader__desktop flex">
            <a href="/" className="logo">
                <img className="img" src={logo} alt="portal-pracy" />
            </a>

            <div className="loggedUserHeader__menu flex">
                <a className="home__header__menu__item" href="/">
                    {c.homepage}
                </a>
                <a className="home__header__menu__item"
                   href="/#funkcje">
                    {c.appFunctions}
                </a>
                <a className="home__header__menu__item" href="/#partnerzy">
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
    </header>
};

export default NotLoggedUserHeader;
