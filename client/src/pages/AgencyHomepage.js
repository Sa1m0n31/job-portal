import React, {useEffect, useRef, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import penIcon from "../static/img/pen-edit-account.svg";
import settingsCircle from "../static/img/settings-circle.svg";
import {
    currencies,
    houses, months, paycheckDay, paycheckFrequency,
    paymentTypes,
    pensionFrequency,
    pensionType,
    rooms
} from "../static/content";
import settings from "../static/settings";
import locationIcon from "../static/img/location.svg";
import suitcaseIcon from "../static/img/suitcase-grey.svg";
import phoneIcon from "../static/img/phone-grey.svg";
import messageIcon from "../static/img/message-grey.svg";
import whatsAppIcon from "../static/img/whatsapp.svg";
import websiteIcon from '../static/img/www-icon.svg'
import fbIcon from '../static/img/facebook-icon.svg'
import instagramIcon from '../static/img/instagram-icon.svg'
import ytIcon from '../static/img/youtube-icon.svg'
import linkedinIcon from '../static/img/linedin-icon.svg'
import galleryArrow from '../static/img/gallery-arrow.svg'
import { noInfo } from "../static/content";
import magnifierIcon from '../static/img/magnifier.svg'
import Gallery from "../components/Gallery";
import userPlaceholder from '../static/img/user-placeholder.svg'

const AgencyHomepage = ({data, email}) => {
    const [currentGalleryScroll, setCurrentGalleryScroll] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(-1);

    useEffect(() => {
        if(gallery) {
            gallery.current?.scroll({
                left: currentGalleryScroll,
                behavior: 'smooth'
            });
        }
    }, [currentGalleryScroll]);

    const resizeFirstLineHeight = () => {
        let maxHeight = 0;
        const firstLine = Array.from(document.querySelectorAll('.flex--firstLine>*'));
        for(const box of firstLine) {
            const h = parseInt(getComputedStyle(box).getPropertyValue('height').split(' ')[0]);
            if(h > maxHeight) maxHeight = h;
        }

        firstLine.forEach((item) => {
            item.style.height = `${maxHeight}px`;
        });
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            const firstLine = Array.from(document.querySelectorAll('.flex--firstLine>*'));
            firstLine.forEach((item) => {
                item.style.height = 'auto';
            });
        });
    }, []);

    useEffect(() => {
        if(window.innerWidth >= 996) {
            setTimeout(() => {
                resizeFirstLineHeight();
            }, 500);
        }
    }, [data]);

    const gallery = useRef(null);

    const galleryScroll = (n) => {
        setCurrentGalleryScroll(prevState => (Math.max(0, prevState+n)));
    }

    const enlargeGallery = (n) => {
        setGalleryIndex(n);
    }

    return <div className="container container--agency">
        <LoggedUserHeader data={data} agency={true} />

        {galleryIndex !== -1 ? <Gallery images={data.gallery}
                                        setIndex={setGalleryIndex}
                                        index={galleryIndex} /> : ''}

        <div className="userAccount">
            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracodawcy</span>
                </span>
                <a href="/edycja-danych-agencji"
                   className="userAccount__top__btn">
                    Edytuj profil
                    <img className="img" src={penIcon} alt="edytuj" />
                </a>
            </aside>
            <div className="flex flex--firstLine">
                <main className="userAccount__box userAccount__box--30 flex">
                    <div className="userAccount__box__left">
                        <a href="/edycja-danych-agencji" className="mobileSettingsBtn">
                            <img className="img" src={settingsCircle} alt="ustawienia" />
                        </a>
                        <figure>
                            <img className="img" src={data?.logo ? `${settings.API_URL}/${data?.logo}` : userPlaceholder} alt="zdjecie-profilowe" />
                        </figure>
                        <div className="userAccount__box__mainData">
                            <h1 className="userAccount__box__fullName">
                                {data.name}
                            </h1>
                            {data.city ? <p className="userAccount__box__mainData__text">
                                <img className="img" src={locationIcon} alt="lokalizacja" />
                                {data.city}
                            </p> : ''}
                            {data.nip ? <p className="userAccount__box__mainData__text">
                                <img className="img" src={suitcaseIcon} alt="branża" />
                                NIP: {data.nip}
                            </p> : ''}
                            {data.phoneNumber ? <p className="userAccount__box__mainData__text">
                                <img className="img" src={phoneIcon} alt="numer-telefonu" />
                                {data.phoneNumberCountry} {data.phoneNumber}
                            </p> : ''}
                            <p className="userAccount__box__mainData__text">
                                <img className="img" src={messageIcon} alt="adres-e-mail" />
                                {email}
                            </p>
                            <div className="userAccount__box__mainData__buttons">
                                {data?.phoneNumber ? <a
                                    href={`https://wa.me/${data.phoneNumberCountry.split('+')[1]}${data.phoneNumber}`}
                                    className="btn btn--whatsApp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img className="img" src={whatsAppIcon} alt="napisz-wiadomosc" />
                                    WhatsApp
                                </a> : ''}
                                <a href="/napisz-wiadomosc"
                                   className="btn btn--writeMessage">
                                    <img className="img" src={messageIcon} alt="napisz-wiadomosc" />
                                    Wiadomość
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
                <div className="userAccount__box userAccount__box--40">
                    <h3 className="userAccount__box__header">
                        Dlaczego warto nas wybrać
                    </h3>
                    <div className="userAccount__box__text"
                        dangerouslySetInnerHTML={{__html: data.benefits}}
                    >

                    </div>
                </div>
                <div className="userAccount__box userAccount__box--20">
                    <h3 className="userAccount__box__header">
                        Social media
                    </h3>
                    {data.facebook ?
                        <a className="agencyAccount__socialMediaItem"
                           target="_blank"
                           rel="noreferrer"
                           href={data.facebook}
                        >
                            <img className="img" src={fbIcon} alt="facebook" />
                            Facebook
                        </a> : ''}
                    {data.instagram ?
                        <a className="agencyAccount__socialMediaItem"
                           target="_blank"
                           rel="noreferrer"
                           href={data.instagram}
                        >
                            <img className="img" src={instagramIcon} alt="instagram" />
                            Instagram
                        </a> : ''}
                    {data.youtube ?
                        <a className="agencyAccount__socialMediaItem"
                           target="_blank"
                           rel="noreferrer"
                           href={data.youtube}
                        >
                            <img className="img" src={ytIcon} alt="youtube" />
                            Youtube
                        </a> : ''}
                    {data.linkedin ?
                        <a className="agencyAccount__socialMediaItem"
                           target="_blank"
                           rel="noreferrer"
                           href={data.linkedin}
                        >
                            <img className="img" src={linkedinIcon} alt="linkedin" />
                            LinkedIn
                        </a> : ''}
                    {data.website ?
                        <a className="agencyAccount__socialMediaItem"
                           target="_blank"
                           rel="noreferrer"
                           href={data.website}
                        >
                            <img className="img" src={websiteIcon} alt="strona-internetowa" />
                            Strona www
                        </a> : ''}
                </div>
            </div>
            <div className="container--agency__grid">
                <div className="flex">
                    <div className="userAccount__box">
                        <h3 className="userAccount__box__header">
                            O firmie
                        </h3>
                        <div className="userAccount__box__text"
                             dangerouslySetInnerHTML={{__html: data.description}}>

                        </div>
                    </div>
                    <div className="userAccount__box">
                        <h3 className="userAccount__box__header">
                            O procesie rekrutacji
                        </h3>
                        <div className="userAccount__box__text"
                             dangerouslySetInnerHTML={{__html: data.recruitmentProcess}}>

                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="userAccount__box userAccount__box--100">
                        <h3 className="userAccount__box__header">
                            Warunki i informacje dla pracowników
                        </h3>
                        <div className="userAccount__box__pairsWrapper userAccount__box--employeesInfo">
                        <span className="w-100">
                            Zakwaterowanie
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Typ pokoju
                            </span>
                            <p className="userAccount__box__value">
                                {data.roomType !== null && data.roomType !== undefined ? rooms[data.roomType] : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Rodzaj zabudowy
                            </span>
                            <p className="userAccount__box__value">
                                {data.houseType !== null && data.houseType !== undefined ? houses[data.houseType] : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Wyposażenie
                            </span>
                            <p className="userAccount__box__value">
                                {data.roomDescription ? data.roomDescription : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Parking
                            </span>
                            <p className="userAccount__box__value">
                                {data.parking !== null && data.parking !== undefined ? (data.parking ? 'Tak' : 'Nie') : noInfo}
                            </p>
                        </span>
                            <span className="w-100">
                            Pojazd służbowy i dojazdy do pracy
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Samochód służbowy
                            </span>
                            <p className="userAccount__box__value">
                                {data.car === 0 || data.car ?
                                    (data.car === 1 ? 'Bezpłatny' : (`Płatny dodatkowo,\n${data.carPrice} ${currencies[data.carPriceCurrency]}/mies`)) : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Rower
                            </span>
                            <p className="userAccount__box__value">
                                {data.bike === 0 || data.bike ?
                                    (data.bike === 1 ? 'Bezpłatny' : (`Płatny dodatkowo,\n${data.bikePrice} ${currencies[data.bikePriceCurrency]}/mies`)) : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Zwrot kosztów za dojazd
                            </span>
                            <p className="userAccount__box__value">
                                {data.costReturnWithOwnTransport !== null && data.costReturnWithOwnTransport !== undefined ?
                                    (data.costReturnWithOwnTransport ? 'Tak' : 'Nie') : noInfo}
                            </p>
                        </span>

                        <span className="w-100">
                            Składki, ulgi i opłaty
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Składki emerytalne
                            </span>
                            <p className="userAccount__box__value">
                                {data.pensionContributions !== null && data.pensionContributions !== undefined ? pensionType[data.pensionContributions] : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Świadczenia urlopowe
                            </span>
                            <p className="userAccount__box__value userAccount__box__value--holidayAllowance">
                                {data.holidayAllowanceType !== null && data.holidayAllowanceType !== undefined ? `${pensionType[data.holidayAllowanceType]}
                                `: noInfo}<br/>
                                {data.holidayAllowanceType !== null && data.holidayAllowanceType !== undefined ? `${data.holidayAllowanceFrequency === 0 ? (pensionFrequency[data.holidayAllowanceFrequency] + ', ' + (parseInt(data.holidayAllowanceDay)+1) + ' ' + months[data.holidayAllowanceMonth]) : pensionFrequency[data.holidayAllowanceFrequency]}` : ''}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Wynagrodzenie
                            </span>
                            <p className="userAccount__box__value">
                                {data.paycheckFrequency !== null && data.paycheckFrequency !== undefined ? paycheckFrequency[data.paycheckFrequency] : noInfo}<br/>
                                {data.paycheckFrequency !== null && data.paycheckFrequency !== undefined ? paycheckDay[data.paycheckDay] : ''}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                Ubezp. zdrowotne
                            </span>
                            <p className="userAccount__box__value">
                                {data.healthInsurance !== null && data.healthInsurance !== undefined ? paymentTypes[data.healthInsurance] : noInfo}<br/>
                                {data.healthInsuranceCost !== null && data.healthInsurance === 0 ? data.healthInsuranceCost + ' ' + currencies[data.healthInsuranceCurrency] : ''}
                            </p>
                        </span>
                        </div>
                    </div>

                    <div className="userAccount__box userAccount__box--100">
                        <h3 className="userAccount__box__header">
                            Benefity - co zyskasz?
                        </h3>
                        <div className="userAccount__box__text"
                             dangerouslySetInnerHTML={{__html: data.benefits}}
                        >

                        </div>
                    </div>

                    {data?.gallery?.length ? <div className="userAccount__box userAccount__box--100">
                        <h3 className="userAccount__box__header">
                            Galeria zdjęć
                        </h3>
                        <div className="flex flex--gallery">
                            {currentGalleryScroll ? <button className="userAccount__box__gallery__arrow userAccount__box__gallery__arrow--prev"
                                                            onClick={() => { galleryScroll(-200); }}>
                                <img className="img" src={galleryArrow} alt="przesun" />
                            </button> : ''}
                            <div ref={gallery} className="userAccount__box__gallery noscroll flex">
                                {data.gallery?.map((item, index) => {
                                    return <button className="gallery__item"
                                                   key={index}
                                                   onClick={() => { enlargeGallery(index); }}>
                                        <span className="overlay">
                                            <img className="img" src={magnifierIcon} alt="powieksz" />
                                        </span>
                                        <img className="img" src={`${settings.API_URL}/${item}`} alt="galeria-zdjęć" />
                                    </button>
                                })}
                            </div>
                            <button className="userAccount__box__gallery__arrow"
                                    onClick={() => { galleryScroll(200); }}>
                                <img className="img" src={galleryArrow} alt="przesun" />
                            </button>
                        </div>
                    </div> : ''}
                </div>
            </div>
        </div>
    </div>
};

export default AgencyHomepage;
