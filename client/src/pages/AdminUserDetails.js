import React, {useContext, useEffect, useState} from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import {blockUser, unblockUser} from "../helpers/admin";
import {flags} from "../static/content";
import settings from "../static/settings";
import userPlaceholder from "../static/img/user-placeholder.svg";
import locationIcon from "../static/img/location.svg";
import suitcaseIcon from "../static/img/suitcase-grey.svg";
import phoneIcon from "../static/img/phone-grey.svg";
import messageIcon from "../static/img/message-grey.svg";
import {LanguageContext} from "../App";
import {getUserById} from "../helpers/user";
import {PDFDownloadLink} from "@react-pdf/renderer";
import CV from "../components/CV";
import {getDate} from "../helpers/others";
import downloadWhite from "../static/img/download-white.svg";
import graduateIcon from "../static/img/students-cap.svg";
import suitcaseBlue from "../static/img/suitcase-blue.svg";
import checkIcon from "../static/img/check-small.svg";
import starIcon from "../static/img/star.svg";
import fileIcon from "../static/img/file-icon.svg";
import downloadIcon from "../static/img/download-grey.svg";

const AdminUserDetails = () => {
    const [blockCandidate, setBlockCandidate] = useState(0);
    const [unblockCandidate, setUnblockCandidate] = useState(0);
    const [blockSuccess, setBlockSuccess] = useState(0);
    const [unblockSuccess, setUnblockSuccess] = useState(0);
    const [acceptSuccess, setAcceptSuccess] = useState(0);

    const [blocked, setBlocked] = useState(false);
    const [id, setId] = useState(null);
    const [email, setEmail] = useState('');
    const [user, setUser] = useState({});

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        const param = new URLSearchParams(window.location.search);
        const id = param.get('id');
        if(id) {
            getUserById(id)
                .then((res) => {
                    if(res?.status === 200) {
                        const r = res?.data;
                        setId(r.id)
                        setBlocked(r?.blocked);
                        setEmail(r?.email);
                        setUser(JSON.parse(r?.data));
                    }
                })
                .catch((err) => {
                    window.location = '/';
                });
        }
        else {
            window.location = '/panel';
        }
    }, [acceptSuccess, blockSuccess, unblockSuccess]);

    const blockUserById = async () => {
        const res = await blockUser(blockCandidate);
        if(res?.status === 201) {
            setBlockSuccess(1);
        }
        else {
            setBlockSuccess(-1);
        }
    }

    const unblockUserById = async () => {
        const res = await unblockUser(unblockCandidate);
        if(res?.status === 201) {
            setUnblockSuccess(1);
        }
        else {
            setUnblockSuccess(-1);
        }
    }

    useEffect(() => {
        setBlockSuccess(0);
    }, [blockCandidate]);

    useEffect(() => {
        setUnblockSuccess(0);
    }, [unblockCandidate]);

    return id ? <div className="container">
        <LoggedAdminHeader />

        {blockCandidate ? <Modal header="Czy na pewno chcesz zablokować tego użytkownika?"
                                 modalAction={blockUserById}
                                 block="Zablokuj"
                                 success={blockSuccess === 1}
                                 closeModal={() => { setBlockCandidate(0); }}
                                 message={blockSuccess ? "Użytkownik został zablokowany" : ''}
        /> : ''}

        {unblockCandidate ? <Modal header="Czy na pewno chcesz odblokować tego użytkownika?"
                                   modalAction={unblockUserById}
                                   block="Odblokuj"
                                   closeModal={() => { setUnblockCandidate(0); }}
                                   success={unblockSuccess === 1}
                                   message={unblockSuccess ? "Użytkownik został odblokowany" : ''}
        /> : ''}

        <main className="adminMain adminMain--agencyDetails">
            <PanelMenu menuOpen={2} />
            <div className="adminMain__main">
                <div className="flex">
                    <h1 className="adminMain__header">
                        Szczegóły kandydata
                    </h1>
                    <div className="userDetails__actions">
                        <div className="preview__buttons preview__buttons--admin flex flex--end">
                            <div className="preview__col">
                                <span className="preview__col__key">
                                    Edytuj konto
                                </span>
                                <a href={`/panel/edytuj-profil-kandydata?id=${id}`} className="btn btn--unblock">
                                    Edytuj konto
                                </a>
                            </div>
                            <div className="preview__col">
                                <span className="preview__col__key">
                                    Blokada konta
                                </span>
                                {blocked ? <button className="btn btn--unblock"
                                                   onClick={() => { setUnblockCandidate(id); }}>
                                    Odblokuj konto
                                </button> : <button className="btn btn--block"
                                                    onClick={() => { setBlockCandidate(id); }}>
                                    Zablokuj konto
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="agency agency--admin">
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
                            </div>
                        </div>

                        <div className="userAccount__box__right">
                            {user?.firstName && user?.lastName ? <label className="userAccount__box__downloadCV">
                                {c.generateAndDownloadCV}:
                                {user ? <PDFDownloadLink document={<CV profileImage={user.profileImage ? `${settings.API_URL}/${user?.profileImage}` : userPlaceholder}
                                                                       c={c}
                                                                       fullName={`${user.firstName} ${user.lastName}`}
                                                                       categories={user.categories}
                                                                       email={user.email}
                                                                       birthday={getDate(user?.birthdayDay, user?.birthdayMonth, user?.birthdayYear)}
                                                                       schools={user.schools}
                                                                       jobs={user.jobs}
                                                                       additionalLanguages={user.extraLanguages}
                                                                       languages={user.languages}
                                                                       drivingLicence={user.drivingLicenceCategories}
                                                                       certs={user.certificates && user.courses ? user.certificates.concat(user.courses) : []}
                                                                       desc={user.situationDescription}
                                                                       phoneNumber={user.phoneNumber ? `${user.phoneNumberCountry} ${user.phoneNumber}` : c.noInfo}
                                                                       location={user.country >= 0 ? `${user.city}, ${JSON.parse(c.countries)[user.country]}` : c.noInfo}
                                                                       currentPlace={user.currentCountry >= 0 ? `${JSON.parse(c.countries)[user.currentCountry]}, ${user.currentCity}`: c.noInfo}
                                                                       availability={user.availabilityDay >= 0 ? getDate(user?.availabilityDay, user?.availabilityMonth, user?.availabilityYear) : c.noInfo}
                                                                       ownAccommodation={user.ownAccommodation ? user.accommodationPlace : ''}
                                                                       ownTools={user.ownTools ? c.yes : ''}
                                                                       salary={user.salaryFrom && user.salaryTo ? `${user.salaryFrom} - ${user.salaryTo} ${user.salaryCurrency} ${c.netto}/${user.salaryType === 0 ? c.monthlyShortcut : c.weeklyShortcut}` : c.noInfo}
                                />}
                                                         fileName={`CV-${user.firstName}_${user.lastName}.pdf`}
                                                         className="btn btn--downloadCV">
                                    <img className="img" src={downloadWhite} alt="pobierz" />
                                    {c.downloadCV}
                                </PDFDownloadLink> : ''}
                            </label> : ''}
                        </div>
                    </main>

                    <div className="userAccount__box userAccount__box--30 noscroll">
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

                    <div className="userAccount__box userAccount__box--30 noscroll">
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

                    <div className="userAccount__box userAccount__box--30 noscroll">
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
                                // download={`${item.path.replace(`-${item.path.split('-')?.slice(-1)[0]}`, '')}.${item.path.split('.').slice(-1)[0]}`.split('\\').slice(-1)[0]}
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
            </div>
        </main>
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default AdminUserDetails;
