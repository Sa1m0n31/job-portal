import React, {useContext, useEffect, useRef, useState} from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import {getAgencyById, getAllAgencies, getAllApprovedAgencies} from "../helpers/agency";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import AgencyPreviewAdmin from "../components/AgencyPreviewAdmin";
import Modal from "../components/Modal";
import {acceptAgency, blockAgency, unblockAgency} from "../helpers/admin";
import {currencies, formErrors} from "../static/content";
import settingsCircle from "../static/img/settings-circle.svg";
import settings from "../static/settings";
import userPlaceholder from "../static/img/user-placeholder.svg";
import locationIcon from "../static/img/location.svg";
import suitcaseIcon from "../static/img/suitcase-grey.svg";
import phoneIcon from "../static/img/phone-grey.svg";
import messageIcon from "../static/img/message-grey.svg";
import whatsAppIcon from "../static/img/whatsapp.svg";
import fbIcon from "../static/img/facebook-icon.svg";
import instagramIcon from "../static/img/instagram-icon.svg";
import ytIcon from "../static/img/youtube-icon.svg";
import linkedinIcon from "../static/img/linedin-icon.svg";
import websiteIcon from "../static/img/www-icon.svg";
import galleryArrow from "../static/img/gallery-arrow.svg";
import magnifierIcon from "../static/img/magnifier.svg";
import {LanguageContext} from "../App";
import check from "../static/img/green-check.svg";
import eyeIcon from "../static/img/eye-icon.svg";
import Gallery from "../components/Gallery";

const AdminAgencyDetails = () => {
    const [blockCandidate, setBlockCandidate] = useState(0);
    const [unblockCandidate, setUnblockCandidate] = useState(0);
    const [acceptCandidate, setAcceptCandidate] = useState(0);
    const [blockSuccess, setBlockSuccess] = useState(0);
    const [unblockSuccess, setUnblockSuccess] = useState(0);
    const [acceptSuccess, setAcceptSuccess] = useState(0);

    const [blocked, setBlocked] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [currentGalleryScroll, setCurrentGalleryScroll] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(-1);
    const [id, setId] = useState(null);
    const [email, setEmail] = useState('');
    const [agency, setAgency] = useState({});

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        const param = new URLSearchParams(window.location.search);
        const idParam = param.get('id');
        if(idParam) {
            getAgencyById(idParam)
                .then((res) => {
                    if(res?.status === 200) {
                        const r = res?.data;
                        setId(r.id)
                        setBlocked(r?.blocked);
                        setAccepted(r?.accepted);
                        setEmail(r?.email);
                        setAgency(JSON.parse(r?.data));
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

    const blockAgencyById = async () => {
        const res = await blockAgency(blockCandidate);
        if(res?.status === 201) {
            setBlockSuccess(1);
        }
        else {
            setBlockSuccess(-1);
        }
    }

    const unblockAgencyById = async () => {
        const res = await unblockAgency(unblockCandidate);
        if(res?.status === 201) {
            setUnblockSuccess(1);
        }
        else {
            setUnblockSuccess(-1);
        }
    }

    const acceptAgencyById = async () => {
        const res = await acceptAgency(acceptCandidate);
        if(res?.status === 201) {
            setAcceptSuccess(1);
        }
        else {
            setAcceptSuccess(-1);
        }
    }

    useEffect(() => {
        setBlockSuccess(0);
    }, [blockCandidate]);

    useEffect(() => {
        setUnblockSuccess(0);
    }, [unblockCandidate]);

    useEffect(() => {
        setAcceptSuccess(0);
    }, [acceptCandidate]);

    useEffect(() => {
        if(gallery) {
            gallery.current?.scroll({
                left: currentGalleryScroll,
                behavior: 'smooth'
            });
        }
    }, [currentGalleryScroll]);

    const gallery = useRef(null);

    const galleryScroll = (n) => {
        setCurrentGalleryScroll(prevState => (Math.max(0, prevState+n)));
    }

    const enlargeGallery = (n) => {
        setGalleryIndex(n);
    }

    return id ? <div className="container">
        <LoggedAdminHeader />

        {galleryIndex !== -1 ? <Gallery images={agency.gallery}
                                        setIndex={setGalleryIndex}
                                        index={galleryIndex} /> : ''}

        {blockCandidate ? <Modal header="Czy na pewno chcesz zablokować tę agencję?"
                                 modalAction={blockAgencyById}
                                 block="Zablokuj"
                                 success={blockSuccess === 1}
                                 closeModal={() => { setBlockCandidate(0); }}
                                 message={blockSuccess ? "Agencja została zablokowana" : ''}
        /> : ''}

        {unblockCandidate ? <Modal header="Czy na pewno chcesz odblokować tę agencję?"
                                   modalAction={unblockAgencyById}
                                   block="Odblokuj"
                                   closeModal={() => { setUnblockCandidate(0); }}
                                   success={unblockSuccess === 1}
                                   message={unblockSuccess ? "Agencja została odblokowana" : ''}
        /> : ''}

        {acceptCandidate ? <Modal header="Czy na pewno chcesz akceptować tę agencję?"
                                  modalAction={acceptAgencyById}
                                  block="Akceptuj"
                                  closeModal={() => { setAcceptCandidate(0); }}
                                  success={acceptSuccess === 1}
                                  message={acceptSuccess ? "Agencja została zaakceptowana" : ''}
        /> : ''}

        <main className="adminMain adminMain--agencyDetails">
            <PanelMenu menuOpen={1} />
            <div className="adminMain__main">
                <div className="flex">
                    <h1 className="adminMain__header">
                        Szczegóły agencji
                    </h1>
                    <div className="userDetails__actions">
                        <div className="preview__buttons preview__buttons--admin flex flex--end">
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

                            <div className="preview__col">
                            <span className="preview__col__key">
                                Akceptacja konta
                            </span>
                                {accepted ? <span className="btn btn--info">
                                    <img className="img" src={check} alt="tak" />
                            </span> : <button className="btn btn--accept"
                                              onClick={() => { setAcceptCandidate(id); }}>
                                    Akceptuj konto
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="agency agency--admin">
                    <div className="flex flex--firstLine">
                        <main className="userAccount__box userAccount__box--30 flex">
                            <div className="userAccount__box__left">
                                <figure>
                                    <img className="img" src={agency?.logo ? `${settings.API_URL}/${agency?.logo}` : userPlaceholder} alt="zdjecie-profilowe" />
                                </figure>
                                <div className="userAccount__box__mainData">
                                    <h1 className="userAccount__box__fullName">
                                        {agency.name}
                                    </h1>
                                    {agency.city ? <p className="userAccount__box__mainData__text">
                                        <img className="img" src={locationIcon} alt="lokalizacja" />
                                        {agency.city}
                                    </p> : ''}
                                    {agency.nip ? <p className="userAccount__box__mainData__text">
                                        <img className="img" src={suitcaseIcon} alt="branża" />
                                        NIP: {agency.nip}
                                    </p> : ''}
                                    {agency.phoneNumber ? <p className="userAccount__box__mainData__text">
                                        <img className="img" src={phoneIcon} alt="numer-telefonu" />
                                        {agency.phoneNumberCountry} {agency.phoneNumber}
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
                                 dangerouslySetInnerHTML={{__html: agency.benefits}}
                            >

                            </div>
                        </div>
                        <div className="userAccount__box userAccount__box--20">
                            <h3 className="userAccount__box__header">
                                {c.socialMediaEnglish}
                            </h3>
                            {agency.facebook ?
                                <a className="agencyAccount__socialMediaItem"
                                   target="_blank"
                                   rel="noreferrer"
                                   href={agency.facebook}
                                >
                                    <img className="img" src={fbIcon} alt="facebook" />
                                    Facebook
                                </a> : ''}
                            {agency.instagram ?
                                <a className="agencyAccount__socialMediaItem"
                                   target="_blank"
                                   rel="noreferrer"
                                   href={agency.instagram}
                                >
                                    <img className="img" src={instagramIcon} alt="instagram" />
                                    Instagram
                                </a> : ''}
                            {agency.youtube ?
                                <a className="agencyAccount__socialMediaItem"
                                   target="_blank"
                                   rel="noreferrer"
                                   href={agency.youtube}
                                >
                                    <img className="img" src={ytIcon} alt="youtube" />
                                    Youtube
                                </a> : ''}
                            {agency.linkedin ?
                                <a className="agencyAccount__socialMediaItem"
                                   target="_blank"
                                   rel="noreferrer"
                                   href={agency.linkedin}
                                >
                                    <img className="img" src={linkedinIcon} alt="linkedin" />
                                    LinkedIn
                                </a> : ''}
                            {agency.website ?
                                <a className="agencyAccount__socialMediaItem"
                                   target="_blank"
                                   rel="noreferrer"
                                   href={agency.website}
                                >
                                    <img className="img" src={websiteIcon} alt="strona-internetowa" />
                                    {c.website}
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
                                     dangerouslySetInnerHTML={{__html: agency.description}}>

                                </div>
                            </div>
                            <div className="userAccount__box">
                                <h3 className="userAccount__box__header">
                                    {c.aboutRecruitmentProcess}
                                </h3>
                                <div className="userAccount__box__text"
                                     dangerouslySetInnerHTML={{__html: agency.recruitmentProcess}}>

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
                                {agency.roomType !== null && agency.roomType !== undefined ? JSON.parse(c.roomsTypes)[agency.roomType] : c.noInfo}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.houseType}
                            </span>
                            <p className="userAccount__box__value">
                                {agency.houseType !== null && agency.houseType !== undefined ? JSON.parse(c.houses)[agency.houseType] : c.noInfo}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.equipment}
                            </span>
                            <p className="userAccount__box__value">
                                {agency.roomDescription ? agency.roomDescription : c.noInfo}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.parking}
                            </span>
                            <p className="userAccount__box__value">
                                {agency.parking !== null && agency.parking !== undefined ? (agency.parking ? c.yes : c.no) : c.noInfo}
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
                                {agency.car === 0 || agency.car ?
                                    (agency.car === 1 ? JSON.parse(c.paymentTypes)[1] : (`${JSON.parse(c.paymentTypes)[0]}\n${agency.carPrice} ${currencies[agency.carPriceCurrency]}/${c.monthlyShortcut}`)) : c.noInfo}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.bike}
                            </span>
                            <p className="userAccount__box__value">
                                {agency.bike === 0 || agency.bike ?
                                    (agency.bike === 1 ? JSON.parse(c.paymentTypes)[1] : (`${JSON.parse(c.paymentTypes)[0]}\n${agency.bikePrice} ${currencies[agency.bikePriceCurrency]}/${c.monthlyShortcut}`)) : c.noInfo}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.costReturn}
                            </span>
                            <p className="userAccount__box__value">
                                {agency.costReturnWithOwnTransport !== null && agency.costReturnWithOwnTransport !== undefined ?
                                    (agency.costReturnWithOwnTransport ? c.yes : c.no) : c.noInfo}
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
                                {agency.pensionContributions !== null && agency.pensionContributions !== undefined ? JSON.parse(c.pensionType)[agency.pensionContributions] : c.noInfo}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.holidayAllowance}
                            </span>
                            <p className="userAccount__box__value userAccount__box__value--holidayAllowance">
                                {agency.holidayAllowanceType !== null && agency.holidayAllowanceType !== undefined ? `${JSON.parse(c.pensionType)[agency.holidayAllowanceType]}
                                `: c.noInfo}<br/>
                                {agency.holidayAllowanceType !== null && agency.holidayAllowanceType !== undefined ? `${agency.holidayAllowanceFrequency === 0 ? (JSON.parse(c.pensionFrequency)[agency.holidayAllowanceFrequency] + ', ' + (parseInt(agency.holidayAllowanceDay)+1) + ' ' + JSON.parse(c.months)[agency.holidayAllowanceMonth]) : JSON.parse(c.pensionFrequency)[agency.holidayAllowanceFrequency]}` : ''}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.salary}
                            </span>
                            <p className="userAccount__box__value">
                                {agency.paycheckFrequency !== null && agency.paycheckFrequency !== undefined ? JSON.parse(c.paycheckFrequency)[agency.paycheckFrequency] : c.noInfo}<br/>
                                {agency.paycheckFrequency !== null && agency.paycheckFrequency !== undefined ? JSON.parse(c.paycheckDay)[agency.paycheckDay] : ''}
                            </p>
                        </span>
                                    <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.healthInsurance}
                            </span>
                            <p className="userAccount__box__value">
                                {agency.healthInsurance !== null && agency.healthInsurance !== undefined ? JSON.parse(c.paymentTypes)[agency.healthInsurance] : c.noInfo}<br/>
                                {agency.healthInsuranceCost !== null && agency.healthInsurance === 0 ? agency.healthInsuranceCost + ' ' + currencies[agency.healthInsuranceCurrency] : ''}
                            </p>
                        </span>
                                </div>
                            </div>

                            <div className="userAccount__box userAccount__box--100">
                                <h3 className="userAccount__box__header">
                                    {c.benefits}
                                </h3>
                                <div className="userAccount__box__text"
                                     dangerouslySetInnerHTML={{__html: agency.benefits}}
                                >

                                </div>
                            </div>

                            {agency?.gallery?.length ? <div className="userAccount__box userAccount__box--100">
                                <h3 className="userAccount__box__header">
                                    {c.gallery}
                                </h3>
                                <div className="flex flex--gallery">
                                    {currentGalleryScroll ? <button className="userAccount__box__gallery__arrow userAccount__box__gallery__arrow--prev"
                                                                    onClick={() => { galleryScroll(-200); }}>
                                        <img className="img" src={galleryArrow} alt="przesun" />
                                    </button> : ''}
                                    <div ref={gallery} className="userAccount__box__gallery noscroll flex">
                                        {agency.gallery?.map((item, index) => {
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
        </main>
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default AdminAgencyDetails;
