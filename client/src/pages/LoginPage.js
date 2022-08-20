import React, {useEffect, useState} from 'react';
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

const LoginPage = ({type}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
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

    useEffect(() => {
        setError('');
    }, [email, password]);

    const login = (e) => {
        e.preventDefault();
        if(email && password) {
            const func = type === 0 ? loginUser : loginAgency;
            func(email, password)
                .then((res) => {
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
                            setError('Coś poszło nie tak... Prosimy spróbować później');
                        }
                    }
                    else {
                        setError('Niepoprawna nazwa użytkownika lub hasło');
                    }
                })
                .catch((err) => {
                    if(err?.response?.status === 403) {
                        setError('Aby się zalogować, musisz najpierw aktywować swoje konto');
                    }
                    else {
                        setError('Niepoprawna nazwa użytkownika lub hasło');
                    }
                });
        }
    }

    return render ? <div className="container container--login flex">
        <div className="login__left">
            <header className="login__left__header flex">
                <a href="." className="login__left__header__logo">
                    <img className="img" src={logo} alt="portal-pracy" />
                </a>
                <a href="/" className="login__left__header__backBtn">
                    <img className="img" src={backArrowGrey} alt="powrót" />
                    Powrót na stronę główną
                </a>
            </header>
            <form className="login__left__content">
                <h1 className="login__header">
                    Zaloguj się do swojego profilu
                </h1>
                <label className="label">
                    Adres e-mail
                    <input className="input"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }} />
                </label>
                <label className="label">
                    Hasło
                    <input className="input"
                           type="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }} />
                </label>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                <button className="btn btn--login center"
                        onClick={(e) => { login(e); }}>
                    Zaloguj się
                    <img className="img" src={loginIcon} alt="logowanie" />
                </button>
                <div className="login__bottom flex">
                    <a href={type === 0 ? "/rejestracja" : "/rejestracja?typ=pracodawca"}>
                        Nie masz konta? Zarejestruj się
                    </a>
                    <a href="/przypomnienie-hasla">
                        Zapomniałem hasła
                    </a>
                </div>
            </form>
            <aside className="login__left__bottom flex">
                <div className="login__left__bottom__links flex">
                    <a href="/polityka-prywatnosci">
                        Polityka prywatności
                    </a>
                    <a href="/polityka-prywatnosci">
                        Regulamin portalu
                    </a>
                </div>

                <LanguageSwitcher horizontal={true} />
            </aside>
        </div>
        <div className="login__right">
            <img className="img" src={type === 0 ? backgroundImg : backgroundImgAgency} alt="logowanie" />
        </div>
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default LoginPage;
