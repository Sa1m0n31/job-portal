import React, {useContext, useEffect, useState} from 'react';
import {getActiveJobOffers} from "../helpers/offer";
import settings from "../static/settings";
import userPlaceholder from "../static/img/user-placeholder.svg";
import localization from "../static/img/location.svg";
import salaryIcon from "../static/img/dolar-icon.svg";
import {currencies} from "../static/content";
import {LanguageContext} from "../App";
import HomeSectionHeader from "./HomeSectionHeader";
import {getRandomElements} from "../helpers/others";
import Loader from "./Loader";

const ExampleJobOffers = () => {
    const { c } = useContext(LanguageContext);

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getActiveJobOffers(1)
            .then((res) => {
                if(res?.status === 200) {
                    const offersString = JSON.stringify(res?.data)?.replace(/«/g, '\'').replace(/»/g, '\'');
                    setOffers(getRandomElements(JSON.parse(offersString), 5));
                }
            });
    }, []);

    const showAllOffers = () => {
        setLoading(true);
        getActiveJobOffers()
            .then((res) => {
                if(res?.status === 200) {
                    setOffers(res.data);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return <div className="homeSection homeSection--offerList">
        <HomeSectionHeader content={c.jobOffers} />

        {offers?.map((item, index) => {
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
                    {JSON.parse(item.offer_benefits.replace(/'/g, '"'))?.slice(0, 3)?.map((item, index) => {
                        return <span className="offerItem__requirement" key={index}>
                            {item}
                        </span>
                    })}
                </div>
                <div className="offerItem__buttons offerItem__buttons--user flex">
                    <a href={`/strefa-pracownika`}
                       className="btn btn--white">
                        {c.apply}
                    </a>
                </div>
            </div>
        })}

        {offers?.length < 6 ? (loading ? <div className="center">
            <Loader />
        </div> : <button className="btn btn--showAll"
                         onClick={showAllOffers}>
            {c.show_all}
        </button>) : ''}
    </div>
};

export default ExampleJobOffers;
