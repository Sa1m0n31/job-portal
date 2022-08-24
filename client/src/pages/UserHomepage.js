import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import penIcon from '../static/img/pen-edit-account.svg'
import settings from "../static/settings";
import locationIcon from '../static/img/location.svg'
import suitcaseIcon from '../static/img/suitcase-grey.svg'
import phoneIcon from '../static/img/phone-grey.svg'
import messageIcon from '../static/img/message-grey.svg'
import downloadWhite from '../static/img/download-white.svg'
import downloadIcon from '../static/img/download-grey.svg'
import suitcaseBlue from '../static/img/suitcase-blue.svg'
import fileIcon from '../static/img/file-icon.svg'
import graduateIcon from '../static/img/students-cap.svg'
import Switch from "react-switch";
import { Tooltip } from 'react-tippy';
import 'react-whatsapp-widget/dist/index.css';
import {toggleUserVisibility, toggleUserWorking} from "../helpers/user";
import {flags} from "../static/content";
import {getDate, getLoggedUserEmail} from "../helpers/others";
import checkIcon from '../static/img/check-small.svg'
import starIcon from '../static/img/star.svg'
import settingsCircle from '../static/img/settings-circle.svg'
import {PDFDownloadLink} from '@react-pdf/renderer';
import CV from '../components/CV'
import copyIcon from '../static/img/copy-icon.svg'
import {LanguageContext} from "../App";

const UserHomepage = ({data, userId, visible, working}) => {
    const [profileVisible, setProfileVisible] = useState(visible);
    const [userWorking, setUserWorking] = useState(working);
    const [copied, setCopied] = useState(false);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        if(window.innerWidth >= 996) {
            let maxHeight = 0;
            const secondLine = Array.from(document.querySelectorAll('.userAccount__box--30'));
            const thirdLine = Array.from(document.querySelectorAll('.userAccount__box')).slice(4);
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
        }
    }, [data]);

    const changeProfileVisibility = () => {
        setProfileVisible(!profileVisible);
        toggleUserVisibility();
    }

    const changeProfileWorking = () => {
        setUserWorking(!userWorking);
        toggleUserWorking();
    }

    const copyLinkToClipboard = () => {
        const input = document.createElement('textarea');
        input.innerHTML = `${settings.WEBSITE_URL}/profil-kandydata?id=${userId}`;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        setCopied(true);
        return result;
    }

    return <div className="container container--user">
        <LoggedUserHeader data={data} />

        <div className="userAccount">
            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{c.userZone}</span>
                </span>
                <a href="/edycja-danych"
                   className="userAccount__top__btn">
                    {c.editProfile}
                    <img className="img" src={penIcon} alt="edytuj" />
                </a>
            </aside>
            <main className="userAccount__box userAccount__box__top userAccount__box--100 flex">
                <div className="userAccount__box__left">
                    <a href="/edycja-danych" className="mobileSettingsBtn">
                        <img className="img" src={settingsCircle} alt="ustawienia" />
                    </a>
                    <figure>
                        <img className="flag flag--mobile" src={flags[data?.country]} alt="flaga" />
                        <img className="img" src={`${settings.API_URL}/${data?.profileImage}`} alt="zdjecie-profilowe" />
                    </figure>
                    <div className="userAccount__box__mainData">
                        <h1 className="userAccount__box__fullName">
                            {data?.firstName} {data?.lastName}
                            <img className="flag" src={flags[data?.country]} alt="flaga" />
                        </h1>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={locationIcon} alt="lokalizacja" />
                            {data?.city}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={suitcaseIcon} alt="branża" />
                            {JSON.parse(c.categories)[data?.categories[0]]}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={phoneIcon} alt="numer-telefonu" />
                            {data?.phoneNumberCountry} {data?.phoneNumber}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={messageIcon} alt="adres-e-mail" />
                            {getLoggedUserEmail()}
                        </p>
                        {copied ? <span className="copyInfo">
                            <img className="img" src={checkIcon} alt="check" />
                            {c.copied}
                        </span> : <button className="btn btn--copyLink flex" onClick={() => { copyLinkToClipboard(); }}>
                            {c.copyLink}
                            <img className="img" src={copyIcon} alt="kopiuj" />
                        </button>}
                    </div>
                </div>

                <div className="userAccount__box__right">
                    <label className="userAccount__box__downloadCV">
                        {c.generateAndDownloadCV}:
                        {data ? <PDFDownloadLink document={<CV profileImage={`${settings.API_URL}/${data?.profileImage}`}
                                                               fullName={`${data.firstName} ${data.lastName}`}
                                                               categories={data.categories}
                                                               email={data.email}
                                                               birthday={getDate(data?.birthdayDay, data?.birthdayMonth, data?.birthdayYear)}
                                                               schools={data.schools}
                                                               jobs={data.jobs}
                                                               additionalLanguages={data.extraLanguages}
                                                               languages={data.languages}
                                                               drivingLicence={data.drivingLicenceCategories}
                                                               certs={data.certificates.concat(data.courses)}
                                                               desc={data.situationDescription}
                                                               phoneNumber={data.phoneNumber ? `${data.phoneNumberCountry} ${data.phoneNumber}` : c.noInfo}
                                                               location={data.country >= 0 ? `${data.city}, ${JSON.parse(c.countries)[data.country]}` : c.noInfo}
                                                               currentPlace={data.currentCountry >= 0 ? `${JSON.parse(c.countries)[data.currentCountry]}, ${data.currentCity}`: c.noInfo}
                                                               availability={data.availabilityDay >= 0 ? getDate(data?.availabilityDay, data?.availabilityMonth, data?.availabilityYear) : c.noInfo}
                                                               ownAccommodation={data.ownAccommodation ? data.accommodationPlace : ''}
                                                               ownTools={data.ownTools ? c.yes : ''}
                                                               salary={data.salaryFrom && data.salaryTo ? `${data.salaryFrom} - ${data.salaryTo} ${data.salaryCurrency} ${c.netto}/${data.salaryType === 0 ? c.monthlyShortcut : c.weeklyShortcut}` : c.noInfo}
                        />}
                                                 fileName={`CV-${data.firstName}_${data.lastName}.pdf`}
                                                 className="btn btn--downloadCV">
                            <img className="img" src={downloadWhite} alt="pobierz" />
                            {c.downloadCV}
                        </PDFDownloadLink> : ''}
                    </label>

                    <div className="userAccount__box__right__bottom">
                        <div className="userAccount__box__right__item">
                            <Tooltip
                                html={<span className="tooltipVisible">
                                    {c.userTooltip1}
                                </span>}
                                position="left"
                            >
                                <span className="tooltip">
                                    ?
                                </span>
                            </Tooltip>

                            {c.profileVisibility}:
                            <Switch onChange={() => { changeProfileVisibility(); }}
                                    offColor="#CB4949"
                                    width={window.innerWidth > 996 ? 44 : 22}
                                    height={window.innerWidth > 996 ? 24 : 12}
                                    checked={profileVisible} />
                        </div>
                        <div className="userAccount__box__right__item">
                            <Tooltip
                                html={<span className="tooltipVisible">
                                    {c.userTooltip2}
                                </span>}
                                position="left">
                                <span className="tooltip">
                                    ?
                                </span>
                            </Tooltip>

                            {c.workingButOpen}
                            <Switch onChange={() => { changeProfileWorking(); }}
                                    offColor="#CB4949"
                                    width={window.innerWidth > 996 ? 44 : 22}
                                    height={window.innerWidth > 996 ? 24 : 12}
                                    checked={userWorking} />
                        </div>
                    </div>
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
                            {data?.firstName} {data?.lastName}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.phoneNumberShortcut}
                        </span>
                        <p className="userAccount__box__value">
                            {data?.phoneNumberCountry} {data?.phoneNumber}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.birthday}
                        </span>
                        <p className="userAccount__box__value">
                            {getDate(data?.birthdayDay, data?.birthdayMonth, data?.birthdayYear)}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.email}
                        </span>
                        <p className="userAccount__box__value">
                            {data?.email}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.livingAddress}
                        </span>
                        <p className="userAccount__box__value">
                            {data?.city}, {data?.address}<br/>
                            {c.country}: {JSON.parse(c.countries)[data?.country]}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--30 noscroll">
                <h3 className="userAccount__box__header">
                    {c.finishedSchools}
                </h3>
                {data?.schools?.map((item, index) => {
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
                {data?.jobs?.map((item, index) => {
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
                })}
            </div>

            {/* THIRD LINE */}
            <div className="userAccount__box userAccount__box--20">
                <h3 className="userAccount__box__header">
                    {c.skills}
                </h3>
                {data?.languages?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        {c.foreignLanguages.charAt(0).toUpperCase() + c.foreignLanguages.slice(1)}
                    </h4>
                    <div className="flex flex--start">
                        {data.languages?.map((item, index) => {
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

                {data?.drivingLicenceCategories?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        {c.drivingLicence.charAt(0).toUpperCase() + c.drivingLicence.slice(1)}
                    </h4>
                    <div className="flex flex--start">
                        {data?.drivingLicenceCategories?.map((item, index) => {
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
                {data?.courses?.map((item, index) => {
                    return <div className="userAccount__course" key={index}>
                        <img className="img" src={starIcon} alt="gwiazdka" />
                        {item}
                    </div>
                })}

                {data?.certificates?.map((item, index) => {
                    return <div className="userAccount__course" key={index}>
                        <img className="img" src={starIcon} alt="gwiazdka" />
                        {item}
                    </div>
                })}
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
                            {data?.currentCity}, {JSON.parse(c.countries)[data?.currentCountry]}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.availability}
                        </span>
                        <p className="userAccount__box__value">
                            {c.from} {getDate(data?.availabilityDay, data?.availabilityMonth, data?.availabilityYear)}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.ownTransport}
                        </span>
                        <p className="userAccount__box__value">
                            {data?.ownTransport ? c.yes : c.no}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.bsnNumber}
                        </span>
                        <p className="userAccount__box__value">
                            {data?.hasBsnNumber ? data?.bsnNumber : '-'}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.longTermJob}
                        </span>
                        <p className="userAccount__box__value">
                            {data?.longTermJobSeeker ? 'Tak' : 'Nie'}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            {c.ownAccommodation}
                        </span>
                        <p className="userAccount__box__value">
                            {data?.ownAccommodation ? data?.accommodationPlace : c.no}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--10">
                <h3 className="userAccount__box__header">
                    {c.attachments}
                </h3>
                {data?.attachments?.map((item, index) => {
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
    </div>
};

export default UserHomepage;
