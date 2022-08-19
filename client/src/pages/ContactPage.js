import React, {useEffect, useRef, useState} from 'react';
import {authUser, getUserData, sendContactForm} from "../helpers/user";
import {authAgency, getAgencyData} from "../helpers/agency";
import LoggedUserHeader from "../components/LoggedUserHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import Footer from "../components/Footer";
import {getLoggedUserEmail, isEmail} from "../helpers/others";
import arrow from "../static/img/small-white-arrow.svg";
import {formErrors} from "../static/content";
import checkIcon from '../static/img/green-check.svg'

const ContactPage = () => {
    const [data, setData] = useState(null);
    const [agency, setAgency] = useState(false);
    const [guest, setGuest] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState(0);
    const [success, setSuccess] = useState(false);

    const successRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        authUser()
            .then((res) => {
                if(res?.status === 201) {
                    setGuest(false);
                    getUserData()
                        .then((res) => {
                            if(res?.status === 200) {
                                setData(JSON.parse(res?.data?.data));
                            }
                        });
                }
            })
            .catch(() => {
                authAgency()
                    .then((res) => {
                        if(res?.status === 201) {
                            setGuest(false);
                            getAgencyData()
                                .then((res) => {
                                    if(res?.status === 200) {
                                        setAgency(true);
                                        setData(JSON.parse(res?.data?.data));
                                    }
                                });
                        }
                    });
            });
    }, []);

    useEffect(() => {
        if(guest === false) {
            setEmail(getLoggedUserEmail());
        }
    }, [guest]);

    const handleSubmit = () => {
        if(isEmail(email) && name) {
            sendContactForm(name, email, msg)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(2);
                    }
                })
                .catch(() => {
                    setError(2);
                });
        }
        else {
            setError(1);
        }
    }

    useEffect(() => {
        if(success) {
            if(window.innerWidth > 996) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }

            formRef.current.style.opacity = '0';
            setTimeout(() => {
                formRef.current.style.height = '0';
                formRef.current.style.padding = '0';
                formRef.current.style.margin = '0';
                formRef.current.style.visibility = 'hidden';
            }, 300);

            successRef.current.style.visibility = 'visible';
            successRef.current.style.height = 'auto';
            successRef.current.style.padding = '60px 0 40px';
            setTimeout(() => {
                successRef.current.style.opacity = '1';
            }, 300);
        }
    }, [success]);

    return <div className="container container--contact">
        {data ? <LoggedUserHeader data={data} agency={agency} /> : ''}

        <main className="page">
            <h1 className="page__header bold">
                Dane kontaktowe
            </h1>
            <p className="contact__text">
                Skontaktuj się z nami używając poniższych danych lub bezpośrednio przez formularz kontaktowy.
            </p>
            <div className="contact__flex flex">
                <div className="contact__left">
                    <h2 className="contact__companyName">
                        Jooob.eu Sp. z.o.o.
                    </h2>
                    <p className="contact__data">
                        <span>ul. Warszawska 1/1</span>
                        <span>23-240 Bydgoszcz</span>
                    </p>
                    <p className="contact__data">
                        <span>NIP 123 12 12 434</span>
                        <span>Bank ING</span>
                        <span>42 1525 2222 0000 1111 2854 23</span>
                    </p>
                    <h3 className="contact__smallHeader">
                        Kontakt:
                    </h3>
                    <p className="contact__data">
                        <span>
                            tel: +48 545 356 235
                        </span>
                        <span>
                            Dostępny w godzinach 8:00 - 16:00
                        </span>
                        <span className="marginTop">
                            mail: kontakt@jooob.eu
                        </span>
                    </p>
                </div>
                <div className="contact__form">
                    <h4 className="contact__form__header">
                        Formularz kontaktowy
                    </h4>

                    <div className="application__success" ref={successRef}>
                        <img className="img" src={checkIcon} alt="dodano" />
                        <h3 className="application__header">
                            Twój formularz został wysłany! Odpowiemy najszybciej jak to możliwe.
                        </h3>
                        <div className="buttons center">
                            <a href="/" className="btn">
                                Strona główna
                            </a>
                        </div>
                    </div>

                    <div className="contact__form__inner" ref={formRef}>
                        <label className="label">
                            Imię i nazwisko
                            <input className="input"
                                   value={name}
                                   onChange={(e) => { setName(e.target.value); }}
                                   placeholder="Imię i nazwisko" />
                        </label>
                        <label className="label">
                            Adres e-mail
                            <input className="input"
                                   value={email}
                                   onChange={(e) => { setEmail(e.target.value); }}
                                   placeholder="Adres e-mail" />
                        </label>
                        <label className="label">
                            Twoja wiadomość
                            <textarea className="input input--textarea"
                                      value={msg}
                                      onChange={(e) => { setMsg(e.target.value); }}
                                      placeholder="Twoja wiadomość" />
                        </label>

                        {error ? <span className="info info--error">
                        {error === 1 ? 'Uzupelnij poprawnie wymagane dane' : formErrors[1]}
                    </span> : ''}

                        <button className="btn btn--applicationSubmit" onClick={() => { handleSubmit(); }}>
                            Wyślij wiadomość
                            <img className="img" src={arrow} alt="wyślij" />
                        </button>
                    </div>
                </div>
            </div>
        </main>

        {guest ? <Footer /> : <LoggedUserFooter />}
    </div>
};

export default ContactPage;
