import React, {useContext, useEffect, useState} from 'react';
import backgroundImg from '../static/img/logowanie.png'
import backgroundImgAgency from '../static/img/login-agencja.png'
import loginIcon from '../static/img/login-icon.svg'
import logo from '../static/img/logo-czarne.png'
import backArrowGrey from '../static/img/back-arrow-grey.svg'
import LanguageSwitcher from "../components/LanguageSwitcher";
import {authUser, getUserData, loginUser} from "../helpers/user";
import {authAgency, getAgencyData, loginAgency} from "../helpers/agency";
import Cookies from 'universal-cookie';
import Loader from "../components/Loader";
import MobileHeader from "../components/MobileHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import {LanguageContext} from "../App";

const LoginPage = ({type}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [render, setRender] = useState(false);

    const { c } = useContext(LanguageContext);

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

    useEffect(() => {
        setError('');
    }, [email, password]);

    const login = (e) => {
        e.preventDefault();
        if(email && password) {
            setLoading(true);
            const func = type === 0 ? loginUser : loginAgency;
            const secondFunc = type === 0 ? loginAgency : loginUser;
            const mailContent = JSON.stringify([
                c.mail5, c.mail6, c.mail7
            ]);

            func(email, password, mailContent)
                .then((res) => {
                    setLoading(false);
                    if(res?.status === 201) {
                        const jwt = res?.data?.access_token;
                        if(jwt) {
                            const cookies = new Cookies();
                            cookies.set('access_token', jwt, { path: '/' });
                            cookies.set('email_jooob', email.toString().split('@')[0], { path: '/' });
                            cookies.set('email_jooob_domain', email.toString().split('@')[1], { path: '/' });
                            cookies.set('jooob_account_type', type === 0 ? 'user': 'agency');
                            window.location = type === 0 ? '/konto-pracownika' : '/konto-agencji';
                        }
                        else {
                            setError(JSON.parse(c.formErrors)[1]);
                        }
                    }
                    else {
                        setError(c.loginError1);
                    }
                })
                .catch((err) => {
                    secondFunc(email, password, mailContent)
                        .then((res) => {
                            setLoading(false);
                            if(res?.status === 201) {
                                const jwt = res?.data?.access_token;
                                if(jwt) {
                                    const cookies = new Cookies();
                                    cookies.set('access_token', jwt, { path: '/' });
                                    cookies.set('email_jooob', email.toString().split('@')[0], { path: '/' });
                                    cookies.set('email_jooob_domain', email.toString().split('@')[1], { path: '/' });
                                    cookies.set('jooob_account_type', type === 1 ? 'user': 'agency');
                                    window.location = type === 1 ? '/konto-pracownika' : '/konto-agencji';
                                }
                                else {
                                    setError(JSON.parse(c.formErrors)[1]);
                                }
                            }
                            else {
                                setError(c.loginError1);
                            }
                        })
                        .catch(() => {
                            setLoading(false);
                            if(err?.response?.status === 403) {
                                setError(c.loginError2);
                            }
                            else if(err?.response?.status === 423) {
                                setError(c.blockedAccount);
                            }
                            else {
                                setError(c.loginError1);
                            }
                        });
                });
        }
    }

    return render ? <div className="container container--login flex">
        <MobileHeader back="/" />

        <div className="login__left">
            <header className="login__left__header flex">
                <a href="." className="login__left__header__logo">
                    <img className="img" src={logo} alt="portal-pracy" />
                </a>
                <a href="/" className="login__left__header__backBtn">
                    <img className="img" src={backArrowGrey} alt="powrót" />
                    {c.homepageComeback}
                </a>
            </header>
            <form className="login__left__content page--50">
                <h1 className="login__header">
                    {c.loginHeader}
                </h1>
                <label className="label">
                    {c.email}
                    <input className="input"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }} />
                </label>
                <label className="label">
                    {c.password}
                    <input className="input"
                           type="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }} />
                </label>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--login center"
                                    onClick={(e) => { login(e); }}>
                    {c.login}
                    <img className="img" src={loginIcon} alt="logowanie" />
                </button> : <div className="center">
                    <Loader />
                </div>}
                <div className="login__bottom flex">
                    <a href={type === 0 ? "/rejestracja" : "/rejestracja?typ=pracodawca"}>
                        <span className="d-desktop">{c.notHaveAccount}</span> {c.register}
                    </a>
                    <a href="/przypomnienie-hasla">
                        {c.forgotPassword}
                    </a>
                </div>
            </form>
            <aside className="login__left__bottom flex">
                <div className="login__left__bottom__links flex">
                    <a href="/polityka-prywatnosci">
                        {c.privacyPolicyHeader}
                    </a>
                    <a href="/regulamin">
                        {c.termsOfServiceHeader}
                    </a>
                </div>

                <LanguageSwitcher horizontal={true} />
            </aside>
        </div>
        <div className="login__right">
            <img className="img" src={type === 0 ? backgroundImg : backgroundImgAgency} alt="logowanie" />
        </div>

        <LoggedUserFooter />
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default LoginPage;
