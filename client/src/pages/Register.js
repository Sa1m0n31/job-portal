import React, {useEffect, useState} from 'react';
import background from '../static/img/register-background.png'
import logo from '../static/img/logo-czarne.png'
import arrowWhite from '../static/img/small-white-arrow.svg'
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import AfterRegister from "../components/AfterRegister";
import LoginAndRegisterAside from "../components/LoginAndRegisterAside";
import {isEmail, isPasswordStrong} from "../helpers/others";
import {registerUser} from "../helpers/user";
import {registerAgency} from "../helpers/agency";
import Loader from "../components/Loader";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(0);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
    const [dropdownRoleVisible, setDropdownRoleVisible] = useState(false);
    const [checkbox, setCheckbox] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState('');

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

    useEffect(() => {
        setError('');
    }, [email, password, repeatPassword, checkbox]);

    const dropdownRole = () => {
        setDropdownRoleVisible(!dropdownRoleVisible);
    }

    const validateData = () => {
        if(!isEmail(email)) {
            setError('Wpisz poprawny adres e-mail');
            return false;
        }
        if(!isPasswordStrong(password)) {
            setError('Hasło powinno mieć co najmniej 8 znaków');
            return false;
        }
        if(password !== repeatPassword) {
            setError('Podane hasła nie są identyczne');
            return false;
        }
        if(!checkbox) {
            setError('Akceptuj regulamin i politykę prywatności');
            return false;
        }

        return true;
    }

    const register = () => {
        if(validateData()) {
            setLoading(true);
            const registerFunc = role === 0 ? registerUser : registerAgency;

            registerFunc(email, password)
                .then((res) => {
                    setLoading(false);
                    if(res?.status === 201) {
                        setError('');
                        setRegistered(true);
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    if(err?.response?.status === 400) {
                        setError('Użytkownik o podanym adresie e-mail już istnieje');
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                });
        }
    }

    return <div className="container container--register center" onClick={() => { setDropdownRoleVisible(false); }}>
        <img className="registerImg" src={background} alt="rejestracja" />
        {registered ? <AfterRegister type={role} /> : (loading ? <Loader /> : <main className="register">
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

            {error ? <span className="info info--error">
                {error}
            </span> : ''}

            <button className="btn btn--login" onClick={() => { register(); }}>
                Załóż konto
                <img className="img" src={arrowWhite} alt="przejdź-dalej" />
            </button>
            <a className="register__link" href={role === 0 ? "/strefa-pracownika" : "/strefa-pracodawcy"}>
                Masz już konto? Zaloguj się
            </a>
            <LoginAndRegisterAside />
        </main>)}
    </div>
};

export default Register;
