import React, {useContext, useEffect, useState} from 'react';
import {deleteOffer, getOfferById} from "../helpers/offer";
import settings from "../static/settings";
import Loader from "../components/Loader";
import infoIcon from '../static/img/info-icon.svg'
import locationIcon from '../static/img/location.svg'
import salaryIcon from '../static/img/dolar-icon.svg'
import agreementIcon from '../static/img/agreement-icon.svg'
import calendarIcon from '../static/img/calendar-icon.svg'
import { currencies } from "../static/content";
import resIcon from '../static/img/responsibilities-icon.svg'
import benIcon from '../static/img/benefit-icon.svg'
import downloadIcon from '../static/img/download-white.svg'
import Gallery from "../components/Gallery";
import magnifier from '../static/img/magnifier.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'
import {LanguageContext} from "../App";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import PanelMenu from "../components/PanelMenu";
import Modal from "../components/Modal";

const AdminJobOffer = () => {
    const [offer, setOffer] = useState({});
    const [galleryIndex, setGalleryIndex] = useState(-1);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteSuccess, setDeleteSuccess] = useState(0);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if(id) {
            getOfferById(id)
                .then(async (res) => {
                    console.log(res);
                   if(res?.status === 200) {
                       if(res?.data?.length) {
                           setOffer(Array.isArray(res.data) ? res.data[0] : res.data);
                       }
                       else {
                           window.location = '/panel';
                       }
                   }
                   else {
                       window.location = '/panel';
                   }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
        else {
            window.location = '/panel';
        }
    }, []);

    const deleteOfferById = async () => {
        const res = await deleteOffer(deleteCandidate, true);
        if(res?.status === 201) {
            setDeleteSuccess(1);
        }
        else {
            setDeleteSuccess(-1);
        }
    }

    useEffect(() => {
        setDeleteSuccess(0);
    }, [deleteCandidate]);

    return offer?.o_id ? <div className="container">
            <LoggedAdminHeader />

            {galleryIndex !== -1 ? <Gallery images={offer.a_data ? JSON.parse(offer.a_data).gallery : offer}
                                            setIndex={setGalleryIndex}
                                            index={galleryIndex} /> : ''}

            {deleteCandidate ? <Modal header="Czy na pewno chcesz usunąć tę ofertę?"
                                      modalAction={deleteOfferById}
                                      success={deleteSuccess === 1}
                                      closeModal={() => { setDeleteCandidate(0); }}
                                      message={deleteSuccess ? "Oferta została usunięta" : ''}
            /> : ''}

            <main className="adminMain adminMain--offer">
                <PanelMenu menuOpen={3} />
                <div className="adminMain__main">

                    <div className="flex">
                        <h1 className="adminMain__header">
                            Szczegóły oferty pracy
                        </h1>
                        <div className="userDetails__actions">
                            <div className="preview__buttons preview__buttons--admin flex flex--end">
                                <div className="preview__col">
                            <span className="preview__col__key">
                                Usuwanie oferty
                            </span>
                                    <button className="btn btn--block"
                                                        onClick={() => { setDeleteCandidate(offer.o_id); }}>
                                        Usuń ofertę
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="jobOffer">
                        <figure className="jobOffer__backgroundImg">
                            <img className="img" src={`${settings.API_URL}/${offer.o_image}`} alt="oferta-pracy" />
                        </figure>

                        <div className="jobOffer__mobileSection">
                            <div className="jobOffer__topRow flex">
                                <figure className="jobOffer__profileImageWrapper">
                                    <img className="img" src={offer.a_id && JSON.parse(offer.a_data).logo ? `${settings.API_URL}/${JSON.parse(offer.a_data).logo}` : userPlaceholder} alt="logo" />
                                </figure>
                                <div className="jobOffer__topRow__content">
                                    <h1 className="jobOffer__title">
                                        {offer.o_title}
                                    </h1>
                                    <h2 className="jobOffer__company">
                                        {offer.a_id ? JSON.parse(offer.a_data).name : ''}
                                    </h2>
                                </div>
                                <div className="jobOffer__topRow__right">
                    <span className="jobOffer__sideInfo">
                        {c.added}: {offer.o_created_at?.substring(0, 10)}, {c.offerId}: {offer.o_id}
                    </span>
                                </div>
                            </div>

                            <div className="jobOffer__mobileCategoryWrapper">
                        <span className="jobOffer__mobileCategory">
                            {offer.o_category !== null ? JSON.parse(c.categories)[offer.o_category] : ''}
                        </span>
                            </div>

                            <div className="jobOffer__pointsRow flex">
                        <span className="jobOffer__point flex">
                            <img className="img" src={infoIcon} alt="branża" />
                            {offer.o_category !== null ? JSON.parse(c.categories)[offer.o_category] : ''}
                        </span>
                                <span className="jobOffer__point jobOffer__point--location flex">
                            <img className="img" src={locationIcon} alt="branża" />
                                    {offer.o_category !== null ? offer.o_city + ', ' + JSON.parse(c.countries)[offer.o_country] : ''}
                        </span>
                                <span className="jobOffer__point flex">
                            <img className="img" src={salaryIcon} alt="branża" />
                                    {offer.o_category !== null ? `${offer.o_salaryFrom} - ${offer.o_salaryTo} ${currencies[offer.o_salaryCurrency]}` : ''}
                                    <span className="distance">
                                {offer.o_category !== null ? `${c.netto}/${offer.o_salary_type === 1 ? c.weeklyShortcut : c.monthlyShortcut}` : ''}
                            </span>
                        </span>
                                <span className="jobOffer__point flex">
                            <img className="img" src={agreementIcon} alt="branża" />
                                    {offer.o_category !== null ? JSON.parse(c.contracts)[offer.o_contractType] : ''}
                        </span>
                                <span className="jobOffer__point jobOffer__point--time flex">
                            <img className="img" src={calendarIcon} alt="branża" />
                                    {c.actualOffer}
                                    <span className="distance">
                                {offer.o_category !== null ? (offer.o_timeBounded ? '' : c.noTimeBounded) : ''}
                            </span>
                        </span>
                            </div>
                        </div>

                        <div className="jobOffer__section">
                            <h3 className="jobOffer__section__header">
                                {c.offerAndPostDescription}
                            </h3>
                            <div className="jobOffer__section__text">
                                {offer.o_description}
                            </div>
                        </div>
                        <div className="jobOffer__section">
                            <h3 className="jobOffer__section__header">
                                {c.responsibilities}
                            </h3>
                            <div className="jobOffer__section__text flex">
                                {offer.o_responsibilities ? JSON.parse(offer.o_responsibilities)?.map((item, index) => {
                                    return <span key={index}>
                                <img className="icon" src={resIcon} alt="obowiązki" />
                                        {item}
                            </span>
                                }) : ''}
                            </div>
                        </div>

                        <div className="jobOffer__section">
                            <h3 className="jobOffer__section__header">
                                {c.requirements}
                            </h3>
                            <div className="jobOffer__section__text flex">
                                {offer.o_requirements ? JSON.parse(offer.o_requirements)?.map((item, index) => {
                                    return <span key={index} className="grey">
                                {item}
                            </span>
                                }) : ''}
                            </div>
                        </div>

                        <div className="jobOffer__section">
                            <h3 className="jobOffer__section__header">
                                {c.weOffer}
                            </h3>
                            <div className="jobOffer__section__text flex">
                                {offer.o_benefits ? JSON.parse(offer.o_benefits)?.map((item, index) => {
                                    return <span key={index}>
                                <img className="icon" src={benIcon} alt="obowiązki" />
                                        {item}
                            </span>
                                }) : ''}
                            </div>
                        </div>

                        <div className="jobOffer__section">
                            <h3 className="jobOffer__section__header">
                                {c.aboutCompany}
                            </h3>
                            <div className="jobOffer__section__text">
                                {offer.a_data ? JSON.parse(offer.a_data).description : ''}
                            </div>
                        </div>

                        <div className="jobOffer__section">
                            <h3 className="jobOffer__section__header">
                                {c.gallery}
                            </h3>
                            <div className="jobOffer__section__gallery flex">
                                {offer.a_data ? JSON.parse(offer.a_data).gallery?.map((item, index) => {
                                    return <button className="jobOffer__section__gallery__item gallery__item" key={index}
                                                   onClick={() => { setGalleryIndex(index); }}>
                                <span className="overlay">
                                    <img className="img" src={magnifier} alt="powiększ" />
                                </span>
                                        <img className="img" src={`${settings.API_URL}/${item}`} alt="galeria" />
                                    </button>
                                }) : ''}
                            </div>
                        </div>

                        {offer?.o_attachments?.length ? <div className="jobOffer__section">
                            <h3 className="jobOffer__section__header">
                                {c.additionalInfo}
                            </h3>
                            <div className="jobOffer__section__text jobOffer__section__text--attachments">
                                {offer.a_data ? JSON.parse(offer.o_attachments)?.map((item, index) => {
                                    if(item.path) {
                                        return <a href={`${settings.API_URL}/${item.path}`}
                                                  target="_blank"
                                                  download={`${item.path.replace(`-${item.path.split('-')?.slice(-1)[0]}`, '')}.${item.path.split('.').slice(-1)[0]}`.split('\\').slice(-1)[0]}
                                                  key={index}
                                                  className="jobOffer__attachmentBtn">
                                            <img className="img" src={downloadIcon} alt="pobierz" />
                                            {item.name ? item.name : index+1}
                                        </a>
                                    }
                                }) : ''}
                            </div>
                        </div> : ''}
                    </div>
                </div>
            </main>
    </div> : <div className="container container--loader center">
            <Loader />
        </div>
};

export default AdminJobOffer;
