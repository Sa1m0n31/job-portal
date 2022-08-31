import React, {useContext, useEffect, useRef, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import backArrow from "../static/img/back-arrow-grey.svg";
import {getFastOfferById, getOfferById, submitFastApplication} from "../helpers/offer";
import settings from "../static/settings";
import magnifier from '../static/img/magnifier.svg'
import pen from '../static/img/pen-blue.svg'
import plusIcon from "../static/img/plus-icon-opacity.svg";
import trashIcon from "../static/img/trash.svg";
import fileIcon from "../static/img/doc.svg";
import {currencies} from "../static/content";
import arrow from '../static/img/small-white-arrow.svg'
import {submitApplication} from "../helpers/offer";
import {getDate, getLoggedUserEmail, isElementInArray} from "../helpers/others";
import checkIcon from '../static/img/green-check.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'
import {PDFDownloadLink} from "@react-pdf/renderer";
import CV from "../components/CV";
import {LanguageContext} from "../App";
import Loader from "../components/Loader";

const ApplicationForJobPage = ({data}) => {
    const [offer, setOffer] = useState('');
    const [agency, setAgency] = useState({});
    const [message, setMessage] = useState('');
    const [contactForms, setContactForms] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [error, setError] = useState('');
    const [friendLink, setFriendLink] = useState('');
    const [fast, setFast] = useState(false);
    const [c1, setC1] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { c } = useContext(LanguageContext);

    const applicationRef = useRef(null);
    const successRef = useRef(null);

    useEffect(() => {
        if(data?.friendLink) {
            setFriendLink(data.friendLink);
        }
    }, [data]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const type = params.get('typ');

        if(id) {
            if(type === 'blyskawiczna') {
                getFastOfferById(id)
                    .then((res) => {
                        if(res?.status === 200) {
                            const r = res?.data;
                            setOffer(Array.isArray(r) ? r[0] : r);
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
                            const r = res?.data;
                            setOffer(Array.isArray(r) ? r[0] : r);
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
            setError(JSON.parse(c.attachmentsErrors)[0]);
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
            setError(c.privacyPolicyError);
        }
        else {
            setLoading(true);
            let func = fast ? submitFastApplication : submitApplication;
            func(offer.o_id, message, friendLink, contactForms, attachments, offer.a_id)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(JSON.parse(c.formErrors)[1]);
                    }

                    setLoading(false);
                })
                .catch((err) => {
                   if(err.status === 415) {
                       setError(c.unsupportedMediaTypeInfo);
                   }
                   else if(err.response.status === 502) {
                       setError(c.userAlreadyApplied);
                   }
                   else {
                       setError(JSON.parse(c.formErrors)[1]);
                   }

                   setLoading(false);
                });
        }
    }

    return offer ? <div className="container container--offer container--application">
        <LoggedUserHeader data={data} />

        {offer ? <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{c.userZone}</span>
                </span>
            <a href={`/oferta-pracy?id=${offer.o_id}`} className="userAccount__top__btn">
                <img className="img" src={backArrow} alt="powrót" />
                {c.backToOffer}
            </a>
        </aside> : ''}

        <div className="application__success" ref={successRef}>
            <img className="img" src={checkIcon} alt="dodano" />
            <h3 className="application__header">
                {c.applicationSend}
            </h3>
            <div className="buttons center">
                <a href="/oferty-pracy" className="btn">
                    {c.seeJobOffers}
                </a>
                <a href="/konto-pracownika" className="btn btn--white">
                    {c.myAccount}
                </a>
            </div>
        </div>

        <main className="application flex" ref={applicationRef}>
            <div className="application__section">
                <figure className="application__profileImage">
                    <img className="img" src={agency?.logo ? `${settings.API_URL}/${agency.logo}` : userPlaceholder} alt="logo" />
                </figure>

                <h2 className="application__header application__header--first">
                    {c.youApply} <span className="bold">{offer.o_title}</span> {c.inCompany} {agency.name}.
                </h2>
                <h3 className="application__header">
                    {c.CVattached}
                </h3>
                <div className="application__buttons flex flex--start">
                    {data ? <PDFDownloadLink document={<CV profileImage={`${settings.API_URL}/${data?.profileImage}`}
                                                           c={c}
                                                           fullName={data.firstName ? `${data.firstName} ${data.lastName}` : c.anonim}
                                                           categories={data.categories}
                                                           email={getLoggedUserEmail()}
                                                           birthday={data.birthdayYear ? getDate(data?.birthdayDay, data?.birthdayMonth, data?.birthdayYear) : c.noInfo}
                                                           schools={data.schools}
                                                           jobs={data.jobs}
                                                           additionalLanguages={data.extraLanguages}
                                                           languages={data.languages}
                                                           drivingLicence={data.drivingLicenceCategories}
                                                           certs={data.certificates?.concat(data.courses)}
                                                           desc={data.situationDescription}
                                                           phoneNumber={data.phoneNumber ? `${data.phoneNumberCountry} ${data.phoneNumber}` : c.noInfo}
                                                           location={data.country >= 0 ? `${data.city}, ${JSON.parse(c.countries)[data.country]}` : c.noInfo}
                                                           currentPlace={data.currentCountry >= 0 ? `${JSON.parse(c.countries)[data.currentCountry]}, ${data.currentCity}`: c.noInfo}
                                                           availability={data.availabilityDay >= 0 ? getDate(data?.availabilityDay, data?.availabilityMonth, data?.availabilityYear) : c.noInfo}
                                                           ownAccommodation={data.ownAccommodation ? data.accommodationPlace : ''}
                                                           ownTools={data.ownTools ? c.yes : ''}
                                                           salary={data.salaryFrom && data.salaryTo ? `${data.salaryFrom} - ${data.salaryTo} ${data.salaryCurrency >= 0 ? currencies[data.salaryCurrency] : 'EUR'} ${c.netto}/${data.salaryType === 0 ? c.monthlyShortcut : c.weeklyShortcut}` : c.noInfo}
                    />}
                                             fileName={data.firstName && data.lastName ? `CV-${data.firstName}_${data.lastName}.pdf` : `CV-${c.anonim}.pdf`}
                                             className="btn btn--application">
                        {c.preview}
                        <img className="img" src={magnifier} alt="pobierz" />
                    </PDFDownloadLink> : ''}
                    <a className="btn btn--application btn--white" href="/edycja-danych">
                        {c.edition}
                        <img className="img" src={pen} alt="edytuj-dane-kandydata" />
                    </a>
                </div>
                <h4 className="application__header">
                    {c.additionalInfoForAgency}
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

                <h4 className="application__header application__header--friendLink">
                    {c.friendLink}
                </h4>
                <label className="application__label">
                    <input className="input input--friendLink"
                           value={friendLink}
                           onChange={(e) => { setFriendLink(e.target.value); }} />
                </label>

                <h5 className="application__header application__header--marginTop">
                    {c.preferableContact}
                </h5>
                <div className="flex flex--start">
                    <label className={isElementInArray(0, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(0); }}>
                            <span></span>
                        </button>
                        {c.phoneForm}
                    </label>
                    <label className={isElementInArray(1, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(1); }}>
                            <span></span>
                        </button>
                        {c.mailForm}
                    </label>
                    <label className={isElementInArray(2, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(2); }}>
                            <span></span>
                        </button>
                        {c.messageForm}
                    </label>
                    <label className={isElementInArray(3, contactForms) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={(e) => { e.preventDefault(); handleContactForms(3); }}>
                            <span></span>
                        </button>
                        {c.lack}
                    </label>
                </div>
                <h6 className="application__header">
                    {c.additionalAttachments}
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
                    {c.offerSummary}
                </h2>
                <p className="application__text">
                    <span className="bold">{c.company}:</span>
                    {agency.name}
                </p>
                <p className="application__text">
                    <span className="bold">{c.post}:</span>
                    {offer.o_title}
                </p>
                <p className="application__text">
                    <span className="bold">{c.jobPlace}:</span>
                    {offer.o_city}, {JSON.parse(c.countries)[offer.o_country]}
                </p>
                <p className="application__text">
                    <span className="bold">{c.salary}:</span>
                    {offer.o_salaryFrom} - {offer.o_salaryTo} {currencies[offer.o_currency]} {c.netto}/ {offer.o_salaryType === 0 ? c.monthlyShortcut : c.weeklyShortcut}
                </p>
                <p className="application__text">
                    <span className="bold block">{c.companyDescription}:</span>
                    {agency.description}
                </p>
                <p className="application__text">
                    <span className="bold block">{c.postDescription}:</span>
                    {offer.o_description}
                </p>

                <label className="label label--flex label--checkbox">
                    <button className={c1 ? "checkbox checkbox--selected center" : "checkbox center"} onClick={() => { setC1(!c1); }}>
                        <span></span>
                    </button>
                    {c.applicationCheckbox}
                </label>
                <div className="application__extraInfo">
                    <p>
                        {c.applicationExtraInfo1}
                    </p>
                    <p>
                        {c.applicationExtraInfo2}
                    </p>
                </div>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--applicationSubmit" onClick={() => { handleSubmit(); }}>
                    {c.sendCV}
                    <img className="img" src={arrow} alt="wyślij" />
                </button> : <div className="center">
                    <Loader />
                </div>}
            </div>
        </main>
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default ApplicationForJobPage;
