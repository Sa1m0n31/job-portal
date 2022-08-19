import React, {useEffect, useState} from 'react';
import backgroundImg from '../static/img/background.png'
import logo from '../static/img/logo-biale.png'
import userIcon from '../static/img/user-in-circle.svg'
import playIcon from '../static/img/play.svg'
import smallArrowIcon from '../static/img/small-arrow.svg'
import smallWhiteArrowIcon from '../static/img/small-white-arrow.svg'
import LanguageSwitcher from "../components/LanguageSwitcher";
import {authUser, getUserData} from "../helpers/user";
import {authAgency, getAgencyData} from "../helpers/agency";
import Cookies from "universal-cookie";
import Loader from "../components/Loader";
import GoogleTranslate from "../components/GoogleTranslate";
import AdsSection from "../components/AdsSection";
import HomeBenefits from "../components/HomeBenefits";
import Partners from "../components/Partners";
import Tools from "../components/Tools";
import Footer from "../components/Footer";

const Homepage = () => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        authUser()
            .then((res) => {
                if(res?.status === 201) {
                    getUserData()
                        .then((res) => {
                            if(res?.status === 200) {
                                window.location = '/oferty-pracy';
                            }
                            else {
                                setRender(true);
                            }
                        })
                        .catch(() => {
                            setRender(true);
                        });
                }
                else {
                    setRender(true);
                }
            })
            .catch(() => {
                authAgency()
                    .then((res) => {
                        if(res?.status === 201) {
                            getAgencyData()
                                .then((res) => {
                                    if(res?.status === 200) {
                                        window.location = '/konto-agencji';
                                    }
                                    else {
                                        setRender(true);
                                    }
                                })
                                .catch(() => {
                                    setRender(true);
                                });
                        }
                        else {
                            setRender(true);
                        }
                    })
                    .catch(() => {
                        setRender(true);
                    })
            })
    }, []);

    return render ? <div className="container container--home">

        <img className="homeImg" src={backgroundImg} alt="portal-z-ofertami-pracy" />
        <header className="home__header flex w-1400">
            <a href="." className="home__header__logo">
                <img className="img" src={logo} alt="portal-pracy-logo" />
            </a>
            <div className="home__header__menu flex">
                <a className="home__header__menu__item" href="/">
                    Strona główna
                </a>
                <a className="home__header__menu__item" href="#funkcje">
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


        <AdsSection />
        <HomeBenefits />
        <Partners />
        <Tools />
        <Footer />

    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default Homepage;
