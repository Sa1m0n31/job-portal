import React, {useContext, useEffect, useRef, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import penIcon from "../static/img/pen-edit-account.svg";
import settingsCircle from "../static/img/settings-circle.svg";
import {currencies} from "../static/content";
import settings from "../static/settings";
import locationIcon from "../static/img/location.svg";
import suitcaseIcon from "../static/img/suitcase-grey.svg";
import phoneIcon from "../static/img/phone-grey.svg";
import messageIcon from "../static/img/message-grey.svg";
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
import {LanguageContext} from "../App";

const AgencyHomepage = ({data, email}) => {
    const [currentGalleryScroll, setCurrentGalleryScroll] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(-1);

    const { c } = useContext(LanguageContext);

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
                    {c.loggedIn}: <span className="bold">{c.agencyZone}</span>
                </span>
                <a href="/edycja-danych-agencji"
                   className="userAccount__top__btn">
                    {c.editProfile}
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
                        </div>
                    </div>
                </main>
                <div className="userAccount__box userAccount__box--40">
                    <h3 className="userAccount__box__header">
                        {c.whyYouShouldChooseUs}
                    </h3>
                    <div className="userAccount__box__text"
                        dangerouslySetInnerHTML={{__html: data.benefits}}
                    >

                    </div>
                </div>
                <div className="userAccount__box userAccount__box--20">
                    <h3 className="userAccount__box__header">
                        {c.socialMediaEnglish}
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
                            {c.aboutCompany}
                        </h3>
                        <div className="userAccount__box__text"
                             dangerouslySetInnerHTML={{__html: data.description}}>

                        </div>
                    </div>
                    <div className="userAccount__box">
                        <h3 className="userAccount__box__header">
                            {c.aboutRecruitment}
                        </h3>
                        <div className="userAccount__box__text"
                             dangerouslySetInnerHTML={{__html: data.recruitmentProcess}}>

                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="userAccount__box userAccount__box--100">
                        <h3 className="userAccount__box__header">
                            {c.employeesInfo}
                        </h3>
                        <div className="userAccount__box__pairsWrapper userAccount__box--employeesInfo">
                        <span className="w-100">
                            {c.accommodation}
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.roomType}
                            </span>
                            <p className="userAccount__box__value">
                                {data.roomType !== null && data.roomType !== undefined ? JSON.parse(c.roomsTypes)[data.roomType] : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.houseType}
                            </span>
                            <p className="userAccount__box__value">
                                {data.houseType !== null && data.houseType !== undefined ? JSON.parse(c.houses)[data.houseType] : noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.equipment}
                            </span>
                            <p className="userAccount__box__value">
                                {data.roomDescription ? data.roomDescription : c.noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.parking}
                            </span>
                            <p className="userAccount__box__value">
                                {data.parking !== null && data.parking !== undefined ? (data.parking ? c.yes : c.no) : c.noInfo}
                            </p>
                        </span>
                            <span className="w-100">
                                {c.jobTransport}
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.companyCar}
                            </span>
                            <p className="userAccount__box__value">
                                {data.car === 0 || data.car ?
                                    (data.car === 1 ? JSON.parse(c.paymentTypes)[1] : (`${JSON.parse(c.paymentTypes)[0]},\n${data.carPrice} ${currencies[data.carPriceCurrency]}/${c.monthlyShortcut}`)) : c.noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.bike}
                            </span>
                            <p className="userAccount__box__value">
                                {data.bike === 0 || data.bike ?
                                    (data.bike === 1 ? JSON.parse(c.paymentTypes)[1] : (`${JSON.parse(c.paymentTypes)[0]},\n${data.bikePrice} ${currencies[data.bikePriceCurrency]}/${c.monthlyShortcut}`)) : c.noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.costReturn}
                            </span>
                            <p className="userAccount__box__value">
                                {data.costReturnWithOwnTransport !== null && data.costReturnWithOwnTransport !== undefined ?
                                    (data.costReturnWithOwnTransport ? c.yes : c.no) : c.noInfo}
                            </p>
                        </span>

                        <span className="w-100">
                            {c.additionalPayments}
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.pension}
                            </span>
                            <p className="userAccount__box__value">
                                {data.pensionContributions !== null && data.pensionContributions !== undefined ? JSON.parse(c.pensionType)[data.pensionContributions] : c.noInfo}
                            </p>
                        </span>
                            <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.holidayAllowance}
                            </span>
                            <p className="userAccount__box__value userAccount__box__value--holidayAllowance">
                                {data.holidayAllowanceType !== null && data.holidayAllowanceType !== undefined ? `${JSON.parse(c.pensionType)[data.holidayAllowanceType]}
                                `: noInfo}<br/>
                                {data.holidayAllowanceType !== null && data.holidayAllowanceType !== undefined ? `${data.holidayAllowanceFrequency === 0 ? (JSON.parse(c.pensionFrequency)[data.holidayAllowanceFrequency] + ', ' + (parseInt(data.holidayAllowanceDay)+1) + ' ' + JSON.parse(c.months)[data.holidayAllowanceMonth]) : JSON.parse(c.pensionFrequency)[data.holidayAllowanceFrequency]}` : ''}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.salary}
                            </span>
                            <p className="userAccount__box__value">
                                {data.paycheckFrequency !== null && data.paycheckFrequency !== undefined ? JSON.parse(c.paycheckFrequency)[data.paycheckFrequency] : noInfo}<br/>
                                {data.paycheckFrequency !== null && data.paycheckFrequency !== undefined ? JSON.parse(c.paycheckDay)[data.paycheckDay] : ''}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.healthInsurance}
                            </span>
                            <p className="userAccount__box__value">
                                {data.healthInsurance !== null && data.healthInsurance !== undefined ? JSON.parse(c.paymentTypes)[data.healthInsurance] : noInfo}<br/>
                                {data.healthInsuranceCost !== null && data.healthInsurance === 0 ? data.healthInsuranceCost + ' ' + currencies[data.healthInsuranceCurrency] : ''}
                            </p>
                        </span>
                        </div>
                    </div>

                    <div className="userAccount__box userAccount__box--100">
                        <h3 className="userAccount__box__header">
                            {c.benefits}
                        </h3>
                        <div className="userAccount__box__text"
                             dangerouslySetInnerHTML={{__html: data.benefits}}
                        >

                        </div>
                    </div>

                    {data?.gallery?.length ? <div className="userAccount__box userAccount__box--100">
                        <h3 className="userAccount__box__header">
                            {c.gallery}
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
