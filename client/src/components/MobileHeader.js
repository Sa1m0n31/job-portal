import React, {useRef} from 'react';
import logo from '../static/img/logo-czarne.png'
import arrow from '../static/img/left-blue-arrow.svg'
import userIcon from "../static/img/user-in-circle.svg";
import menuIcon from "../static/img/burger-menu.svg";
import MobileMenu from "./MobileMenu";

const MobileHeader = ({back, loggedUser, loggedAgency}) => {
    const mobileMenu = useRef(null);

    const handleBack = () => {
        window.location = back ? back : '/';
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
                        type={!loggedUser && !loggedAgency ? 1 : (loggedUser ? 2 : 3)} />
        </div>

        {back ? <button className="mobileHeader__backBtn"
                        onClick={() => { handleBack(); }}>
            <img className="img" src={arrow} alt="powrot" />
        </button> : <div className="mobileHeader__right">
            <div className="home__header__mobile flex">
                <a href={!loggedUser && !loggedAgency ? "/strefa-pracownika" : (loggedUser ? "/konto-pracownika" : '/konto-agencji')} className="home__header__mobile__btn">
                    <img className="img" src={userIcon} alt="user" />
                </a>
                <button className="home__header__mobile__btn" onClick={() => { openMenu(); }}>
                    <img className="img" src={menuIcon} alt="menu" />
                </button>
            </div>
        </div>}
    </div>
};

export default MobileHeader;
