import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
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
import {categories, countries, drivingLicences, flags, languageLevels, languages, noInfo} from "../static/content";
import {getDate} from "../helpers/others";
import checkIcon from '../static/img/check-small.svg'
import starIcon from '../static/img/star.svg'
import settingsCircle from '../static/img/settings-circle.svg'
import ReactPDF, {PDFDownloadLink} from '@react-pdf/renderer';
import CV from '../components/CV'

const UserHomepage = ({data, visible, working}) => {
    const [profileVisible, setProfileVisible] = useState(visible);
    const [userWorking, setUserWorking] = useState(working);

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

    const downloadCV = () => {
        ReactDOM.render(<CV />, document.getElementById('root'));
    }

    const changeProfileVisibility = () => {
        setProfileVisible(!profileVisible);
        toggleUserVisibility();
    }

    const changeProfileWorking = () => {
        setUserWorking(!userWorking);
        toggleUserWorking();
    }

    return <div className="container container--user">
        <LoggedUserHeader data={data} />

        <div className="userAccount">
            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracownika</span>
                </span>
                <a href="/edycja-danych"
                   className="userAccount__top__btn">
                    Edytuj profil
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
                            {categories[data?.categories[0]]}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={phoneIcon} alt="numer-telefonu" />
                            {data?.phoneNumberCountry} {data?.phoneNumber}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={messageIcon} alt="adres-e-mail" />
                            {data?.email}
                        </p>
                    </div>
                </div>

                <div className="userAccount__box__right">
                    <label className="userAccount__box__downloadCV">
                        Wygeneruj i pobierz CV:
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
                                                               phoneNumber={data.phoneNumber ? `${data.phoneNumberCountry} ${data.phoneNumber}` : noInfo}
                                                               location={data.country >= 0 ? `${data.city}, ${countries[data.country]}` : noInfo}
                        />}
                                                 fileName={`CV-${data.firstName}_${data.lastName}.pdf`}
                                                 className="btn btn--downloadCV">
                            <img className="img" src={downloadWhite} alt="pobierz" />
                            Pobierz CV
                        </PDFDownloadLink> : ''}
                    </label>

                    <div className="userAccount__box__right__bottom">
                        <div className="userAccount__box__right__item">
                            <Tooltip
                                html={<span className="tooltipVisible">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam molestie ipsum metus. Nullam vitae turpis tellus. Nullam vel gravida nunc, et hendrerit dolor. Integer posuere nisl eu porta cursus.
                                </span>}
                                position="left">
                                <span className="tooltip">
                                    ?
                                </span>
                            </Tooltip>

                            Widoczność profilu:
                            <Switch onChange={() => { changeProfileVisibility(); }}
                                    offColor="#CB4949"
                                    width={window.innerWidth > 996 ? 56 : 28}
                                    height={window.innerWidth > 996 ? 28 : 14}
                                    checked={profileVisible} />
                        </div>
                        <div className="userAccount__box__right__item">
                            <Tooltip
                                html={<span className="tooltipVisible">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam molestie ipsum metus. Nullam vitae turpis tellus. Nullam vel gravida nunc, et hendrerit dolor. Integer posuere nisl eu porta cursus.
                                </span>}
                                position="left">
                                <span className="tooltip">
                                    ?
                                </span>
                            </Tooltip>

                            Pracuję, ale chcę otrzymywać oferty
                            <Switch onChange={() => { changeProfileWorking(); }}
                                    offColor="#CB4949"
                                    width={window.innerWidth > 996 ? 56 : 28}
                                    height={window.innerWidth > 996 ? 28 : 14}
                                    checked={userWorking} />
                        </div>
                    </div>
                </div>
            </main>

            <div className="userAccount__box userAccount__box--30 noscroll">
                <h3 className="userAccount__box__header">
                    Dane osobowe i kontakt
                </h3>
                <div className="userAccount__box__pairsWrapper">
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Imię i nazwisko
                        </span>
                        <p className="userAccount__box__value">
                            {data?.firstName} {data?.lastName}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Nr tel.
                        </span>
                        <p className="userAccount__box__value">
                            {data?.phoneNumberCountry} {data?.phoneNumber}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Data urodzenia
                        </span>
                        <p className="userAccount__box__value">
                            {getDate(data?.birthdayDay, data?.birthdayMonth, data?.birthdayYear)}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Adres e-mail
                        </span>
                        <p className="userAccount__box__value">
                            {data?.email}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Adres zamieszkania
                        </span>
                        <p className="userAccount__box__value">
                            {data?.city}, {data?.address}<br/>
                            kraj: {countries[data?.country]}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--30 noscroll">
                <h3 className="userAccount__box__header">
                    Ukończone szkoły
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
                                {item.from} - {item.to ? item.to : 'w trakcie'}
                            </h6>
                        </div>
                    </div>
                })}
            </div>

            <div className="userAccount__box userAccount__box--30 noscroll">
                <h3 className="userAccount__box__header">
                    Doświadczenie zawodowe
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
                                {item.from} - {item.to ? item.to : 'w trakcie'}
                            </h6>
                        </div>
                    </div>
                })}
            </div>

            {/* THIRD LINE */}
            <div className="userAccount__box userAccount__box--20">
                <h3 className="userAccount__box__header">
                    Umiejętności
                </h3>
                {data?.languages?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        Języki obce
                    </h4>
                    <div className="flex flex--start">
                        {data.languages?.map((item, index) => {
                            return <div className="userAccount__box__language" key={index}>
                                <img className="img" src={checkIcon} alt="język" />
                                {languages[item.language]}
                                <span className="lvl">
                                    {item.lvl}
                                </span>
                            </div>
                        })}
                    </div>
                </> : ''}

                {data?.drivingLicenceCategories?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        Prawo jazdy
                    </h4>
                    <div className="flex flex--start">
                        {data?.drivingLicenceCategories?.map((item, index) => {
                            return <div className="userAccount__box__language" key={index}>
                                <img className="img" src={checkIcon} alt="język" />
                                {drivingLicences[item]}
                            </div>
                        })}
                    </div>
                </> : ''}
            </div>

            <div className="userAccount__box userAccount__box--20">
                <h3 className="userAccount__box__header">
                    Ukończone kursy i szkolenia
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
                    Dodatkowe informacje
                </h3>
                <div className="userAccount__box__pairsWrapper">
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Aktualne miejsce pobytu
                        </span>
                        <p className="userAccount__box__value">
                            {data?.currentCity}, {countries[data?.currentCountry]}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Dyspozycyjność
                        </span>
                        <p className="userAccount__box__value">
                            od {getDate(data?.availabilityDay, data?.availabilityMonth, data?.availabilityYear)}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Własny śr. transportu
                        </span>
                        <p className="userAccount__box__value">
                            {data?.ownTransport ? 'Tak' : 'Nie'}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Nr BSN/SOFI
                        </span>
                        <p className="userAccount__box__value">
                            {data?.hasBsnNumber ? data?.bsnNumber : '-'}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Praca na długi okres
                        </span>
                        <p className="userAccount__box__value">
                            {data?.longTermJobSeeker ? 'Tak' : 'Nie'}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Własne zakw. w Holandii
                        </span>
                        <p className="userAccount__box__value">
                            {data?.ownAccommodation ? data?.accommodationPlace : 'Nie'}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--10">
                <h3 className="userAccount__box__header">
                    Załączniki
                </h3>
                {data?.attachments?.map((item, index) => {
                    return <a key={index}
                              href={`${settings.API_URL}/${item}`}
                              className="userAccount__box__attachment">
                        <img className="img img--fileIcon" src={fileIcon} alt="plik" />
                        <span>
                            Zał. {index+1}
                        </span>
                        <img className="img" src={downloadIcon} alt="download" />
                    </a>
                })}
            </div>
        </div>
    </div>
};

export default UserHomepage;
