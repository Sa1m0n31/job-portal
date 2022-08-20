import React, {useEffect, useState} from 'react';
import MobileHeader from "./MobileHeader";
import logo from '../static/img/logo-czarne.png'
import LanguageSwitcher from "./LanguageSwitcher";
import userIcon from "../static/img/user-in-circle.svg";

const PageHeader = ({data, agency, messageUpdate}) => {
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [messagesDropdown, setMessagesDropdown] = useState(false);
    const [notificationsDropdown, setNotificationsDropdown] = useState(false);
    const [newMessages, setNewMessages] = useState(0);
    const [newNotifications, setNewNotifications] = useState(false);

    const isNew = (chat) => {
        let lastMessage;
        if(agency) {
            lastMessage = chat?.filter((item) => (!item.fromAgency));
        }
        else {
            lastMessage = chat?.filter((item) => (item.fromAgency));
        }

        if(lastMessage?.length) {
            return !lastMessage.slice(-1)[0]?.read;
        }
        else {
            return false;
        }
    }

    return <header className="loggedUserHeader">
        <MobileHeader loggedUser={false} />

        <div className="loggedUserHeader__desktop flex">
            <div className="loggedUserHeader__desktop--guest flex">
                <a href="/" className="logo">
                    <img className="img" src={logo} alt="portal-pracy" />
                </a>

                <div className="home__header__menu flex d-700">
                    <a className="home__header__menu__item" href="/">
                        Strona główna
                    </a>
                    <a className="home__header__menu__item"
                       href="#funkcje">
                        Funkcje portalu
                    </a>
                    <a className="home__header__menu__item" href="#partnerzy">
                        Partnerzy
                    </a>
                    <a className="home__header__menu__item" href="/kontakt">
                        Kontakt
                    </a>
                </div>
                <a className="btn btn--quickLogin center" href="/strefa-pracownika">
                    <img className="img" src={userIcon} alt="logowanie" />
                    Szybkie logowanie
                </a>
                <div className="d-700">
                    <LanguageSwitcher homepage={true} />
                </div>
            </div>
        </div>
    </header>
};

export default PageHeader;
