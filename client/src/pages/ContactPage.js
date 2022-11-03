import React, {useContext, useEffect, useRef, useState} from 'react';
import {authUser, getUserData, sendContactForm} from "../helpers/user";
import {authAgency, getAgencyData} from "../helpers/agency";
import LoggedUserHeader from "../components/LoggedUserHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import Footer from "../components/Footer";
import {getLoggedUserEmail, isEmail} from "../helpers/others";
import arrow from "../static/img/small-white-arrow.svg";
import checkIcon from '../static/img/green-check.svg'
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import {LanguageContext} from "../App";

const ContactPage = () => {
    const [data, setData] = useState(null);
    const [agency, setAgency] = useState(false);
    const [guest, setGuest] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { c } = useContext(LanguageContext);

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
            setLoading(true);
            sendContactForm(name, email, msg, agency || !data ? 'office@jooob.eu' : 'contact@jooob.eu')
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(2);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError(2);
                    setLoading(false);
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
        {data ? <LoggedUserHeader data={data} agency={agency} /> : <PageHeader />}

        <main className={!data ? "page page--narrow" : "page"}>
            {agency ?  <h1 className="page__header bold">
                {c.contactData}
            </h1> : ''}
            {agency ? <p className="contact__text">
                {c.contactDataDescription}
            </p> : ''}
            <div className={agency ? "contact__flex flex" : "contact__flex flex contact--fullWidth"}>
                {agency ? <div className="contact__left">
                    {/*<h2 className="contact__companyName">*/}
                    {/*    AMB Spółka z Ograniczoną Odpowiedzialnością*/}
                    {/*</h2>*/}
                    {/*<p className="contact__data">*/}
                    {/*    <span>ul. Marii Curie Skłodowskiej 62/46</span>*/}
                    {/*    <span>85-733 Bydgoszcz, Polska</span>*/}
                    {/*</p>*/}
                    {/*<p className="contact__data">*/}
                    {/*    <span>NIP 5542998776</span>*/}
                    {/*    <span>REGON 520630508</span>*/}
                    {/*</p>*/}
                    <h3 className="contact__smallHeader">
                        {c.contact}:
                    </h3>
                    <p className="contact__data">
                        <span>
                            {c.phoneNumberShortcut}: +48 600 134 877
                        </span>
                        <span>
                            {c.availableHours} 9:00 - 16:00
                        </span>
                        <span className="marginTop">
                            {c.emailShortcut}: contact@jooob.eu
                        </span>
                    </p>
                </div> : ''}
                <div className="contact__form">
                    <h4 className="contact__form__header">
                        {c.contactForm}
                    </h4>

                    <div className="application__success" ref={successRef}>
                        <img className="img" src={checkIcon} alt="dodano" />
                        <h3 className="application__header">
                            {c.contactFormSend}
                        </h3>
                        <div className="buttons center">
                            <a href="/" className="btn">
                                {c.homepage}
                            </a>
                        </div>
                    </div>

                    <div className="contact__form__inner" ref={formRef}>
                        <label className="label">
                            {c.firstAndLastName}
                            <input className="input"
                                   value={name}
                                   onChange={(e) => { setName(e.target.value); }}
                                   placeholder={c.firstAndLastName} />
                        </label>
                        <label className="label">
                            {c.email}
                            <input className="input"
                                   value={email}
                                   onChange={(e) => { setEmail(e.target.value); }}
                                   placeholder={c.email} />
                        </label>
                        <label className="label">
                            {c.yourMessage}
                            <textarea className="input input--textarea"
                                      value={msg}
                                      onChange={(e) => { setMsg(e.target.value); }}
                                      placeholder={c.yourMessage} />
                        </label>

                        {error ? <span className="info info--error">
                        {error === 1 ? c.passwordError1 : JSON.parse(c.formErrors)[1]}
                    </span> : ''}

                        {!loading ? <button className="btn btn--applicationSubmit" onClick={() => { handleSubmit(); }}>
                            {c.sendMessage}
                            <img className="img" src={arrow} alt="wyślij" />
                        </button> : <div className="center marginTop">
                            <Loader />
                        </div>}
                    </div>
                </div>
            </div>
        </main>

        {guest ? <Footer /> : <LoggedUserFooter />}
    </div>
};

export default ContactPage;
