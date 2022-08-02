import React from 'react';
import backgroundImg from '../static/img/background.png'
import logo from '../static/img/logo-biale.png'
import userIcon from '../static/img/user-in-circle.svg'
import playIcon from '../static/img/play.svg'
import smallArrowIcon from '../static/img/small-arrow.svg'
import smallWhiteArrowIcon from '../static/img/small-white-arrow.svg'
import LanguageSwitcher from "../components/LanguageSwitcher";

const Homepage = () => {
    return <div className="container container--home">
        <img className="homeImg" src={backgroundImg} alt="portal-z-ofertami-pracy" />
        <header className="home__header flex w-1400">
            <a href="." className="home__header__logo">
                <img className="img" src={logo} alt="portal-pracy-logo" />
            </a>
            <div className="home__header__menu flex">
                <a className="home__header__menu__item" href="/">
                    Strona główna
                </a>
                <a className="home__header__menu__item" href="/">
                    Funkcje portalu
                </a>
                <a className="home__header__menu__item" href="/">
                    Partnerzy
                </a>
                <a className="home__header__menu__item" href="/">
                    Kontakt
                </a>
            </div>
            <a className="btn btn--quickLogin center" href="/strefa-pracownika">
                <img className="img" src={userIcon} alt="logowanie" />
                Szybkie logowanie
            </a>
            <LanguageSwitcher homepage={true} />
        </header>
        <h1 className="home__h1">
            Platforma łącząca pracownika z pracodawcą na równych zasadach
        </h1>
        <div className="home__content flex">
            <h2 className="home__h2">
                Zarejestruj się, aby mieć dostęp do <span className="bold">bezpośrednich ofert pracy i kandydatów</span> na lata:
            </h2>
            <div className="home__zone">
                <h3 className="home__zone__header">
                    Strefa
                    <span>
                        Pracownika
                    </span>
                </h3>
                <h4 className="home__zone__subheader">
                    kandydaci, fachowcy, specjaliści etc.
                </h4>
                <a className="home__zone__instruction flex" href="/jak-dziala-strefa-pracownika">
                    <img className="img" src={playIcon} alt="video-play" />
                    <span className="home__zone__instruction__text">
                        <span className="home__zone__instruction__text__dark">
                            Jak to działa?
                        </span>
                        <span className="home__zone__instruction__text__light">
                            Zobacz video z instrukcją
                            <img className="smallArrow" src={smallArrowIcon} alt="przejdz-dalej" />
                        </span>
                    </span>
                </a>
                <a className="btn btn--zone center" href="/strefa-pracownika">
                    Przejdź do strefy
                    <img className="img" src={smallWhiteArrowIcon} alt="przejdz-dalej" />
                </a>
            </div>

            <div className="home__zone">
                <h3 className="home__zone__header">
                    Strefa
                    <span>
                        Pracodawcy
                    </span>
                </h3>
                <h4 className="home__zone__subheader">
                    agencje, firmy rekrutujące
                </h4>
                <a className="home__zone__instruction flex" href="/jak-dziala-strefa-pracownika">
                    <img className="img" src={playIcon} alt="video-play" />
                    <span className="home__zone__instruction__text">
                        <span className="home__zone__instruction__text__dark">
                            Jak to działa?
                        </span>
                        <span className="home__zone__instruction__text__light">
                            Zobacz video z instrukcją
                            <img className="smallArrow" src={smallArrowIcon} alt="przejdz-dalej" />
                        </span>
                    </span>
                </a>
                <a className="btn btn--zone center" href="/strefa-pracodawcy">
                    Przejdź do strefy
                    <img className="img" src={smallWhiteArrowIcon} alt="przejdz-dalej" />
                </a>
            </div>
        </div>
    </div>
};

export default Homepage;
