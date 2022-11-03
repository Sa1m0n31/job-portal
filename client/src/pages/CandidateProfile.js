import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {currencies, flags, languageVersions} from "../static/content";
import settings from "../static/settings";
import locationIcon from "../static/img/location.svg";
import suitcaseIcon from "../static/img/suitcase-grey.svg";
import phoneIcon from "../static/img/phone-grey.svg";
import messageIcon from "../static/img/message-grey.svg";
import whatsAppIcon from "../static/img/whatsapp.svg";
import downloadWhite from "../static/img/download-white.svg";
import backIcon from '../static/img/back-arrow-grey.svg'
import {getDate} from "../helpers/others";
import graduateIcon from "../static/img/students-cap.svg";
import suitcaseBlue from "../static/img/suitcase-blue.svg";
import checkIcon from "../static/img/check-small.svg";
import starIcon from "../static/img/star.svg";
import fileIcon from "../static/img/file-icon.svg";
import downloadIcon from "../static/img/download-grey.svg";
import {authUser, getUserById, getUserData} from "../helpers/user";
import Loader from "../components/Loader";
import userPlaceholder from '../static/img/user-placeholder.svg'
import {PDFDownloadLink} from "@react-pdf/renderer";
import CV from "../components/CV";
import {authAgency, getAgencyData} from "../helpers/agency";
import {LanguageContext} from "../App";
import LoggedUserFooter from "../components/LoggedUserFooter";
import NotesModal from "../components/NotesModal";
import {getNotes} from "../helpers/notes";
import penIcon from '../static/img/pen.svg'
import invitationIcon from '../static/img/invitation.svg'
import OffersModal from "../components/OffersModal";

const CandidateProfile = () => {
    const [data, setData] = useState({});
    const [agency, setAgency] = useState(null);
    const [user, setUser] = useState(null);
    const [id, setId] = useState(null);
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [notesVisible, setNotesVisible] = useState(false);
    const [offersModalVisible, setOffersModalVisible] = useState(false);
    const [agencyId, setAgencyId] = useState(null);

    const { c } = useContext(LanguageContext);

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
                                        setAgencyId(res?.data?.id);
                                        setData(JSON.parse(res?.data?.data));
                                    }
                                });
                        }
                    })
                    .catch(() => {
                        window.location = '/';
                    });
            });

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if(id) {
            setId(parseInt(id));
            getUserById(id)
                .then((res) => {
                    if(res?.status === 200) {
                        setEmail(res?.data?.email);
                        const d = JSON.parse(res?.data?.data);
                        console.log(d);
                        setUser(d);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else {
            window.location = '/';
        }
    }, []);

    useEffect(() => {
        if(agencyId && id && !notesVisible) {
            getNotes(id, agencyId)
                .then((res) => {
                     if(res?.status === 200) {
                         setNotes(res?.data?.content);
                     }
                });
        }
    }, [id, agencyId, notesVisible]);

    useEffect(() => {
        if(window.innerWidth >= 996) {
            let maxHeight = 0;
            const secondLine = Array.from(document.querySelectorAll('.userAccount__box--50--1'));
            const thirdLine = Array.from(document.querySelectorAll('.userAccount__box--50--2'));
            const fourthLine = Array.from(document.querySelectorAll('.userAccount__box')).slice(5);
            for(const box of thirdLine) {
                const h = parseInt(getComputedStyle(box).getPropertyValue('height').split(' ')[0]);
                if(h > maxHeight) maxHeight = h;
            }

            thirdLine.forEach((item) => {
                item.style.height = `${maxHeight}px`;
            });

            maxHeight = 0;
            for(const box of secondLine) {
                const h = parseInt(getComputedStyle(box).getPropertyValue('height').split(' ')[0]);
                if(h > maxHeight) maxHeight = h;
            }

            secondLine.forEach((item) => {
                item.style.height = `${maxHeight}px`;
            });

            maxHeight = 0;
            for(const box of fourthLine) {
                const h = parseInt(getComputedStyle(box).getPropertyValue('height').split(' ')[0]);
                if(h > maxHeight) maxHeight = h;
            }

            fourthLine.forEach((item) => {
                item.style.height = `${maxHeight}px`;
            });
        }
    }, [user]);

    return user ? <div className="container container--user container--userProfile">
        <LoggedUserHeader data={data}
                          agency={agency} />

        {notesVisible ? <NotesModal notes={notes}
                                    userId={id}
                                    agencyId={agencyId}
                                    closeModal={() => { setNotesVisible(false); }} /> : ''}

        {offersModalVisible ? <OffersModal closeModal={() => { setOffersModalVisible(false); }}
                                           userId={id}
                                           agencyId={agencyId}
                                           agencyName={data.name}
                                           userEmail={email} /> : ''}

        <div className="userAccount">
            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{agency ? c.agencyZone : c.userZone}</span>
                </span>
                <a href="javascript: history.go(-1)"
                   className="userAccount__top__btn">
                    <img className="img" src={backIcon} alt="edytuj" />
                    {c.comeback}
                </a>
            </aside>
            <main className="userAccount__box userAccount__box__top userAccount__box--100 flex">
                <div className="userAccount__box__left">
                    <figure>
                        {user?.country >= 0 ? <span className={`flag flag--mobile fi fi-${flags[user.country].toLowerCase()}`}></span> : ''}
                        <img className="img" src={user?.profileImage ? `${settings.API_URL}/${user?.profileImage}` : userPlaceholder} alt="zdjecie-profilowe" />
                    </figure>
                    <div className="userAccount__box__mainData">
                        <h1 className="userAccount__box__fullName">
                            {user?.firstName ? `${user.firstName} ${user?.lastName}` : c.anonim}
                            {user?.country >= 0 ? <span className={`flag fi fi-${flags[user.country].toLowerCase()}`}></span> : ''}
                        </h1>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={locationIcon} alt="lokalizacja" />
                            {user?.city ? user?.city : c.noInfo}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={suitcaseIcon} alt="branża" />
                            {user?.categories ? JSON.parse(c.categories)[user?.categories[0]] : c.noInfo}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={phoneIcon} alt="numer-telefonu" />
                            {user?.phoneNumber ? `${user?.phoneNumberCountry} ${user?.phoneNumber}` : c.noInfo}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={messageIcon} alt="adres-e-mail" />
                            {email}
                        </p>
                        {agency ? <div className="userAccount__box__mainData__buttons">
                            {user?.phoneNumber && user?.phoneNumberCountry ? <a
                                href={`https://wa.me/${user?.phoneNumberCountry?.split('+')[1]}${user?.phoneNumber}`}
                                className="btn btn--whatsApp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img className="img" src={whatsAppIcon} alt="napisz-wiadomosc" />
                                WhatsApp
                            </a> : ''}
                            <a href={`/nowa-wiadomosc?kandydat=${id}`}
                               className="btn btn--writeMessage">
                                <img className="img" src={messageIcon} alt="napisz-wiadomosc" />
                                {c.message}
                            </a>
                        </div> : ''}
                    </div>
                </div>

                <div className={agency ? "userAccount__box__right flex--column--end" : "userAccount__box__right"}>
                    {user?.firstName && user?.lastName ? <label className="userAccount__box__downloadCV">
                        {c.generateAndDownloadCV}:
                        {user ? <PDFDownloadLink document={<CV profileImage={user.profileImage ? `${settings.API_URL}/${user?.profileImage}` : userPlaceholder}
                                                               c={c}
                                                               // companyLogo={`${settings.API_URL}/${data.logo}`}
                                                               // companyName={data.name}
                                                               fullName={`${user.firstName} ${user.lastName}`}
                                                               categories={user.categories}
                                                               email={user.email}
                                                               birthday={getDate(user?.birthdayDay, user?.birthdayMonth, user?.birthdayYear)}
                                                               schools={user.schools}
                                                               jobs={user.jobs}
                                                               additionalLanguages={user.extraLanguages}
                                                               languages={user.languages}
                                                               drivingLicence={user.drivingLicenceCategories}
                                                               certs={user.certificates ? user.certificates : []}
                                                               courses={user.courses ? user.courses : []}
                                                               skills={user.skills ? user.skills : []}
                                                               desc={user.situationDescription}
                                                               phoneNumber={user.phoneNumber ? `${user.phoneNumberCountry} ${user.phoneNumber}` : c.noInfo}
                                                               location={user.country >= 0 ? `${user.address}, ${user.city}, ${JSON.parse(c.countries)[user.country]}` : c.noInfo}
                                                               currentPlace={user.currentCountry >= 0 ? `${JSON.parse(c.countries)[user.currentCountry]}, ${user.currentCity}`: c.noInfo}
                                                               availability={user.availabilityDay >= 0 ? getDate(user?.availabilityDay, user?.availabilityMonth, user?.availabilityYear) : c.noInfo}
                                                               ownAccommodation={user.ownAccommodation ? user.accommodationPlace : ''}
                                                               ownTools={user.ownTools ? c.yes : ''}
                                                               salary={user.salaryFrom && user.salaryTo ? `${user.salaryFrom} - ${user.salaryTo} ${user.salaryCurrency >= 0 ? currencies[user.salaryCurrency] : 'EUR'} ${c.netto}/${user.salaryType === 0 ? c.monthlyShortcut : c.weeklyShortcut}` : c.noInfo}
                        />}
                                                 fileName={`CV-${user.firstName}_${user.lastName}.pdf`}
                                                 className="btn btn--downloadCV">
                            <img className="img" src={downloadWhite} alt="pobierz" />
                            {c.downloadCV}
                        </PDFDownloadLink> : ''}
                    </label> : ''}

                    {agency ? <div className="candidateProfile__agencySection">
                        <button className="btn btn--notes btn--sendOffer" onClick={() => { setOffersModalVisible(true); }}>
                            <img className="img" src={invitationIcon} alt="pen" />
                            {c.invitation1}
                        </button>
                    </div>: ''}
                </div>
            </main>

            <div className="userAccount__box userAccount__box--50 userAccount__box--50--1 noscroll">
                <h3 className="userAccount__box__header">
                    {c.personalDataAndContact}
                </h3>
                <div className="userAccount__box__pairsWrapper">
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.firstAndLastName}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.firstName ? `${user.firstName} ${user?.lastName}` : c.anonim}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.phoneNumberShortcut}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.phoneNumber ? `${user?.phoneNumberCountry} ${user?.phoneNumber}` : c.noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.birthday}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.birthdayDay >= 0 ? getDate(user?.birthdayDay, user?.birthdayMonth, user?.birthdayYear) : c.noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.email}
                        </span>
                        <p className="userAccount__box__value">
                            {email}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.livingAddress}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.city ? <span>
                                {user?.city}, {user?.address}<br/>
                                {c.country}: {JSON.parse(c.countries)[user?.country]}
                            </span> : c.noInfo}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--50 userAccount__box--50--1 noscroll">
                <h3 className="userAccount__box__header">
                    {c.notes2}
                </h3>
                <p className="userAccount__box__text">
                    {notes}
                </p>
                <button className="btn btn--notes" onClick={() => { setNotesVisible(true); }}>
                    <img className="img" src={penIcon} alt="pen" />
                    {c.notes1}
                </button>
            </div>

            <div className="userAccount__box userAccount__box--50 userAccount__box--50--2 noscroll">
                <h3 className="userAccount__box__header">
                    {c.finishedSchools}
                </h3>
                {user?.schools?.map((item, index) => {
                    return <div className="userAccount__school flex flex--start" key={index}>
                        <figure className="center">
                            <img className="img" src={graduateIcon} alt="absolwent" />
                        </figure>
                        <div className="userAccount__school__content">
                            <h4 className="userAccount__school__header">
                                {item.name}
                            </h4>
                            <h5 className="userAccount__school__subheader">
                                {item.title}
                            </h5>
                            <h6 className="userAccount__school__date">
                                {item.from} - {item.to ? item.to : c.during}
                            </h6>
                        </div>
                    </div>
                })}
            </div>

            <div className="userAccount__box userAccount__box--50 userAccount__box--50--2 noscroll">
                <h3 className="userAccount__box__header">
                    {c.jobExperience}
                </h3>
                {user.jobs ? user?.jobs?.map((item, index) => {
                    return <div className="userAccount__school flex flex--start" key={index}>
                        <figure className="center">
                            <img className="img img--suitcase" src={suitcaseBlue} alt="praca" />
                        </figure>
                        <div className="userAccount__school__content">
                            <h4 className="userAccount__school__header">
                                {item.name}
                            </h4>
                            <h5 className="userAccount__school__subheader">
                                {item.title}
                            </h5>
                            <h6 className="userAccount__school__date">
                                {item.from} - {item.to ? item.to : c.during}
                            </h6>
                        </div>
                    </div>
                }) : ''}
            </div>

            {/* THIRD LINE */}
            <div className="userAccount__box userAccount__box--20">
                <h3 className="userAccount__box__header">
                    {c.skills}
                </h3>
                {user?.languages?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        {c.foreignLanguages.charAt(0).toUpperCase() + c.foreignLanguages.slice(1)}
                    </h4>
                    <div className="flex flex--start">
                        {user.languages?.map((item, index) => {
                            return <div className="userAccount__box__language" key={index}>
                                <img className="img" src={checkIcon} alt="język" />
                                {JSON.parse(c.languages)[item.language]}
                                <span className="lvl">
                                    {item.lvl}
                                </span>
                            </div>
                        })}
                    </div>
                </> : ''}

                {user?.drivingLicenceCategories?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        {c.drivingLicence.charAt(0).toUpperCase() + c.drivingLicence.slice(1)}
                    </h4>
                    <div className="flex flex--start">
                        {user?.drivingLicenceCategories?.map((item, index) => {
                            return <div className="userAccount__box__language" key={index}>
                                <img className="img" src={checkIcon} alt="język" />
                                {JSON.parse(c.drivingLicences)[item]}
                            </div>
                        })}
                    </div>
                </> : ''}
            </div>

            <div className="userAccount__box userAccount__box--20">
                <h3 className="userAccount__box__header">
                    {c.finishedCoursesAndSchools}
                </h3>
                {user?.courses ? user?.courses?.map((item, index) => {
                    return <div className="userAccount__course" key={index}>
                        <img className="img" src={starIcon} alt="gwiazdka" />
                        {item}
                    </div>
                }) : ''}

                {user?.certificates ? user?.certificates?.map((item, index) => {
                    return <div className="userAccount__course" key={index}>
                        <img className="img" src={starIcon} alt="gwiazdka" />
                        {item}
                    </div>
                }) : ''}
            </div>

            <div className="userAccount__box userAccount__box--40">
                <h3 className="userAccount__box__header">
                    {c.additionalInfo}
                </h3>
                <div className="userAccount__box__pairsWrapper">
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.currentLivingPlace}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.currentCity ? `${user?.currentCity}, ${JSON.parse(c.countries)[user?.currentCountry]}` : c.noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.availability}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.availabilityYear ? `${c.from} ${getDate(user?.availabilityDay, user?.availabilityMonth, user?.availabilityYear)}` : c.noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.ownTransport}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.ownTransport !== undefined ? (user?.ownTransport ? c.yes : c.no) : c.noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.bsnNumber}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.hasBsnNumber !== null && user?.hasBsnNumber !== undefined ? (user?.hasBsnNumber ? user?.bsnNumber : '-') : c.noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.longTermJob}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.longTermJobSeeker !== undefined ? (user?.longTermJobSeeker ? c.yes : c.no) : c.noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.ownAccommodation}
                        </span>
                        <p className="userAccount__box__value">
                            {user?.ownAccommodation !== undefined ? (user?.ownAccommodation ? user?.accommodationPlace : c.no) : c.noInfo}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--10">
                <h3 className="userAccount__box__header">
                    {c.attachments}
                </h3>
                {user?.attachments?.map((item, index) => {
                    return <a key={index}
                              download={`${item.path.replace(`-${item.path.split('-')?.slice(-1)[0]}`, '')}.${item.path.split('.').slice(-1)[0]}`.split('\\').slice(-1)[0]}
                              target="_blank"
                              href={`${settings.API_URL}/${item.path}`}
                              className="userAccount__box__attachment">
                        <img className="img img--fileIcon" src={fileIcon} alt="plik" />
                        <span>
                            {item.name ? item.name : index+1}
                        </span>
                        <img className="img" src={downloadIcon} alt="download" />
                    </a>
                })}
            </div>
        </div>
        <LoggedUserFooter />
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default CandidateProfile;
