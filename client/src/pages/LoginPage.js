import React, {useEffect, useState} from 'react';
import backgroundImg from '../static/img/logowanie.png'
import loginIcon from '../static/img/login-icon.svg'
import logo from '../static/img/logo-niebieskie.png'
import backArrowGrey from '../static/img/back-arrow-grey.svg'
import LanguageSwitcher from "../components/LanguageSwitcher";
import {loginUser} from "../helpers/user";
import {loginAgency} from "../helpers/agency";
import Cookies from 'universal-cookie';

const LoginPage = ({type}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
    }, [email, password]);

    const login = () => {
        if(email && password) {
            if(type === 0) {
                loginUser(email, password)
                    .then((res) => {
                        if(res?.status === 201) {
                            const jwt = res?.data?.access_token;
                            if(jwt) {
                                const cookies = new Cookies();
                                cookies.set('access_token', jwt, { path: '/' });
                                cookies.set('email_jooob', email.toString().split('@')[0], { path: '/' });
                                cookies.set('email_jooob_domain', email.toString().split('@')[1], { path: '/' });
                                window.location = '/konto-pracownika';
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
            else {
                loginAgency(email, password);
            }
        }
    }

    return <div className="container container--login flex">
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
            <main className="login__left__content">
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
                        onClick={() => { login(); }}>
                    Zaloguj się
                    <img className="img" src={loginIcon} alt="logowanie" />
                </button>
                <div className="login__bottom flex">
                    <a href="/rejestracja">
                        Nie masz konta? Zarejestruj się
                    </a>
                    <a href="/przypomnienie-hasla">
                        Zapomniałem hasła
                    </a>
                </div>
            </main>
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
            <img className="img" src={backgroundImg} alt="logowanie" />
        </div>
    </div>
};

export default LoginPage;
