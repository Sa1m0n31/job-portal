import React, {useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {categories, countries, drivingLicences, flags, languages, noInfo} from "../static/content";
import settings from "../static/settings";
import locationIcon from "../static/img/location.svg";
import suitcaseIcon from "../static/img/suitcase-grey.svg";
import phoneIcon from "../static/img/phone-grey.svg";
import messageIcon from "../static/img/message-grey.svg";
import whatsAppIcon from "../static/img/whatsapp.svg";
import downloadWhite from "../static/img/download-white.svg";
import backIcon from '../static/img/back-arrow-grey.svg'
import {getDate, getLoggedUserEmail} from "../helpers/others";
import graduateIcon from "../static/img/students-cap.svg";
import suitcaseBlue from "../static/img/suitcase-blue.svg";
import checkIcon from "../static/img/check-small.svg";
import starIcon from "../static/img/star.svg";
import fileIcon from "../static/img/file-icon.svg";
import downloadIcon from "../static/img/download-grey.svg";
import {getUserById} from "../helpers/user";
import Loader from "../components/Loader";
import userPlaceholder from '../static/img/user-placeholder.svg'
import {PDFDownloadLink} from "@react-pdf/renderer";
import CV from "../components/CV";

const CandidateProfile = ({data}) => {
    const [user, setUser] = useState(null);
    const [id, setId] = useState(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if(id) {
            setId(parseInt(id));
            getUserById(id)
                .then((res) => {
                    console.log(res);
                    if(res?.status === 200) {
                        setEmail(res?.data?.email);
                        setUser(JSON.parse(res?.data?.data));
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
    }, [user]);

    return user ? <div className="container container--user container--userProfile">
        <LoggedUserHeader data={data} agency={true} />

        <div className="userAccount">
            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracodawcy</span>
                </span>
                <a href="javascript: history.go(-1)"
                   className="userAccount__top__btn">
                    <img className="img" src={backIcon} alt="edytuj" />
                    Powrót
                </a>
            </aside>
            <main className="userAccount__box userAccount__box__top userAccount__box--100 flex">
                <div className="userAccount__box__left">
                    <figure>
                        {user?.country ? <img className="flag flag--mobile" src={flags[user?.country]} alt="flaga" /> : ''}
                        <img className="img" src={user?.profileImage ? `${settings.API_URL}/${user?.profileImage}` : userPlaceholder} alt="zdjecie-profilowe" />
                    </figure>
                    <div className="userAccount__box__mainData">
                        <h1 className="userAccount__box__fullName">
                            {user?.firstName ? `${user.firstName} ${user?.lastName}` : 'Anonimowy'}
                            {user?.country ? <img className="flag" src={flags[user?.country]} alt="flaga" /> : ''}
                        </h1>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={locationIcon} alt="lokalizacja" />
                            {user?.city ? user?.city : noInfo}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={suitcaseIcon} alt="branża" />
                            {user?.categories ? categories[user?.categories[0]] : noInfo}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={phoneIcon} alt="numer-telefonu" />
                            {user?.phoneNumber ? `${user?.phoneNumberCountry} ${user?.phoneNumber}` : noInfo}
                        </p>
                        <p className="userAccount__box__mainData__text">
                            <img className="img" src={messageIcon} alt="adres-e-mail" />
                            {email}
                        </p>
                        <div className="userAccount__box__mainData__buttons">
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
                                Wiadomość
                            </a>
                        </div>
                    </div>
                </div>

                <div className="userAccount__box__right">
                    <label className="userAccount__box__downloadCV">
                        Wygeneruj i pobierz CV:
                        {user ? <PDFDownloadLink document={<CV profileImage={user.profileImage ? `${settings.API_URL}/${user?.profileImage}` : userPlaceholder}
                                                               companyLogo={`${settings.API_URL}/${data.logo}`}
                                                               companyName={data.name}
                                                               fullName={`${user.firstName} ${user.lastName}`}
                                                               categories={user.categories}
                                                               email={user.email}
                                                               birthday={getDate(user?.birthdayDay, user?.birthdayMonth, user?.birthdayYear)}
                                                               schools={user.schools}
                                                               jobs={user.jobs}
                                                               additionalLanguages={user.extraLanguages}
                                                               languages={user.languages}
                                                               drivingLicence={user.drivingLicenceCategories}
                                                               certs={user.certificates.concat(user.courses)}
                                                               desc={user.situationDescription}
                                                               phoneNumber={user.phoneNumber ? `${user.phoneNumberCountry} ${user.phoneNumber}` : noInfo}
                                                               location={user.country >= 0 ? `${user.city}, ${countries[user.country]}` : noInfo}
                                                               currentPlace={user.currentCountry >= 0 ? `${countries[user.currentCountry]}, ${user.currentCity}`: noInfo}
                                                               availability={user.availabilityDay >= 0 ? getDate(user?.availabilityDay, user?.availabilityMonth, user?.availabilityYear) : noInfo}
                                                               ownAccommodation={user.ownAccommodation ? user.accommodationPlace : ''}
                                                               ownTools={user.ownTools ? 'Tak' : ''}
                                                               salary={user.salaryFrom && user.salaryTo ? `${user.salaryFrom} - ${user.salaryTo} ${user.salaryCurrency} netto/${user.salaryType === 0 ? 'mies.' : 'tyg.'}` : noInfo}
                        />}
                                                 fileName={`CV-${user.firstName}_${user.lastName}.pdf`}
                                                 className="btn btn--downloadCV">
                            <img className="img" src={downloadWhite} alt="pobierz" />
                            Pobierz CV
                        </PDFDownloadLink> : ''}
                    </label>
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
                            {user?.firstName ? `${user.firstName} ${user?.lastName}` : 'Anonimowy'}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Nr tel.
                        </span>
                        <p className="userAccount__box__value">
                            {user?.phoneNumber ? `${user?.phoneNumberCountry} ${user?.phoneNumber}` : noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Data urodzenia
                        </span>
                        <p className="userAccount__box__value">
                            {user?.birthdayDay >= 0 ? getDate(user?.birthdayDay, user?.birthdayMonth, user?.birthdayYear) : noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Adres e-mail
                        </span>
                        <p className="userAccount__box__value">
                            {email}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Adres zamieszkania
                        </span>
                        <p className="userAccount__box__value">
                            {user?.city ? <span>
                                {user?.city}, {user?.address}<br/>
                                kraj: {countries[user?.country]}
                            </span> : noInfo}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--30 noscroll">
                <h3 className="userAccount__box__header">
                    Ukończone szkoły
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
                {user?.jobs?.map((item, index) => {
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
                {user?.languages?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        Języki obce
                    </h4>
                    <div className="flex flex--start">
                        {user.languages?.map((item, index) => {
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

                {user?.drivingLicenceCategories?.length ? <>
                    <h4 className="userAccount__box__subheader">
                        Prawo jazdy
                    </h4>
                    <div className="flex flex--start">
                        {user?.drivingLicenceCategories?.map((item, index) => {
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
                {user?.courses?.map((item, index) => {
                    return <div className="userAccount__course" key={index}>
                        <img className="img" src={starIcon} alt="gwiazdka" />
                        {item}
                    </div>
                })}

                {user?.certificates?.map((item, index) => {
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
                            {user?.currentCity ? `${user?.currentCity}, ${countries[user?.currentCountry]}` : noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Dyspozycyjność
                        </span>
                        <p className="userAccount__box__value">
                            {user?.availabilityYear ? `od ${getDate(user?.availabilityDay, user?.availabilityMonth, user?.availabilityYear)}` : noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Własny śr. transportu
                        </span>
                        <p className="userAccount__box__value">
                            {user?.ownTransport !== undefined ? (user?.ownTransport ? 'Tak' : 'Nie') : noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Nr BSN/SOFI
                        </span>
                        <p className="userAccount__box__value">
                            {user?.hasBsnNumber !== null && user?.hasBsnNumber !== undefined ? (user?.hasBsnNumber ? user?.bsnNumber : '-') : noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Praca na długi okres
                        </span>
                        <p className="userAccount__box__value">
                            {user?.longTermJobSeeker !== undefined ? (user?.longTermJobSeeker ? 'Tak' : 'Nie') : noInfo}
                        </p>
                    </span>
                    <span className="userAccount__box__pair">
                        <span className="userAccount__box__key">
                            Własne zakw. w Holandii
                        </span>
                        <p className="userAccount__box__value">
                            {user?.ownAccommodation !== undefined ? (user?.ownAccommodation ? user?.accommodationPlace : 'Nie') : noInfo}
                        </p>
                    </span>
                </div>
            </div>

            <div className="userAccount__box userAccount__box--10">
                <h3 className="userAccount__box__header">
                    Załączniki
                </h3>
                {user?.attachments?.map((item, index) => {
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
    </div> : <div className="center">
        <Loader />
    </div>
};

export default CandidateProfile;
