import React, {useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {getJobOffersByAgency} from "../helpers/offer";
import localization from '../static/img/location.svg'
import settings from "../static/settings";
import {categories, countries, currencies} from "../static/content";
import salaryIcon from '../static/img/dolar-icon.svg'
import magnifier from '../static/img/magnifier.svg'
import pen from '../static/img/pen.svg'
import trash from '../static/img/trash.svg'

const MyJobOffers = ({data}) => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        getJobOffersByAgency()
            .then((res) => {
                if(res?.status === 200) {
                    setOffers(res?.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const openDeleteModal = () => {

    }

    return <div className="container container--agencyJobOffers">
        <LoggedUserHeader data={data} agency={true} />

        <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracodawcy</span>
                </span>
        </aside>
        <div className="userAccount__top flex">

        </div>
        {offers?.map((item, index) => {
            return <div className="offerItem flex" key={index}>
                <figure className="offerItem__figure">
                    <img className="img" src={`${settings.API_URL}/${data?.logo}`} alt="zdjecie-profilowe" />
                </figure>
                <div className="offerItem__mainInfo">
                    <h2 className="offerItem__title">
                        {item.title}
                    </h2>
                    <h3 className="offerItem__localization">
                        <img className="icon" src={localization} alt="lokalizacja" />
                        {item.city}, {countries[item.country]}
                    </h3>
                    <h5 className="offerItem__company">
                        {data.name}
                    </h5>
                </div>
                <div className="offerItem__category">
                    {categories[item.category]}
                </div>
                <div className="offerItem__salary">
                    <span className="nowrap">
                        <img className="icon" src={salaryIcon} alt="wynagrodzenie" />
                        {item.salaryFrom} {currencies[item.salaryCurrency]}
                    </span> - {item.salaryTo} {currencies[item.salaryCurrency]}
                    <span className="netto">
                        netto/mies.
                    </span>
                </div>
                <div className="offerItem__requirements">
                    {JSON.parse(item.requirements)?.slice(0, 3)?.map((item, index) => {
                        return <span className="offerItem__requirement" key={index}>
                            {item}
                        </span>
                    })}
                </div>
                <div className="offerItem__buttons flex">
                    <a href="/"
                       className="btn btn--white">
                        Podgląd
                        <img className="img" src={magnifier} alt="podglad" />
                    </a>
                    <a href={`/edycja-oferty-pracy?id=${item.id}`}
                       className="btn">
                        Edycja
                        <img className="img" src={pen} alt="podglad" />
                    </a>
                    <button onClick={() => { openDeleteModal(); }}
                       className="btn btn--grey">
                        Usuń
                        <img className="img" src={trash} alt="podglad" />
                    </button>
                </div>
            </div>
        })}
    </div>
};

export default MyJobOffers;
