import React, {useRef, useState} from 'react';
import logo from '../static/img/logo-czarne.png'
import arrow from '../static/img/left-blue-arrow.svg'
import userIcon from "../static/img/user-in-circle.svg";
import menuIcon from "../static/img/burger-menu.svg";
import messagesIcon from '../static/img/message-blue.svg'
import notificationsIcon from '../static/img/bell-ring.svg'
import MobileMenu from "./MobileMenu";
import LanguagePopup from "./LanguagePopup";

const MobileHeader = ({back, backFunction, loggedUser, loggedAgency,
                          newMessages, newNotifications, loggedAdmin}) => {
    const [languagePopupVisible, setLanguagePopupVisible] = useState(false);

    const mobileMenu = useRef(null);

    const handleBack = () => {
        if(backFunction) {
            backFunction();
        }
        else {
            window.location = back ? back : '/';
        }
    }

    const openMenu = () => {
        mobileMenu.current.style.left = '0';
    }

    const closeMenu = () => {
        mobileMenu.current.style.left = '100%';
    }

    return <div className="mobileHeader">
        <a href="." className="mobileHeader__logo">
            <img className="img" src={logo} alt="jooob.eu" />
        </a>

        <div className="mobileMenuWrapper" ref={mobileMenu}>
            <MobileMenu closeMenu={closeMenu}
                        languagePopupVisible={languagePopupVisible}
                        setLanguagePopupVisible={setLanguagePopupVisible}
                        type={!loggedUser && !loggedAgency && !loggedAdmin ? 1 : (loggedUser ? 2 : (!loggedAdmin ? 3 : 4))} />
        </div>

        {languagePopupVisible ? <LanguagePopup closeModal={() => { setLanguagePopupVisible(false); }} /> : ''}

        {back ? <button className="mobileHeader__backBtn"
                        onClick={() => { handleBack(); }}>
            <img className="img" src={arrow} alt="back" />
        </button> : <div className="mobileHeader__right">
            <div className="home__header__mobile flex">
                {!loggedUser && !loggedAgency && !loggedAdmin ? <a href="/strefa-pracownika" className="home__header__mobile__btn">
                    <img className="img" src={userIcon} alt="user" />
                </a> : (!loggedAdmin ? <>
                    <a href={loggedAgency ? '/wiadomosci' : '/moje-wiadomosci'}
                       className="home__header__mobile__btn home__header__mobile__btn--messages">
                        <img className="img" src={messagesIcon} alt="user" />
                        {newMessages ? <span className="loggedUserHeader__notificationBtn__number">
                            {newMessages}
                        </span> : ''}
                    </a>
                    <a href="/powiadomienia"
                       className={!newNotifications ? "home__header__mobile__btn" : "home__header__mobile__btn loggedUserHeader__notificationBtn--new"}>
                        <img className="img" src={notificationsIcon} alt="user" />
                        {newNotifications ? <span className="loggedUserHeader__notificationBtn__number">
                            {newNotifications}
                        </span> : ''}
                    </a>
                </> : '')}
                <button className="home__header__mobile__btn" onClick={() => { openMenu(); }}>
                    <img className="img" src={menuIcon} alt="menu" />
                </button>
            </div>
        </div>}
    </div>
};

export default MobileHeader;
