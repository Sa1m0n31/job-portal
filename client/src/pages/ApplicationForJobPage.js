import React, {useEffect, useRef, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import backArrow from "../static/img/back-arrow-grey.svg";
import {getFastOfferById, getOfferById, submitFastApplication} from "../helpers/offer";
import settings from "../static/settings";
import magnifier from '../static/img/magnifier.svg'
import pen from '../static/img/pen-blue.svg'
import plusIcon from "../static/img/plus-icon-opacity.svg";
import trashIcon from "../static/img/trash.svg";
import fileIcon from "../static/img/doc.svg";
import {attachmentsErrors, countries, currencies, formErrors} from "../static/content";
import arrow from '../static/img/small-white-arrow.svg'
import {submitApplication} from "../helpers/offer";
import {isElementInArray} from "../helpers/others";
import checkIcon from '../static/img/green-check.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'

const ApplicationForJobPage = ({data}) => {
    const [offer, setOffer] = useState('');
    const [agency, setAgency] = useState({});
    const [message, setMessage] = useState('');
    const [contactForms, setContactForms] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [error, setError] = useState('');
    const [fast, setFast] = useState(false);
    const [c1, setC1] = useState(false);
    const [success, setSuccess] = useState(false);

    const applicationRef = useRef(null);
    const successRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const type = params.get('typ');

        if(id) {
            if(type === 'blyskawiczna') {
                getFastOfferById(id)
                    .then((res) => {
                        if(res?.status === 200) {
                            setOffer(res?.data[0]);
                            setFast(true);
                        }
                    })
                    .catch(() => {
                        window.location = '/';
                    });
            }
            else {
                getOfferById(id)
                    .then((res) => {
                        if(res?.status === 200) {
                            setOffer(res?.data[0]);
                        }
                    })
                    .catch(() => {
                        window.location = '/';
                    });
            }
        }
        else {
            window.location = '/';
        }
    }, []);

    useEffect(() => {
        if(offer) {
            const a = JSON.parse(offer.a_data);
            setAgency({
                name: a.name,
                logo: a.logo,
                description: a.description
            });
        }
    }, [offer]);

    useEffect(() => {
        if(c1 || attachments) {
            setError('');
        }
    }, [c1, attachments]);

    useEffect(() => {
        if(success) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            applicationRef.current.style.opacity = '0';
            setTimeout(() => {
                applicationRef.current.style.height = '0';
                applicationRef.current.style.padding = '0';
                applicationRef.current.style.margin = '0';
                applicationRef.current.style.visibility = 'hidden';
            }, 300);

            successRef.current.style.visibility = 'visible';
            successRef.current.style.height = 'auto';
            successRef.current.style.padding = '60px 0 40px';
            setTimeout(() => {
                successRef.current.style.opacity = '1';
            }, 300);
        }
    }, [success]);

    const updateMessage = (val) => {
        if(val.length <= 375) {
            setMessage(val);
        }
    }

    const handleAttachments = (e) => {
        e.preventDefault();

        if(e.target.files.length > 5) {
            e.preventDefault();
            setError(attachmentsErrors[0]);
        }
        else {
            setError('');
            setAttachments(Array.from(e.target.files).map((item) => {
                return {
                    name: item.name,
                    file: item
                }
            }));
        }
    }

    const changeAttachmentName = (i, val) => {
        setAttachments(prevState => (prevState.map((item, index) => {
            if(index === i) {
                return {
                    name: val,
                    file: item.file
                }
            }
            else {
                return item;
            }
        })));
    }

    const removeAttachment = (i) => {
        setAttachments(prevState => (prevState.filter((item, index) => (index !== i))));
    }

    const handleContactForms = (i) => {
        if(isElementInArray(i, contactForms)) {
            setContactForms(prevState => (prevState.filter((item) => (item !== i))));
        }
        else {
            setContactForms(prevState => ([...prevState, i]));
        }
    }

    const handleSubmit = () => {
        if(!c1) {
            setError('Wyraź zgodę na przetwarzanie danych osobowych');
        }
        else {
            let func = fast ? submitFastApplication : submitApplication;
            func(offer.o_id, message, contactForms, attachments, offer.a_id)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(formErrors[1]);
                    }
                })
                .catch((err) => {
                   if(err.status === 415) {
                       setError('Tylko załączniki w formatach: .png. .jpg, .pdf, .txt, .page, .txt są akceptowane');
                   }
                   else if(err.response.status === 502) {
                       setError('Aplikowałeś już na tę ofertę pracy');
                   }
                   else {
                       setError(formErrors[1]);
                   }
                });
        }
    }

    return <div className="container container--offer container--application">
        <LoggedUserHeader data={data} />

        {offer ? <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracownika</span>
                </span>
            <a href={`/oferta-pracy?id=${offer.o_id}`} className="userAccount__top__btn">
                <img className="img" src={backArrow} alt="powrót" />
                Powrót do oferty
            </a>
        </aside> : ''}

        <div className="application__success" ref={successRef}>
            <img className="img" src={checkIcon} alt="dodano" />
            <h3 className="application__header">
                Twoje zgłoszenie zostało wysłane do pracodawcy!
            </h3>
            <div className="buttons center">
                <a href="/oferty-pracy" className="btn">
                    Przeglądaj oferty pracy
                </a>
                <a href="/konto-pracownika" className="btn btn--white">
                    Moje konto
                </a>
            </div>
        </div>

        <main className="application flex" ref={applicationRef}>
            <div className="application__section">
                <figure className="application__profileImage">
                    <img className="img" src={agency?.logo ? `${settings.API_URL}/${agency.logo}` : userPlaceholder} alt="logo" />
                </figure>

                <h2 className="application__header application__header--first">
                    Aplikujesz na stanowisko <span className="bold">{offer.o_title}</span> w firmie {agency.name}.
                </h2>
                <h3 className="application__header">
                    Załączyliśmy Twoje automatycznie wygenerowane CV
                </h3>
                <div className="application__buttons flex flex--start">
                    <button className="btn btn--application">
                        Podgląd
                        <img className="img" src={magnifier} alt="zobacz-cv" />
                    </button>
                    <a className="btn btn--application btn--white" href="/edycja-danych">
                        Edycja
                        <img className="img" src={pen} alt="edytuj-dane-kandydata" />
                    </a>
                </div>
                <h4 className="application__header">
                    Dodatkowa wiadomośc dla pracodawcy (opcjonalnie)
                </h4>
                <label className="application__label">
                    <textarea className="input--textarea input--application"
                              value={message}
                              onChange={(e) => { updateMessage(e.target.value); }}
                    >
                    </textarea>
                    <span className="input__counter">
                        {message.length}/300
                    </span>
                </label>
                <h5 className="application__header application__header--marginTop">
                    Preferowane formy kontaktu
                </h5>
                <div className="flex flex--start">
                    <label className={isElementInArray(0, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(0); }}>
                            <span></span>
                        </button>
                        telefonicznie
                    </label>
                    <label className={isElementInArray(1, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(1); }}>
                            <span></span>
                        </button>
                        mailowo
                    </label>
                    <label className={isElementInArray(2, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(2); }}>
                            <span></span>
                        </button>
                        prywatna wiadomość przez Jooob.eu
                    </label>
                    <label className={isElementInArray(3, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(3); }}>
                            <span></span>
                        </button>
                        brak
                    </label>
                </div>
                <h6 className="application__header">
                    Miejsce na dodatkowe załączniki
                </h6>
                <label className="filesUploadLabel center">
                    {attachments?.length === 0 ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : ''}
                    <input className="input input--file"
                           type="file"
                           multiple={true}
                           maxLength={5}
                           onChange={(e) => { handleAttachments(e); }} />
                </label>

                {Array.from(attachments)?.map((item, index) => {
                    return <div className="filesUploadLabel__item" key={index}>
                        <button className="removeAttachmentBtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeAttachment(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={fileIcon} alt={`file-${index}`} />
                        <input className="fileName"
                               onChange={(e) => { changeAttachmentName(index, e.target.value); }}
                               value={item.name}
                        >
                        </input>
                    </div>
                })}
            </div>

            <div className="application__section">
                <h2 className="application__header application__header--big">
                    Podsumowanie oferty
                </h2>
                <p className="application__text">
                    <span className="bold">Firma:</span>
                    {agency.name}
                </p>
                <p className="application__text">
                    <span className="bold">Stanowisko:</span>
                    {offer.o_title}
                </p>
                <p className="application__text">
                    <span className="bold">Miejsce pracy:</span>
                    {offer.o_city}, {countries[offer.o_country]}
                </p>
                <p className="application__text">
                    <span className="bold">Pensja:</span>
                    {offer.o_salaryFrom} - {offer.o_salaryTo} {currencies[offer.o_currency]} netto/ {offer.o_salaryType === 0 ? 'tyg.' : 'mies.'}
                </p>
                <p className="application__text">
                    <span className="bold block">Opis firmy:</span>
                    {agency.description}
                </p>
                <p className="application__text">
                    <span className="bold block">Opis stanowiska:</span>
                    {offer.o_description}
                </p>

                <label className="label label--flex label--checkbox">
                    <button className={c1 ? "checkbox checkbox--selected center" : "checkbox center"} onClick={() => { setC1(!c1); }}>
                        <span></span>
                    </button>
                    Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji (zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO).
                </label>
                <div className="application__extraInfo">
                    <p>
                        Niezależnie i odrębnie od wskazanego powyżej pracodawcy portal Jooob.eu odpowiada za przetwarzanie Twoich danych podanych w formularzu aplikacyjnym.
                    </p>
                    <p>
                        My, portalu Jooob.eu, także odpowiadamy za przetwarzanie Twoich danych, kiedy wypełniasz formularz aplikacyjny. Jesteśmy współadministratorami Twoich danych. Możesz od nas żądać dostępu do Twoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia do innego administratora, jak również masz prawo wnieść sprzeciw lub złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.
                    </p>
                </div>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                <button className="btn btn--applicationSubmit" onClick={() => { handleSubmit(); }}>
                    Wyślij CV do pracodawcy
                    <img className="img" src={arrow} alt="wyślij" />
                </button>
            </div>
        </main>
    </div>
};

export default ApplicationForJobPage;
