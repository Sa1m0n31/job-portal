import React, {useEffect, useState} from 'react';
import background from '../static/img/register-background.png'
import logo from '../static/img/logo-niebieskie.png'
import arrowWhite from '../static/img/small-white-arrow.svg'
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import AfterRegister from "../components/AfterRegister";
import LoginAndRegisterAside from "../components/LoginAndRegisterAside";

const Register = () => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(0);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
    const [dropdownRoleVisible, setDropdownRoleVisible] = useState(false);
    const [checkbox, setCheckbox] = useState(false);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('typ');

        if(type === 'pracodawca') {
            setRole(1);
        }
    }, []);

    useEffect(() => {
        setDropdownRoleVisible(false);
    }, [role]);

    const dropdownRole = () => {
        setDropdownRoleVisible(!dropdownRoleVisible);
    }

    const register = () => {

    }

    return <div className="container container--register center" onClick={() => { setDropdownRoleVisible(false); }}>
        <img className="registerImg" src={background} alt="rejestracja" />
        {registered ? <AfterRegister type={role} /> : <main className="register">
            <img className="register__logo" src={logo} alt="portal-pracy" />
            <h1 className="register__header">
                Szybka rejestracja
            </h1>
            <h2 className="register__subheader">
                Załóż bezpłatnie konto, a następnie uzupełnij profil, aby w pełni korzystać z funkcji portalu.
            </h2>

            <label className="label">
                Adres e-mail
                <input className="input"
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }} />
            </label>
            <label className="label">
                Typ konta
                <button className="register__accountType flex" onClick={(e) => { e.stopPropagation(); dropdownRole(); }}>
                    {role === 0 ? 'pracownik (kandydat)' : 'pracodawca'}
                    <img className="img" src={dropdownArrow} alt="rozwiń" />
                </button>
                {dropdownRoleVisible ? <button className="register__accountType register__accountType--dropdown flex"
                                               onClick={(e) => { e.stopPropagation(); setRole(role === 0 ? 1 : 0); }}
                >
                    {role === 1 ? 'pracownik (kandydat)' : 'pracodawca'}
                </button> : ''}
            </label>
            <label className="label">
                Hasło
                <input className="input"
                       type={!passwordVisible ? "password" : "text"}
                       value={password}
                       onChange={(e) => { setPassword(e.target.value); }} />
            </label>
            <label className="label">
                Powtórz hasło
                <input className="input"
                       type={!repeatPasswordVisible ? "password" : "text"}
                       value={repeatPassword}
                       onChange={(e) => { setRepeatPassword(e.target.value); }} />
            </label>
            <label className="label label--flex label--checkbox">
                <button className={checkbox ? "checkbox checkbox--selected center" : "checkbox center"} onClick={() => { setCheckbox(!checkbox); }}>
                    <span></span>
                </button>
                Akceptuję <a href="/regulamin">Regulamin</a> i postanowienia <a href="/polityka prywatności">Polityki prywatności</a>.
            </label>
            <button className="btn btn--login">
                Załóż konto
                <img className="img" src={arrowWhite} alt="przejdź-dalej" />
            </button>
            <a className="register__link" href="/strefa-pracownika">
                Masz już konto? Zaloguj się
            </a>
            <LoginAndRegisterAside />
        </main>}
    </div>
};

export default Register;
