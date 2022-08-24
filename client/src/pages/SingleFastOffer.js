import React, {useContext, useEffect, useState} from 'react';
import {getFastOfferById} from "../helpers/offer";
import LoggedUserHeader from "../components/LoggedUserHeader";
import settings from "../static/settings";
import arrow from '../static/img/small-white-arrow.svg'
import Loader from "../components/Loader";
import infoIcon from '../static/img/info-icon.svg'
import locationIcon from '../static/img/location.svg'
import salaryIcon from '../static/img/dolar-icon.svg'
import calendarIcon from '../static/img/calendar-icon.svg'
import {currencies, phoneNumbers} from "../static/content";
import resIcon from '../static/img/responsibilities-icon.svg'
import benIcon from '../static/img/benefit-icon.svg'
import downloadIcon from '../static/img/download-white.svg'
import Gallery from "../components/Gallery";
import backArrow from '../static/img/back-arrow-grey.svg'
import magnifier from '../static/img/magnifier.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'
import {addLeadingZero} from "../helpers/others";
import homeIcon from '../static/img/home-icon-blue.svg'
import {authUser, getUserData, getUserFastApplications} from "../helpers/user";
import {authAgency, getAgencyData} from "../helpers/agency";
import {LanguageContext} from "../App";

const SingleFastOffer = () => {
    const [data, setData] = useState({});
    const [agency, setAgency] = useState(null);
    const [offer, setOffer] = useState({});
    const [galleryIndex, setGalleryIndex] = useState(-1);
    const [userAlreadyApplied, setUserAlreadyApplied] = useState(false);
    const [timer, setTimer] = useState(null);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        setInterval(() => {
            var toDate=new Date();
            var tomorrow=new Date();
            tomorrow.setHours(24,0,0,0);
            var diffMS=tomorrow.getTime()/1000-toDate.getTime()/1000;
            var diffHr=Math.floor(diffMS/3600);
            diffMS=diffMS-diffHr*3600;
            var diffMi=Math.floor(diffMS/60);
            diffMS=diffMS-diffMi*60;
            var diffS=Math.floor(diffMS);
            var result=((diffHr<10)?"0"+diffHr+' h ':diffHr+' h ');
            result+=((diffMi<10)?"0"+diffMi+' min ':diffMi+' min ');
            result+=((diffS<10)?"0"+diffS+' sek':diffS+' sek');

            setTimer(result);
        }, 1000);
    }, []);

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
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if(id) {
            getFastOfferById(id)
                .then(async (res) => {
                   if(res?.status === 200) {
                       setOffer(res?.data[0]);
                       const offerId = res?.data[0]?.o_id;

                       const userApplicationResponse = await getUserFastApplications();
                       if(userApplicationResponse) {
                           const userApplications = userApplicationResponse?.data;
                           setUserAlreadyApplied(userApplications?.findIndex((item) => (item.offer === offerId)) !== -1);
                       }
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
            <LoggedUserHeader data={data} agency={agency} />

            {galleryIndex !== -1 ? <Gallery images={offer.a_data ? JSON.parse(offer.a_data).gallery : offer}
                                        setIndex={setGalleryIndex}
                                        index={galleryIndex} /> : ''}

            <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{agency ? c.agencyZone : c.userZone}</span>
                </span>
                <a href={agency ? "/moje-blyskawiczne-oferty-pracy" : "/blyskawiczne-oferty-pracy"} className="userAccount__top__btn">
                    <img className="img" src={backArrow} alt="powrót" />
                    {agency ? c.back : c.backToOffers}
                </a>
            </aside>

        {agency === false && !userAlreadyApplied ? <a href={`/aplikuj?id=${offer.o_id}&typ=blyskawiczna`}
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
                        <div className="fastOfferInfo">
                            <span>{c.fastOfferInfo1}</span>
                            <span>{c.fastOfferInfo2}</span>
                            {timer ? <span className="bold">{c.fastOfferInfo3}: {timer}</span> : ''}
                        </div>
                        <div className="jobOffer__topRow__right">
                            <span className="jobOffer__sideInfo">
                                {c.added}: {offer.o_created_at?.substring(0, 10)}, {c.offerId}: {offer.o_id}
                            </span>
                            {agency === false && !userAlreadyApplied ? <a href={`/aplikuj?id=${offer.o_id}&typ=blyskawiczna`}
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
                                {offer.o_category !== null ? JSON.parse(c.countries)[offer.o_country] : ''}<br/>
                                {offer.o_category !== null ? offer.o_postalCode + ' ' +  offer.o_city + ', ' + offer.o_street : ''}
                        </span>
                        <span className="jobOffer__point flex flex-wrap">
                            <img className="img" src={homeIcon} alt="branża" />
                            <p>
                                <span>
                                    {offer.o_category !== null ? `${offer.o_accommodationPostalCode} ${offer.o_accommodationCity}, ${offer.o_accommodationStreet}` : ''}
                                </span>
                                <span>
                                    {offer.o_category !== null ? `${c.accommodationFrom}: ${addLeadingZero(offer.o_accommodationDay+1)}.${addLeadingZero(offer.o_accommodationMonth+1)}.${offer.o_accommodationYear}, ${offer.o_accommodationHour}` : ''}
                                </span>
                            </p>
                        </span>
                        <span className="jobOffer__point flex">
                            <img className="img" src={salaryIcon} alt="branża" />
                                {offer.o_category !== null ? `${offer.o_salaryFrom} - ${offer.o_salaryTo} ${currencies[offer.o_salaryCurrency]}` : ''}
                                <span className="distance">
                                {offer.o_category !== null ? `${c.netto}/${offer.o_salary_type === 0 ? c.monthlyShortcut : c.weeklyShortcut}` : ''}
                            </span>
                        </span>
                            <span className="jobOffer__point jobOffer__point--time flex">
                            <img className="img" src={calendarIcon} alt="branża" />
                                {c.jobStart}:
                            <span className="distance">
                                {offer.o_category !== null ? `${addLeadingZero(offer.o_startDay+1)}.${addLeadingZero(offer.o_startMonth+1)}.${offer.o_startYear}, ${offer.o_startHour}` : ''}
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
                        {c.recruitmentPersonData}
                    </h3>
                    <div className="jobOffer__section__text">
                        {offer.o_contactPerson}{offer.o_contactNumber ? `, tel: +${phoneNumbers[offer.o_contactNumberCountry]?.split('+')[1]} ${offer.o_contactNumber}` : ''}
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

                {offer?.o_attachments ? <div className="jobOffer__section">
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
            </main>
        </div> : <div className="container container--loader center">
            <Loader />
        </div>
};

export default SingleFastOffer;
