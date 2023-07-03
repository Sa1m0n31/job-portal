import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {getApplicationsByAgency, getFastApplicationsByAgency} from "../helpers/offer";
import {groupBy, isElementInArray} from "../helpers/others";
import settings from "../static/settings";
import userPlaceholder from "../static/img/user-placeholder.svg";
import localization from "../static/img/location.svg";
import {currencies} from "../static/content";
import salaryIcon from "../static/img/dolar-icon.svg";
import arrowDown from '../static/img/arrow-down.svg'
import UserPreview from "../components/UserPreview";
import {LanguageContext} from "../App";
import Loader from "../components/Loader";
import pen from "../static/img/pen.svg";

const AgencyApplications = ({data}) => {
    const { c } = useContext(LanguageContext);

    const [render, setRender] = useState(false);
    const [offers, setOffers] = useState([]);
    const [fastOffers, setFastOffers] = useState([]);
    const [offersCandidates, setOffersCandidates] = useState([]);
    const [fastOffersCandidates, setFastOffersCandidates] = useState([]);
    const [visibleOffers, setVisibleOffers] = useState([]);
    const [visibleFastOffers, setVisibleFastOffers] = useState([]);

    useEffect(() => {
        async function setup() {
            const offersResponse = await getApplicationsByAgency();
            setOffers(Object.entries(groupBy(offersResponse?.data, 'o_id')));

            const fastOffersResponse = await getFastApplicationsByAgency();
            setFastOffers(Object.entries(groupBy(fastOffersResponse?.data, 'o_id')));

            console.log('witam');
            setRender(true);
        }

        setup();
    }, []);

    useEffect(() => {
        if(offers?.length) {
            setOffersCandidates(offers?.map((item) => {
                return item[1]?.filter((item) => (item.application_id));
            }));
        }
    }, [offers]);

    useEffect(() => {
        if(fastOffers?.length) {
            setFastOffersCandidates(fastOffers?.map((item) => {
                return item[1]?.filter((item) => (item.app_id));
            }));
        }
    }, [fastOffers]);

    const handleVisibleOffers = (i) => {
        if(isElementInArray(i, visibleOffers)) {
            setVisibleOffers(prevState => (prevState.filter((item) => (item !== i))));
        }
        else {
            setVisibleOffers(prevState => ([...prevState, i]));
        }
    }

    const handleVisibleFastOffers = (i) => {
        if(isElementInArray(i, visibleFastOffers)) {
            setVisibleFastOffers(prevState => (prevState.filter((item) => (item !== i))));
        }
        else {
            setVisibleFastOffers(prevState => ([...prevState, i]));
        }
    }

    return <div className="container container--agencyJobOffers">
        <LoggedUserHeader data={data} agency={true} />

        <aside className="userAccount__top flex">
            <span className="userAccount__top__loginInfo">
                {c.loggedIn}: <span className="bold">{c.agencyZone}</span>
            </span>
        </aside>

        {!render ? <div className="center container--height100">
            <Loader />
        </div> : fastOffers?.length ? <section className="applicationsSection">
            <h2 className="applicationsSection__header">
                {c.fastJobOffers}
            </h2>
            {fastOffers?.map((preItem, index) => {
                const item = preItem[1][0];

                return <>
                    <div className="offerItem offerItem--applications flex" key={index}>
                <span className="offerItem__date">
                    {item.o_created_at?.substring(0, 10)}
                </span>
                        <div className="offerItem__left">
                            <figure className="offerItem__figure">
                                <img className="img" src={data?.logo ? `${settings.API_URL}/${data?.logo}` : userPlaceholder} alt="zdjecie-profilowe" />
                            </figure>
                            <div className="offerItem__mainInfo">
                                <h2 className="offerItem__title">
                                    {item.o_title}
                                </h2>
                                <h3 className="offerItem__localization">
                                    <img className="icon" src={localization} alt="lokalizacja" />
                                    {item.o_city}, {JSON.parse(c.countries)[item.o_country]}
                                </h3>
                                <h5 className="offerItem__company">
                                    {data.o_name}
                                </h5>
                            </div>
                        </div>
                        <div className="offerItem__category">
                            {JSON.parse(c.categories)[item.o_category]}
                        </div>
                        <div className="offerItem__salary">
                    <span className="nowrap">
                        <img className="icon" src={salaryIcon} alt="wynagrodzenie" />
                        {item.o_salaryFrom} {currencies[item.o_salaryCurrency]}
                    </span> - {item.o_salaryTo} {currencies[item.o_salaryCurrency]}
                            <span className="netto">
                                {c.netto}/{item.o_salaryType === 1 ? c.weeklyShortcut : c.monthlyShortcut}
                    </span>
                        </div>
                        <div className="offerItem__requirements">
                            {JSON.parse(item.o_requirements)?.slice(0, 3)?.map((item, index) => {
                                return <span className="offerItem__requirement" key={index}>
                            {item}
                        </span>
                            })}
                        </div>
                        <div className="offerItem__buttons offerItem__buttons--applications flex">
                            <a href={`/edycja-blyskawicznej-oferty-pracy?id=${item.o_id}`}
                               className="btn">
                                {c.edition}
                                <img className="img" src={pen} alt="podglad" />
                            </a>

                            {fastOffersCandidates[index]?.length ? <button onClick={() => { handleVisibleFastOffers(index); }}
                                                                           className={isElementInArray(index, visibleFastOffers) ? "btn btn--showCandidates btn--showCandidates--visible" : "btn btn--showCandidates"}>
                                <span>
                                    {isElementInArray(index, visibleFastOffers) ? c.hideCandidates : c.showCandidates}
                                </span>
                                <img className="img" src={arrowDown} alt="podglad" />
                            </button> : <span className="noCandidates">
                                {c.noCVs}
                        </span>}
                        </div>
                    </div>

                    {isElementInArray(index, visibleFastOffers) ? <div className="offerCandidates flex">
                        {fastOffersCandidates[index]?.map((item, index) => {
                            return <UserPreview key={index}
                                                id={item.u_id}
                                                deleteFromFastOffer={true}
                                                companyName={data?.name}
                                                companyLogo={`${settings.API_URL}/${data?.logo}`}
                                                application={{
                                                    id: item.application_id,
                                                    message: item.app_message,
                                                    // preferableContact: JSON.parse(item.app_preferableContact),
                                                    // friendLink: item.app_friendLink,
                                                    attachments: JSON.parse(item.app_attachments)
                                                }}
                                                ownCv={item.u_own_cv}
                                                data={JSON.parse(item.u_data)} />
                        })}
                    </div> : ''}
                </>
            })}
        </section> : ''}

        {!render ? '' : offers?.length ? <section className="applicationsSection">
            <h2 className="applicationsSection__header">
                {c.jobOffers}
            </h2>
            {offers?.map((preItem, index) => {
                const item = preItem[1][0];
                return <>
                    <div className="offerItem offerItem--applications flex" key={index}>
                <span className="offerItem__date">
                    {item.o_created_at?.substring(0, 10)}
                </span>
                        <div className="offerItem__left">
                            <figure className="offerItem__figure">
                                <img className="img" src={data?.logo ? `${settings.API_URL}/${data?.logo}` : userPlaceholder} alt="zdjecie-profilowe" />
                            </figure>
                            <div className="offerItem__mainInfo">
                                <h2 className="offerItem__title">
                                    {item.o_title}
                                </h2>
                                <h3 className="offerItem__localization">
                                    <img className="icon" src={localization} alt="lokalizacja" />
                                    {item.o_city}, {JSON.parse(c.countries)[item.o_country]}
                                </h3>
                                <h5 className="offerItem__company">
                                    {data.o_name}
                                </h5>
                            </div>
                        </div>
                        <div className="offerItem__category">
                            {JSON.parse(c.categories)[item.o_category]}
                        </div>
                        <div className="offerItem__salary">
                    <span className="nowrap">
                        <img className="icon" src={salaryIcon} alt="wynagrodzenie" />
                        {item.o_salaryFrom} {currencies[item.o_salaryCurrency]}
                    </span> - {item.o_salaryTo} {currencies[item.o_salaryCurrency]}
                            <span className="netto">
                                {c.netto}/{item.o_salaryType === 1 ? c.weeklyShortcut : c.monthlyShortcut}
                    </span>
                        </div>
                        <div className="offerItem__requirements">
                            {JSON.parse(item.o_requirements)?.slice(0, 3)?.map((item, index) => {
                                return <span className="offerItem__requirement" key={index}>
                            {item}
                        </span>
                            })}
                        </div>
                        <div className="offerItem__buttons offerItem__buttons--applications flex">
                            <a href={`/edycja-oferty-pracy?id=${item.o_id}`}
                               className="btn btn--white">
                                {c.edition}
                                <img className="img" src={pen} alt="podglad" />
                            </a>

                            {offersCandidates[index]?.length ? <button onClick={() => { handleVisibleOffers(index); }}
                                                                       className={isElementInArray(index, visibleOffers) ? "btn btn--showCandidates btn--showCandidates--visible" : "btn btn--showCandidates"}>
                                <span>
                                    {isElementInArray(index, visibleOffers) ? c.hideCandidates : c.showCandidates}
                                </span>
                                <img className="img" src={arrowDown} alt="podglad" />
                            </button> : <span className="noCandidates">
                                {c.noCVs}
                        </span>}
                        </div>
                    </div>

                    {isElementInArray(index, visibleOffers) ? <div className="offerCandidates flex">
                        {offersCandidates[index]?.map((item, index) => {
                            return <UserPreview key={index}
                                                id={item.u_id}
                                                deleteFromOffer={true}
                                                companyName={data?.name}
                                                companyLogo={`${settings.API_URL}/${data?.logo}`}
                                                application={{
                                                    id: item.application_id,
                                                    message: item.application_message,
                                                    // preferableContact: JSON.parse(item.application_preferableContact),
                                                    // friendLink: item.application_friendLink,
                                                    attachments: JSON.parse(item.application_attachments)
                                                }}
                                                ownCv={item.u_own_cv}
                                                data={JSON.parse(item.u_data)} />
                        })}
                    </div> : ''}
                </>
            })}
        </section> : ''}
    </div>
};

export default AgencyApplications;
