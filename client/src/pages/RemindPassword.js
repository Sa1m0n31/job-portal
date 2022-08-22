import React, {useEffect, useRef, useState} from 'react';
import MobileHeader from "../components/MobileHeader";
import logo from "../static/img/logo-czarne.png";
import backArrowGrey from "../static/img/back-arrow-grey.svg";
import loginIcon from "../static/img/login-icon.svg";
import LanguageSwitcher from "../components/LanguageSwitcher";
import backgroundImg from "../static/img/logowanie.png";
import {isEmail} from "../helpers/others";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import checkIcon from "../static/img/green-check.svg";
import {remindUserPassword} from "../helpers/user";
import {remindAgencyPassword} from "../helpers/agency";
import {formErrors} from "../static/content";
import Loader from "../components/Loader";
import LoggedUserFooter from "../components/LoggedUserFooter";

const RemindPassword = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(0);
    const [dropdownRoleVisible, setDropdownRoleVisible] = useState(false)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const formRef = useRef(null);
    const successRef = useRef(null);

    useEffect(() => {
        if(success) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            formRef.current.style.opacity = '0';
            setTimeout(() => {
                formRef.current.style.height = '0';
                formRef.current.style.padding = '0';
                formRef.current.style.margin = '0';
                formRef.current.style.visibility = 'hidden';
            }, 300);

            successRef.current.style.display = 'flex';
            successRef.current.style.visibility = 'visible';
            successRef.current.style.height = 'auto';
            successRef.current.style.padding = '60px 0 40px';
            setTimeout(() => {
                successRef.current.style.opacity = '1';
            }, 300);
        }
    }, [success]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(isEmail(email)) {
            setLoading(true);
            const func = role === 0 ? remindUserPassword : remindAgencyPassword;
            func(email)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                    if(err.code === "ERR_BAD_REQUEST") {
                        setError('Konto o podanym adresie e-mail nie istnieje');
                    }
                    else {
                        setError(formErrors[1]);
                    }
                })
        }
        else {
            setError('Wpisz poprawny adres e-mail');
        }
    }

    return <div className="container container--login container--passwordRemind flex" onClick={() => { setDropdownRoleVisible(false); }}>
        <MobileHeader back="/" />

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

            <div className="application__success" ref={successRef}>
                <img className="img" src={checkIcon} alt="dodano" />
                <h3 className="application__header">
                    Udało się! Na Twój adres e-mail wysłaliśmy link do odzyskiwania hasła.
                </h3>
                <div className="buttons center">
                    <a href="/" className="btn">
                        Strona główna
                    </a>
                </div>
            </div>

            <form className="login__left__content" ref={formRef}>
                <h1 className="login__header">
                    Odzyskaj swoje hasło
                </h1>
                <label className="label">
                    Adres e-mail
                    <input className="input"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }} />
                </label>
                <label className="label rel">
                    Typ konta
                    <button className="register__accountType flex" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDropdownRoleVisible(!dropdownRoleVisible); }}>
                        {role === 0 ? 'pracownik (kandydat)' : 'pracodawca'}
                        <img className="img" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {dropdownRoleVisible ? <button className="register__accountType register__accountType--dropdown flex"
                                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRole(role === 0 ? 1 : 0); setDropdownRoleVisible(false); }}
                    >
                        {role === 1 ? 'pracownik (kandydat)' : 'pracodawca'}
                    </button> : ''}
                </label>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--login center"
                                    onClick={(e) => { handleSubmit(e); }}>
                    Odsykaj hasło
                </button> : <div className="loading">
                    <Loader />
                </div>}
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
            <img className="img" src={backgroundImg} alt="logowanie" />
        </div>

        <LoggedUserFooter />
    </div>;
};

export default RemindPassword;
