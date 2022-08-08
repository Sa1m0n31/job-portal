import React, {useEffect, useState} from 'react';
import MobileHeader from "./MobileHeader";
import logo from '../static/img/logo-niebieskie.png'
import messageIcon from '../static/img/message-blue.svg'
import bellIcon from '../static/img/bell-ring.svg'
import arrowDown from '../static/img/arrow-down.svg'
import settings from "../static/settings";
import {logout} from "../helpers/user";
import logoutIcon from '../static/img/logout.svg'

const LoggedUserHeader = ({data, agency}) => {
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userMenuVisible, setUserMenuVisible] = useState(false);

    return <header className="loggedUserHeader">
        <MobileHeader loggedUser={true} />

        <div className="loggedUserHeader__desktop flex">
            <a href="/" className="logo">
                <img className="img" src={logo} alt="portal-pracy" />
            </a>

            <div className="loggedUserHeader__menu flex">
                <a className="loggedUserHeader__menu__item loggedUserHeader__menu__item--blue"
                   href="/oferty-pracy">
                    Aktywne oferty pracy
                </a>
                <a className="loggedUserHeader__menu__item loggedUserHeader__menu__item--red"
                   href="/oferty-blyskawiczne">
                    Oferty błyskawiczne
                </a>
                {agency ? <a className="loggedUserHeader__menu__item"
                             href="/moje-oferty-pracy">
                    Moje oferty
                </a> : <a className="loggedUserHeader__menu__item"
                          href="/pracodawcy">
                    Pracodawcy
                </a>}
                <a className="loggedUserHeader__menu__item"
                   href="/kontakt">
                    Kontakt
                </a>
            </div>

            <div className="loggedUserHeader__notificationsContainer">
                <button className={!messages.length ? "loggedUserHeader__notificationBtn" : "loggedUserHeader__notificationBtn loggedUserHeader__notificationBtn--new"}>
                    <img className="img" src={messageIcon} alt="wiadomosci" />
                </button>
                <button className={!notifications.length ? "loggedUserHeader__notificationBtn" : "loggedUserHeader__notificationBtn loggedUserHeader__notificationBtn--new"}>
                    <img className="img" src={bellIcon} alt="wiadomosci" />
                </button>
            </div>

            <div className="rel">
                <button className="loggedUserHeader__userBtn flex" onClick={() => { setUserMenuVisible(!userMenuVisible); }}>
                    <figure>
                        <img className="img"
                             src={!agency ? `${settings.API_URL}/${data.profileImage}` : `${settings.API_URL}/${data.logo}`}
                             alt="zdjecie-profilowe" />
                    </figure>
                    <span className="loggedUserHeader__fullName">
                        {!agency ? (data.firstName ? `${data.firstName} ${data.lastName}` : 'Menu') : (data.name ? data.name : 'Menu')}
                    </span>
                    <img className="arrowImg" src={arrowDown} alt="rowiń" />
                </button>

                {userMenuVisible ? <div className="loggedUserHeader__userDropdownMenu">
                    {agency ? <>
                        <a href="/dodaj-oferte-pracy"
                           className="loggedUserHeader__userDropdownMenu__item">
                            Dodaj ofertę pracy
                        </a>
                        <a href="/dodaj-blyskawiczna-oferte-pracy"
                           className="loggedUserHeader__userDropdownMenu__item">
                            Dodaj błyskawiczną ofertę pracy
                        </a>
                    </> : ''}
                    <a href={agency ? "/edycja-danych-agencji" : "/edycja-danych"}
                       className="loggedUserHeader__userDropdownMenu__item">
                        Edytuj profil
                    </a>
                    <button onClick={() => { logout(); }}
                        className="loggedUserHeader__userDropdownMenu__item">
                        Wyloguj się
                        <img className="img" src={logoutIcon} alt="wyloguj-sie" />
                    </button>
                </div> : ''}
            </div>
        </div>
    </header>
};

export default LoggedUserHeader;
