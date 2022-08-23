import React, {useContext} from 'react';
import logo from "../static/img/logo-niebieskie.png";
import loginIcon from "../static/img/login-icon.svg";
import LoginAndRegisterAside from "./LoginAndRegisterAside";
import {LanguageContext} from "../App";

const AfterRegister = ({type}) => {
    const { c } = useContext(LanguageContext);

    return <div className="register register--after">
        <img className="register__logo" src={logo} alt="portal-pracy" />
        <h1 className="register__header">
            {c.verifyAccount}
        </h1>
        <h2 className="register__subheader">
            {c.registerSubheader1} <span className="bold">{c.registerSubheader2}</span>. {c.registerSubheader3}
        </h2>
        <h3 className="register__subheader">
            {c.registerSubheader4} <span className="bold">{type === 0 ? c.registerSubheader5 : c.registerSubheader6}</span>.
        </h3>
        <a className="btn btn--login center" href={type === 0 ? "/strefa-pracownika" : "/strefa-pracodawcy"}>
            {c.login}
            <img className="img" src={loginIcon} alt="logowanie" />
        </a>
        <a className="btn btn--neutral center" href="/">
            {c.homepage}
        </a>
        <LoginAndRegisterAside />
    </div>
};

export default AfterRegister;
