import React from 'react';
import logo from "../static/img/logo-niebieskie.png";
import loginIcon from "../static/img/login-icon.svg";
import LoginAndRegisterAside from "./LoginAndRegisterAside";

const AfterRegister = ({type}) => {
    return <div className="register register--after">
        <img className="register__logo" src={logo} alt="portal-pracy" />
        <h1 className="register__header">
            Potwierdź swoje konto.
        </h1>
        <h2 className="register__subheader">
            Na podany przez Ciebie adres e-mail wysłaliśmy <span className="bold">link aktywacyjny</span>. Po kliknięciu w link Twoje konto zostanie automatycznie aktywowane.
        </h2>
        <h3 className="register__subheader">
            Po aktywowaniu konta zostaniesz automatycznie przekierowany do <span className="bold">kolejnego etapu rejestracji - uzupełniania swojego profilu (CV)</span>.
        </h3>
        <a className="btn btn--login center" href={type === 0 ? "/strefa-pracownika" : "/strefa-pracodawcy"}>
            Zaloguj się
            <img className="img" src={loginIcon} alt="logowanie" />
        </a>
        <a className="btn btn--neutral center" href="/">
            Strona główna
        </a>
        <LoginAndRegisterAside />
    </div>
};

export default AfterRegister;
