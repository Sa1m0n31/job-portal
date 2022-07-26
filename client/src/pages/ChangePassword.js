import React, {useContext, useEffect, useRef, useState} from 'react';
import {authUser, changeUserPassword, getUserData} from "../helpers/user";
import LoggedUserHeader from "../components/LoggedUserHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import {authAgency, changeAgencyPassword, getAgencyData} from "../helpers/agency";
import checkIcon from "../static/img/green-check.svg";
import Loader from "../components/Loader";
import {getLoggedUserEmail, isPasswordStrength} from "../helpers/others";
import {LanguageContext} from "../App";

const ChangePassword = () => {
    const [data, setData] = useState(null);
    const [agency, setAgency] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { c } = useContext(LanguageContext);

    const formRef = useRef(null);
    const successRef = useRef(null);

    useEffect(() => {
        authUser()
            .then((res) => {
                if(res?.status === 201) {
                    getUserData()
                        .then(async (res) => {
                            if(res?.status === 200) {
                                setAgency(false);
                                setData(JSON.parse(res?.data?.data));
                            }
                        });
                }
            })
            .catch(() => {
                authAgency()
                    .then((res) => {
                        if(res?.status === 201) {
                            getAgencyData()
                                .then(async (res) => {
                                    if(res?.status === 200) {
                                        setAgency(true);
                                        setData(JSON.parse(res?.data?.data));
                                    }
                                });
                        }
                    })
                    .catch(() => {
                        window.location = '/';
                    });
            });
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

        if(!oldPassword || !password || !repeatPassword) {
            setError(c.passwordError1);
            return 0;
        }
        if(password !== repeatPassword) {
            setError(c.passwordError2);
            return 0;
        }
        if(!isPasswordStrength(password)) {
            setError(c.passwordError3);
            return 0;
        }

        const func = agency ? changeAgencyPassword : changeUserPassword;
        func(oldPassword, password, getLoggedUserEmail())
            .then((res) => {
               setLoading(false);
               if(res?.status === 200) {
                   setSuccess(true);
               }
               else {
                   setError(JSON.parse(c.formErrors)[1]);
               }
            })
            .catch((err) => {
                setLoading(false);
                if(err.code === "ERR_BAD_REQUEST") {
                    setError(c.passwordError4);
                }
                else {
                    setError(JSON.parse(c.formErrors)[1]);
                }
            });
    }

    return <div className="container container--changePassword">
        {data ? <LoggedUserHeader data={data} agency={agency} /> : ''}

        <main className="page page--100">
            <h1 className="page__header">
                {c.passwordChange}
            </h1>

            <div className="application__success" ref={successRef}>
                <img className="img" src={checkIcon} alt="dodano" />
                <h3 className="application__header">
                    {c.passwordChangeSuccess}
                </h3>
                <div className="buttons center">
                    <a href="/" className="btn">
                        {c.homepage}
                    </a>
                </div>
            </div>

            <form className="login__left__content" ref={formRef}>
                <label className="label">
                    {c.oldPassword}
                    <input className="input"
                           type="password"
                           value={oldPassword}
                           onChange={(e) => { setOldPassword(e.target.value); }} />
                </label>
                <label className="label">
                    {c.newPassword}
                    <input className="input"
                           type="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }} />
                </label>
                <label className="label">
                    {c.repeatPassword}
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
                    {c.setNewPassword}
                </button> : <div className="loading">
                    <Loader />
                </div>}
            </form>
        </main>

        <LoggedUserFooter />
    </div>
};

export default ChangePassword;
