import React, {useEffect, useState} from 'react';
import {getFastOfferById, getOfferById} from "../helpers/offer";
import LoggedUserHeader from "../components/LoggedUserHeader";
import settings from "../static/settings";
import arrow from '../static/img/small-white-arrow.svg'
import Loader from "../components/Loader";
import infoIcon from '../static/img/info-icon.svg'
import locationIcon from '../static/img/location.svg'
import salaryIcon from '../static/img/dolar-icon.svg'
import agreementIcon from '../static/img/agreement-icon.svg'
import calendarIcon from '../static/img/calendar-icon.svg'
import {categories, contracts, countries, currencies, phoneNumbers} from "../static/content";
import resIcon from '../static/img/responsibilities-icon.svg'
import benIcon from '../static/img/benefit-icon.svg'
import downloadIcon from '../static/img/download-white.svg'
import Gallery from "../components/Gallery";
import backArrow from '../static/img/back-arrow-grey.svg'
import magnifier from '../static/img/magnifier.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'
import {addLeadingZero} from "../helpers/others";
import homeIcon from '../static/img/home-icon-blue.svg'

const SingleFastOffer = ({data}) => {
    const [offer, setOffer] = useState({});
    const [galleryIndex, setGalleryIndex] = useState(-1);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if(id) {
            getFastOfferById(id)
                .then((res) => {
                   if(res?.status === 200) {
                       setOffer(res?.data[0]);
                   }
                })
                .catch(() => {
                    window.location = '/';
                });
        }
        else {
            window.location = '/';
        }
    }, []);

    return offer?.o_id ? <div className="container container--user container--offer container--offer--fast">
            <LoggedUserHeader data={data}  />

            {galleryIndex !== -1 ? <Gallery images={offer.a_data ? JSON.parse(offer.a_data).gallery : offer}
                                        setIndex={setGalleryIndex}
                                        index={galleryIndex} /> : ''}

            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracownika</span>
                </span>
                <a href="/oferty-pracy" className="userAccount__top__btn">
                    <img className="img" src={backArrow} alt="powrót" />
                    Wróć do ofert
                </a>
            </aside>

            <a href={`/aplikuj?id=${offer.o_id}&typ=blyskawiczna`}
               className="btn btn--jobOfferApply btn--stickyMobile">
                Aplikuj
                <img className="img" src={arrow} alt="przejdź-dalej" />
            </a>

            <main className="jobOffer">
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
                        Dodano: {offer.o_created_at?.substring(0, 10)}, id ogłoszenia: {offer.o_id}
                    </span>
                            <a href={`/aplikuj?id=${offer.o_id}&typ=blyskawiczna`}
                               className="btn btn--jobOfferApply">
                                Aplikuj
                                <img className="img" src={arrow} alt="przejdź-dalej" />
                            </a>
                        </div>
                    </div>

                    <div className="jobOffer__mobileCategoryWrapper">
                        <span className="jobOffer__mobileCategory">
                            {offer.o_category !== null ? categories[offer.o_category] : ''}
                        </span>
                    </div>

                    <div className="jobOffer__pointsRow flex">
                        <span className="jobOffer__point flex">
                            <img className="img" src={infoIcon} alt="branża" />
                            {offer.o_category !== null ? categories[offer.o_category] : ''}
                        </span>
                        <span className="jobOffer__point jobOffer__point--location flex">
                            <img className="img" src={locationIcon} alt="branża" />
                                {offer.o_category !== null ? countries[offer.o_country] : ''}<br/>
                                {offer.o_category !== null ? offer.o_postalCode + ' ' +  offer.o_city + ', ' + offer.o_street : ''}
                        </span>
                        <span className="jobOffer__point flex flex-wrap">
                            <img className="img" src={homeIcon} alt="branża" />
                            <p>
                                <span>
                                    {offer.o_category !== null ? `${offer.o_accommodationPostalCode} ${offer.o_accommodationCity}, ${offer.o_accommodationStreet}` : ''}
                                </span>
                                <span>
                                    {offer.o_category !== null ? `Meldunek od: ${addLeadingZero(offer.o_accommodationDay+1)}.${addLeadingZero(offer.o_accommodationMonth+1)}.${offer.o_accommodationYear}, ${offer.o_accommodationHour}` : ''}
                                </span>
                            </p>
                        </span>
                        <span className="jobOffer__point flex">
                            <img className="img" src={salaryIcon} alt="branża" />
                                {offer.o_category !== null ? `${offer.o_salaryFrom} - ${offer.o_salaryTo} ${currencies[offer.o_salaryCurrency]}` : ''}
                                <span className="distance">
                                {offer.o_category !== null ? `netto/${offer.o_salary_type === 1 ? 'mies.' : 'tyg.'}` : ''}
                            </span>
                        </span>
                            <span className="jobOffer__point jobOffer__point--time flex">
                            <img className="img" src={calendarIcon} alt="branża" />
                            Start pracy:
                            <span className="distance">
                                {offer.o_category !== null ? `${addLeadingZero(offer.o_startDay+1)}.${addLeadingZero(offer.o_startMonth+1)}.${offer.o_startYear}, ${offer.o_startHour}` : ''}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="jobOffer__section">
                    <h3 className="jobOffer__section__header">
                        Opis oferty i stanowiska
                    </h3>
                    <div className="jobOffer__section__text">
                        {offer.o_description}
                    </div>
                </div>
                <div className="jobOffer__section">
                    <h3 className="jobOffer__section__header">
                        Zakres obowiązków
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
                        Wymagania
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
                        Oferujemy
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
                        Dane kontaktowe osoby rekrutującej
                    </h3>
                    <div className="jobOffer__section__text">
                        {offer.o_contactPerson}{offer.o_contactNumber ? `, tel: +${phoneNumbers[offer.o_contactNumberCountry]?.split('+')[1]} ${offer.o_contactNumber}` : ''}
                    </div>
                </div>

                <div className="jobOffer__section">
                    <h3 className="jobOffer__section__header">
                        O firmie
                    </h3>
                    <div className="jobOffer__section__text">
                        {offer.a_data ? JSON.parse(offer.a_data).description : ''}
                    </div>
                </div>

                <div className="jobOffer__section">
                    <h3 className="jobOffer__section__header">
                        Galeria zdjęć
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

                {offer?.o_attachments ? <div className="jobOffer__section">
                    <h3 className="jobOffer__section__header">
                        Dodatkowe informacje
                    </h3>
                    <div className="jobOffer__section__text jobOffer__section__text--attachments">
                        {offer.a_data ? JSON.parse(offer.o_attachments)?.map((item, index) => {
                            return <a href={`${settings.API_URL}/${item.path}`}
                                      download
                                      target="_blank"
                                // download={`${item.path.replace(`-${item.path.split('-')?.slice(-1)[0]}`, '')}.${item.path.split('.').slice(-1)[0]}`.split('\\').slice(-1)[0]}
                                      key={index}
                                      className="jobOffer__attachmentBtn">
                                <img className="img" src={downloadIcon} alt="pobierz" />
                                {item.name}
                            </a>
                        }) : ''}
                    </div>
                </div> : ''}
            </main>
        </div> : <div className="container container--loader center">
            <Loader />
        </div>
};

export default SingleFastOffer;
