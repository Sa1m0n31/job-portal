import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {getActiveFastOffers,} from "../helpers/offer";
import localization from '../static/img/location.svg'
import settings from "../static/settings";
import {currencies} from "../static/content";
import salaryIcon from '../static/img/dolar-icon.svg'
import {getUserFastApplications} from "../helpers/user";
import {isElementInArray} from "../helpers/others";
import userPlaceholder from '../static/img/user-placeholder.svg'
import {LanguageContext} from "../App";
import Loader from "../components/Loader";

const FastJobOfferList = ({data}) => {
    const [offers, setOffers] = useState([]);
    const [render, setRender] = useState(false);
    const [applications, setApplications] = useState([]);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        getActiveFastOffers()
            .then((res) => {
                if(res?.status === 200) {
                    setRender(true);
                    setOffers(res?.data);
                }
            });

        getUserFastApplications()
            .then((res) => {
               if(res?.status === 200) {
                   setApplications(res?.data?.map((item) => (item.offer)));
               }
            });
    }, []);

    return <div className="container container--agencyJobOffers container--jobOffers">
        <LoggedUserHeader data={data}  />

        <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{c.userZone}</span>
                </span>
        </aside>

        {render ? <div className="userAccount__top userAccount__top--offersInfo flex">
            <h1 className="userAccount__top__jobOffersHeader">
                {c.found} <span className="bold">{offers?.length}/15</span> {c.foundContinue}
            </h1>
        </div> : ''}

        {render ? offers?.map((item, index) => {
            return <div className="offerItem flex" key={index}>
            <span className="offerItem__date">
                {item.offer_created_at?.substring(0, 10)}
            </span>
                <div className="offerItem__left">
                    <figure className="offerItem__figure">
                        <img className="img" src={JSON.parse(item.a_data).logo ? `${settings.API_URL}/${JSON.parse(item.a_data).logo}` : userPlaceholder} alt="zdjecie-profilowe" />
                    </figure>
                    <div className="offerItem__mainInfo">
                        <h2 className="offerItem__title">
                            {item.offer_title}
                        </h2>
                        <h3 className="offerItem__localization">
                            <img className="icon" src={localization} alt="lokalizacja" />
                            {item.offer_city}, {JSON.parse(c.countries)[item.offer_country]}
                        </h3>
                        <h5 className="offerItem__company">
                            {item.a_data ? JSON.parse(item.a_data).name : ''}
                        </h5>
                    </div>
                </div>
                <div className="offerItem__category">
                    {JSON.parse(c.categories)[item.offer_category]}
                </div>
                <div className="offerItem__salary">
                <span className="nowrap">
                    <img className="icon" src={salaryIcon} alt="wynagrodzenie" />
                    {item.offer_salaryFrom} {currencies[item.offer_salaryCurrency]}
                </span> - {item.offer_salaryTo} {currencies[item.offer_salaryCurrency]}
                    <span className="netto">
                    netto/{item.offer_salaryType === 1 ? c.weeklyShortcut : c.monthlyShortcut}
                </span>
                </div>
                <div className="offerItem__requirements">
                    {JSON.parse(item.offer_benefits)?.slice(0, 3)?.map((item, index) => {
                        return <span className="offerItem__requirement" key={index}>
                        {item}
                    </span>
                    })}
                </div>
                <div className="offerItem__buttons offerItem__buttons--user flex">
                    <a href={`/blyskawiczna-oferta-pracy?id=${item.offer_id}`}
                       className="btn btn--white">
                        {c.checkOffer}
                    </a>
                    <a href={`/aplikuj?id=${item.offer_id}&typ=blyskawiczna`}
                       className={isElementInArray(item.offer_id, applications) ? "btn btn--disabled" : "btn"}>
                        {c.apply}
                    </a>
                </div>
            </div>
        }) : <div className="center">
            <Loader />
        </div>}
    </div>
};

export default FastJobOfferList;
