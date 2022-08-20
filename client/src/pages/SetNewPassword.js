import React, {useEffect, useRef, useState} from 'react';
import MobileHeader from "../components/MobileHeader";
import logo from "../static/img/logo-czarne.png";
import backArrowGrey from "../static/img/back-arrow-grey.svg";
import LanguageSwitcher from "../components/LanguageSwitcher";
import backgroundImg from "../static/img/logowanie.png";
import checkIcon from "../static/img/green-check.svg";
import {changeUserPassword} from "../helpers/user";
import {changeAgencyPassword, verifyPasswordToken} from "../helpers/agency";
import {formErrors} from "../static/content";
import Loader from "../components/Loader";

const SetNewPassword = () => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [render, setRender] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(null);

    const formRef = useRef(null);
    const successRef = useRef(null);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search)?.get('token');
        if(token) {
            verifyPasswordToken(token)
                .then((res) => {
                    if(res?.data?.length) {
                        const d = res?.data[0];
                        if(d.user) {
                            setEmail(d.user);
                            setRole(0);
                            setRender(true);
                        }
                        else if(d.agency) {
                            setEmail(d.agency);
                            setRole(1);
                            setRender(true);
                        }
                        else {
                            // window.location = '/';
                        }
                    }
                    else {
                        // window.location = '/';
                    }
                })
                .catch(() => {
                    // window.location = '/';
                });
        }
        else {
            // window.location = '/';
        }
    }, []);

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

        if(password === repeatPassword) {
            if(1) {
                let func = role === 0 ? changeUserPassword : changeAgencyPassword;

                func(null, password, email)
                    .then((res) => {
                        if(res?.status === 201) {
                            setSuccess(true);
                        }
                        else {
                            setError(formErrors[1]);
                        }
                    })
                    .catch(() => {
                        setError(formErrors[1]);
                    });
            }
            else {
                setError('Slabe hasło');
            }
        }
        else {
            setError('Podane hasła nie są identyczne');
        }
    }

    return <div className="container container--login container--passwordRemind flex">
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
                    Udało się! Twoje hasło zostało zmienione!
                </h3>
                <div className="buttons center">
                    <a href="/" className="btn">
                        Zaloguj się
                    </a>
                </div>
            </div>

            <form className="login__left__content" ref={formRef}>
                <h1 className="login__header">
                    Ustaw swoje hasło
                </h1>
                <label className="label">
                    Nowe hasło
                    <input className="input"
                           type="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }} />
                </label>
                <label className="label">
                    Powtórz hasło
                    <input className="input"
                           type="password"
                           value={repeatPassword}
                           onChange={(e) => { setRepeatPassword(e.target.value); }} />
                </label>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--login center"
                                    onClick={(e) => { handleSubmit(e); }}>
                    Ustaw nowe hasło
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
    </div>;
};

export default SetNewPassword;
