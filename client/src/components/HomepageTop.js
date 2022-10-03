import React, {useContext, useRef, useState} from 'react';
import backgroundImg from "../static/img/background.png";
import logo from "../static/img/logo-biale.png";
import userIcon from "../static/img/user-in-circle.svg";
import LanguageSwitcher from "./LanguageSwitcher";
import playIcon from "../static/img/play.svg";
import smallArrowIcon from "../static/img/small-arrow.svg";
import smallWhiteArrowIcon from "../static/img/small-white-arrow.svg";
import ModalVideo from 'react-modal-video'
import menuIcon from '../static/img/burger-menu.svg'
import MobileMenu from "./MobileMenu";
import {LanguageContext} from "../App";
import LanguagePopup from "./LanguagePopup";

const HomepageTop = () => {
    const [video1, setVideo1] = useState(false);
    const [video2, setVideo2] = useState(false);
    const [languagePopupVisible, setLanguagePopupVisible] = useState(false);

    const { c } = useContext(LanguageContext);

    const mobileMenu = useRef(null);

    const openMenu = () => {
        mobileMenu.current.style.left = '0';
    }

    const closeMenu = () => {
        mobileMenu.current.style.left = '100%';
    }

    return <>
        <ModalVideo channel='youtube'
                    autoplay={true}
                    isOpen={video1}
                    videoId="u31qwQUeGuM"
                    onClose={() => setVideo1(false)} />

        <ModalVideo channel='youtube'
                    autoplay={true}
                    isOpen={video2}
                    videoId="u31qwQUeGuM"
                    onClose={() => setVideo2(false)} />

        <div className="mobileMenuWrapper" ref={mobileMenu}>
            <MobileMenu closeMenu={closeMenu}
                        languagePopupVisible={languagePopupVisible}
                        setLanguagePopupVisible={setLanguagePopupVisible}
                        type={1} />
        </div>

        {languagePopupVisible ? <LanguagePopup closeModal={() => { setLanguagePopupVisible(false); }} /> : ''}

        <img className="homeImg" src={backgroundImg} alt="portal-z-ofertami-pracy" />
        <header className="home__header flex w-1400">
            <a href="." className="home__header__logo">
                <img className="img" src={logo} alt="portal-pracy-logo" />
            </a>

            {/* DESKTOP */}
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

            {/* MOBILE */}
            <div className="home__header__mobile flex">
                <a href="/strefa-pracownika" className="home__header__mobile__btn">
                    <img className="img" src={userIcon} alt="user" />
                </a>
                <button className="home__header__mobile__btn" onClick={() => { openMenu(); }}>
                    <img className="img" src={menuIcon} alt="menu" />
                </button>
                <LanguageSwitcher mobileHomepage={true} />
            </div>
        </header>
        <h1 className="home__h1">
            {c.homepageH1}
        </h1>
        <div className="home__content flex">
            <h2 className="home__h2">
                {c.homepageH21} <span className="bold">{c.homepageH22}</span> {c.homepageH23}:
            </h2>
            <div className="home__zone">
                <h3 dangerouslySetInnerHTML={{__html: c.userZoneHtml}} className="home__zone__header">

                </h3>
                <h4 className="home__zone__subheader">
                    {c.userZoneDescription}
                </h4>
                <button className="home__zone__instruction flex"
                        onClick={() => { setVideo1(true); }}>
                    <img className="img" src={playIcon} alt="video-play" />
                    <span className="home__zone__instruction__text">
                        <span className="home__zone__instruction__text__dark">
                            {c.howItWorks}
                        </span>
                        <span className="home__zone__instruction__text__light d-700">
                            {c.seeVideo}
                            <img className="smallArrow" src={smallArrowIcon} alt="przejdz-dalej" />
                        </span>
                    </span>
                </button>
                <a className="btn btn--zone center" href="/strefa-pracownika">
                    {c.goToZone}
                    <img className="img" src={smallWhiteArrowIcon} alt="przejdz-dalej" />
                </a>
            </div>

            <div className="home__zone">
                <h3 dangerouslySetInnerHTML={{__html: c.agencyZoneHtml}} className="home__zone__header">

                </h3>
                <h4 className="home__zone__subheader">
                    {c.agencyZoneDescription}
                </h4>
                <button className="home__zone__instruction flex"
                        onClick={() => { setVideo2(true); }}>
                    <img className="img" src={playIcon} alt="video-play" />
                    <span className="home__zone__instruction__text">
                        <span className="home__zone__instruction__text__dark">
                            {c.howItWorks}
                        </span>
                        <span className="home__zone__instruction__text__light d-700">
                            {c.seeVideo}
                            <img className="smallArrow" src={smallArrowIcon} alt="przejdz-dalej" />
                        </span>
                    </span>
                </button>
                <a className="btn btn--zone center" href="/strefa-pracodawcy">
                    {c.goToZone}
                    <img className="img" src={smallWhiteArrowIcon} alt="przejdz-dalej" />
                </a>
            </div>
        </div>
    </>
};

export default HomepageTop;
