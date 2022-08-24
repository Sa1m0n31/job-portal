import React, {useContext, useEffect, useState} from 'react';
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
import MobileHeader from "../components/MobileHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import {LanguageContext} from "../App";

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

    const { c } = useContext(LanguageContext);

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
            setError(c.registerError1);
            return false;
        }
        if(!isPasswordStrong(password)) {
            setError(c.passwordError3);
            return false;
        }
        if(password !== repeatPassword) {
            setError(c.passwordError2);
            return false;
        }
        if(!checkbox) {
            setError(c.registerError2);
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
                        setError(JSON.parse(c.formErrors)[1]);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    if(err?.response?.status === 400) {
                        setError(c.emailAlreadyExists);
                    }
                    else {
                        setError(JSON.parse(c.formErrors)[1]);
                    }
                });
        }
    }

    return <div className="container container--register center" onClick={() => { setDropdownRoleVisible(false); }}>
        <img className="registerImg" src={background} alt="rejestracja" />

        <MobileHeader back="/" />

        {registered ? <AfterRegister type={role} /> : (loading ? <Loader /> : <main className="register">
            <img className="register__logo" src={logo} alt="portal-pracy" />
            <h1 className="register__header">
                {c.quickRegister}
            </h1>
            <h2 className="register__subheader">
                {c.quickRegisterDescription}
            </h2>

            <label className="label">
                {c.email}
                <input className="input"
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }} />
            </label>
            <label className="label">
                {c.accountType}
                <button className="register__accountType flex" onClick={(e) => { e.stopPropagation(); dropdownRole(); }}>
                    {role === 0 ? c.accountTypeUser : c.accountTypeAgency}
                    <img className="img" src={dropdownArrow} alt="rozwiń" />
                </button>
                {dropdownRoleVisible ? <button className="register__accountType register__accountType--dropdown flex"
                                               onClick={(e) => { e.stopPropagation(); setRole(role === 0 ? 1 : 0); }}
                >
                    {role === 1 ? c.accountTypeUser : c.accountTypeAgency}
                </button> : ''}
            </label>
            <label className="label">
                {c.password}
                <input className="input"
                       type={!passwordVisible ? "password" : "text"}
                       value={password}
                       onChange={(e) => { setPassword(e.target.value); }} />
            </label>
            <label className="label">
                {c.repeatPassword}
                <input className="input"
                       type={!repeatPasswordVisible ? "password" : "text"}
                       value={repeatPassword}
                       onChange={(e) => { setRepeatPassword(e.target.value); }} />
            </label>
            <label className="label label--flex label--checkbox">
                <button className={checkbox ? "checkbox checkbox--selected center" : "checkbox center"} onClick={() => { setCheckbox(!checkbox); }}>
                    <span></span>
                </button>
                <span>
                    {c.accept} <a href="/regulamin">{c.termsOfServiceHeader}</a> {c.and} <a href="/polityka prywatności">{c.privacyPolicyHeader2}</a>.
                </span>
            </label>

            {error ? <span className="info info--error">
                {error}
            </span> : ''}

            <button className="btn btn--login" onClick={() => { register(); }}>
                {c.createAccount}
                <img className="img" src={arrowWhite} alt="przejdź-dalej" />
            </button>
            <a className="register__link" href={role === 0 ? "/strefa-pracownika" : "/strefa-pracodawcy"}>
                {c.haveAccountQuestion}
            </a>
            <LoginAndRegisterAside />
        </main>)}

        <LoggedUserFooter />
    </div>
};

export default Register;
