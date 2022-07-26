import React, {useState} from 'react';
import backgroundImg from '../static/img/logowanie.png'
import loginIcon from '../static/img/login-icon.svg'
import logo from '../static/img/logo-niebieskie.png'
import backArrowGrey from '../static/img/back-arrow-grey.svg'
import LanguageSwitcher from "../components/LanguageSwitcher";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                <button className="btn btn--login center">
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
