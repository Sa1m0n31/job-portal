import React, {useContext, useEffect, useState} from 'react';
import {getOfferById} from "../helpers/offer";
import LoggedUserHeader from "../components/LoggedUserHeader";
import settings from "../static/settings";
import arrow from '../static/img/small-white-arrow.svg'
import Loader from "../components/Loader";
import infoIcon from '../static/img/info-icon.svg'
import locationIcon from '../static/img/location.svg'
import salaryIcon from '../static/img/dolar-icon.svg'
import agreementIcon from '../static/img/agreement-icon.svg'
import calendarIcon from '../static/img/calendar-icon.svg'
import { currencies} from "../static/content";
import resIcon from '../static/img/responsibilities-icon.svg'
import benIcon from '../static/img/benefit-icon.svg'
import downloadIcon from '../static/img/download-white.svg'
import Gallery from "../components/Gallery";
import backArrow from '../static/img/back-arrow-grey.svg'
import magnifier from '../static/img/magnifier.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'
import {authUser, getUserApplications, getUserData} from "../helpers/user";
import {authAgency, getAgencyData} from "../helpers/agency";
import {LanguageContext} from "../App";
import LoggedUserFooter from "../components/LoggedUserFooter";
import {UserAccountContext} from "../components/UserWrapper";

const SingleOffer = () => {
    const [data, setData] = useState({});
    const [agency, setAgency] = useState(null);
    const [offer, setOffer] = useState({});
    const [galleryIndex, setGalleryIndex] = useState(-1);
    const [userAlreadyApplied, setUserAlreadyApplied] = useState(null);
    const [agencyData, setAgencyData] = useState({});

    const { c } = useContext(LanguageContext);
    const { realAccount } = useContext(UserAccountContext);

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
                                        setData(JSON.parse(res?.data?.data));
                                    }
                                });
                        }
                    })
                    .catch(() => {
                        window.location = '/';
                    });
            });
    }, []);

    useEffect(() => {
        if(agency !== null) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if(id) {
                getOfferById(id)
                    .then(async (res) => {
                        if(res?.status === 200) {
                            if(res?.data) {
                                setOffer(Array.isArray(res.data) ? res.data[0] : res.data);
                                setAgencyData(Array.isArray(res.data) ? JSON.parse(res.data[0]?.a_data) : JSON.parse(res.data?.a_data));
                                const offerId = res?.data[0]?.o_id;

                                if(!agency) {
                                    const userApplicationResponse = await getUserApplications();
                                    if(userApplicationResponse) {
                                        const userApplications = userApplicationResponse?.data;
                                        setUserAlreadyApplied(userApplications?.findIndex((item) => (item.offer === offerId)) !== -1);
                                    }
                                }
                            }
                            else {
                                window.location = '/';
                            }
                        }
                    });
            }
            else {
                window.location = '/';
            }
        }
    }, [agency]);

    return offer?.o_id ? <div className="container container--user container--offer container--offerPage">
            <LoggedUserHeader data={data}
                              agency={agency} />

            {galleryIndex !== -1 ? <Gallery images={offer.a_data ? JSON.parse(offer.a_data).gallery : offer}
                                        setIndex={setGalleryIndex}
                                        index={galleryIndex} /> : ''}

            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{agency ? c.agencyZone : c.userZone}</span>
                </span>
                <a href={!agency ? "/oferty-pracy" : "/moje-oferty-pracy"} className="userAccount__top__btn">
                    <img className="img" src={backArrow} alt="powrót" />
                    {!agency ? c.backToOffers : c.back}
                </a>
            </aside>

        {userAlreadyApplied === false && agency === false && realAccount ? <a href={`/aplikuj?id=${offer.o_id}`}
                                           className="btn btn--jobOfferApply btn--stickyMobile">
            {c.apply}
            <img className="img" src={arrow} alt="przejdź-dalej" />
        </a> : ''}

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
                        {c.added}: {offer.o_created_at?.substring(0, 10)}, {c.offerId}: {offer.o_id}
                    </span>
                            {userAlreadyApplied === false && agency === false && realAccount ? <a href={`/aplikuj?id=${offer.o_id}`}
                                                               className="btn btn--jobOfferApply">
                                {c.apply}
                                <img className="img" src={arrow} alt="przejdź-dalej" />
                            </a> : ''}
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
                                {(offer.o_city ? offer.o_city : c.manyLocations1) + ', ' + JSON.parse(c.countries)[offer.o_country]}
                        </span>
                            <span className="jobOffer__point flex">
                            <img className="img" src={salaryIcon} alt="branża" />
                                {offer.o_category !== null ? `${offer.o_salaryFrom} - ${offer.o_salaryTo} ${currencies[offer.o_salaryCurrency]}` : ''}
                                <span className="distance">
                                {offer.o_category !== null ? `${c.netto}/${offer.o_salaryType === 1 ? c.weeklyShortcut : c.monthlyShortcut}` : ''}
                            </span>
                        </span>
                            <span className="jobOffer__point flex">
                            <img className="img" src={agreementIcon} alt="branża" />
                                <span>
                                    {offer.o_contractType !== '[]' ? JSON.parse(offer.o_contractType).map((item, index, array) => {
                                        if(index !== array.length - 1) {
                                            return <span className="d-block">
                                                {JSON.parse(c.contracts)[item] + ', '}
                                            </span>
                                        }
                                        else {
                                            return <span className="d-block">
                                                {JSON.parse(c.contracts)[item]}
                                            </span>
                                        }
                                    }) : c.noInfo}
                                </span>
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

                {offer?.o_attachments?.length || offer?.o_extraInfo ? <div className="jobOffer__section">
                    <h3 className="jobOffer__section__header">
                        {c.additionalInfo}
                    </h3>
                    {offer?.o_attachments?.length ? <div className="jobOffer__section__text jobOffer__section__text--attachments">
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
                    </div> : ''}

                    {offer?.o_extraInfo ? <div className="jobOffer__section__text">
                        {offer?.o_extraInfo}
                    </div> : ''}
                </div> : ''}

                {offer.o_show_agency_info ? <div className="userAccount__box--jobOffer jobOffer__section">
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
                                {agencyData.roomType !== null && agencyData.roomType !== undefined ? JSON.parse(c.roomsTypes)[agencyData.roomType] : c.noInfo}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.houseType}
                            </span>
                            <p className="userAccount__box__value">
                                {agencyData.houseType !== null && agencyData.houseType !== undefined ? JSON.parse(c.houses)[agencyData.houseType] : c.noInfo}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.equipment}
                            </span>
                            <p className="userAccount__box__value">
                                {agencyData.roomDescription ? agencyData.roomDescription : c.noInfo}
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
                                {agencyData.car === 0 || agencyData.car ?
                                    (agencyData.car === 1 ? JSON.parse(c.paymentTypes)[1] : (`${JSON.parse(c.paymentTypes)[0]}\n${agencyData.carPrice} ${currencies[agencyData.carPriceCurrency]}/${c.weeklyShortcut}`)) : c.noInfo}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.bike}
                            </span>
                            <p className="userAccount__box__value">
                                {agencyData.bike === 0 || agencyData.bike ?
                                    (agencyData.bike === 1 ? JSON.parse(c.paymentTypes)[1] : (`${JSON.parse(c.paymentTypes)[0]}\n${agencyData.bikePrice} ${currencies[agencyData.bikePriceCurrency]}/${c.weeklyShortcut}`)) : c.noInfo}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.costReturn}
                            </span>
                            <p className="userAccount__box__value">
                                {agencyData.costReturnWithOwnTransport !== null && agencyData.costReturnWithOwnTransport !== undefined ?
                                    (agencyData.costReturnWithOwnTransport ? c.yes : c.no) : c.noInfo}
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
                                {agencyData.pensionContributions !== null && agencyData.pensionContributionsAvailable ? `${c.yes}, ${JSON.parse(c.pensionContributionsType)[agencyData.pensionContributions]}` : c.no}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.holidayAllowance}
                            </span>
                            <p className="userAccount__box__value userAccount__box__value--holidayAllowance">
                                {agencyData.holidayAllowanceType !== null && agencyData.holidayAllowanceType !== undefined ? `${JSON.parse(c.holidayAllowanceType)[agencyData.holidayAllowanceType]}
                                `: c.noInfo}<br/>
                                {agencyData.holidayAllowanceType === 1 ? JSON.parse(c.months)[agencyData.holidayAllowanceMonth] : ''}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.salary}
                            </span>
                            <p className="userAccount__box__value">
                                {agencyData.paycheckFrequency !== null && agencyData.paycheckFrequency !== undefined ? JSON.parse(c.paycheckFrequency)[agencyData.paycheckFrequency] : c.noInfo}<br/>
                                {agencyData.paycheckFrequency !== null && agencyData.paycheckFrequency !== undefined ? JSON.parse(c.paycheckDay)[agencyData.paycheckDay] : ''}
                            </p>
                        </span>
                        <span className="userAccount__box__pair">
                            <span className="userAccount__box__key">
                                {c.healthInsurance}
                            </span>
                            <p className="userAccount__box__value">
                                {agencyData.healthInsurance !== null && agencyData.healthInsurance !== undefined ? JSON.parse(c.paymentTypes)[agencyData.healthInsurance] : c.noInfo}<br/>
                                {agencyData.healthInsuranceCost !== null && agencyData.healthInsurance === 0 ? agencyData.healthInsuranceCost + ' ' + currencies[agencyData.healthInsuranceCurrency] : ''}
                            </p>
                        </span>
                    </div>
                </div> : ''}
            </main>

        <LoggedUserFooter />
        </div> : <div className="container container--loader center">
            <Loader />
        </div>
};

export default SingleOffer;
