import React, {useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {deleteOffer, getActiveJobOffers, getJobOffersByAgency} from "../helpers/offer";
import localization from '../static/img/location.svg'
import settings from "../static/settings";
import {categories, countries, currencies, formErrors, myJobOffersFilter} from "../static/content";
import salaryIcon from '../static/img/dolar-icon.svg'
import magnifier from '../static/img/magnifier.svg'
import dolarIcon from '../static/img/dolar-icon.svg'
import Loader from "../components/Loader";

const JobOfferList = ({data}) => {
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [render, setRender] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(0);
    const [deleteSuccessful, setDeleteSuccessful] = useState(false);

    {/* FILTERS */}
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(-1);
    const [city, setCity] = useState('');
    const [distance, setDistance] = useState(0);
    const [salaryFrom, setSalaryFrom] = useState(null);
    const [salaryTo, setSalaryTo] = useState(null);
    const [salaryType, setSalaryType] = useState(0);
    const [salaryCurrency, setSalaryCurrency] = useState(0);

    useEffect(() => {
        getActiveJobOffers()
            .then((res) => {
                if(res?.status === 200) {
                    console.log(res);
                    setRender(true);
                    setOffers(res?.data);
                }
            });
    }, [deleteSuccessful]);

    useEffect(() => {
        changeFilter(0);
    }, [offers]);

    const changeFilter = (i) => {
        if(i === 0) {
            setFilteredOffers(offers);
        }
    }

    return <div className="container container--agencyJobOffers" onClick={() => { setDropdownVisible(false); }}>
        <LoggedUserHeader data={data}  />

        <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracodawcy</span>
                </span>
        </aside>

        <div className="offerFilters flex">
            <button className="btn btn--offerFiltersOpen">
                Filtry wyszukiwania
                <img className="img" src={magnifier} alt="powiększ" />
            </button>

            <div className="offerFilters__section">
                <p className="offerFilters__section__item">
                    Stanowisko
                    <span className="offerFilters__section__frame">
                        {title ? title : 'Wszystkie'}
                    </span>
                </p>
                <p className="offerFilters__section__item">
                    Kategoria
                    <span className="offerFilters__section__frame">
                        {category !== -1 ? categories[category] : 'Wszystkie'}
                    </span>
                </p>
            </div>

            <div className="offerFilters__section">
                <p className="offerFilters__section__item">
                    Miejsce pracy
                    <span className="offerFilters__section__value offerFilters__section__value--location">
                        <img className="img" src={localization} alt="lokalizacja" />
                        {city ? <>
                            {city}
                            <span className="distance">
                            + {distance} km
                        </span>
                        </> : 'Wszystkie'}
                    </span>
                </p>
                <p className="offerFilters__section__item">
                    Pensja
                    <span className="offerFilters__section__value">
                        <img className="img" src={dolarIcon} alt="zarobki" />
                        {salaryFrom || salaryTo ? <>
                            {salaryFrom} - {salaryTo}
                            <span className="distance">
                            {currencies[salaryCurrency]} netto/{salaryType === 0 ? 'tyg.' : 'mies.'}
                        </span>
                        </> : 'Wszystkie'}
                    </span>
                </p>
            </div>

            <button className="btn btn--filter">
                Wyszukaj
                <img className="img" src={magnifier} alt="wyszukiwarka" />
            </button>
        </div>

        {render ? filteredOffers?.map((item, index) => {
            return <div className="offerItem flex" key={index}>
                <span className="offerItem__date">
                    {item.offer_created_at?.substring(0, 10)}
                </span>
                <div className="offerItem__left">
                    <figure className="offerItem__figure">
                        <img className="img" src={item.a_data ? `${settings.API_URL}/${JSON.parse(item.a_data).logo}` : `${settings.API_URL}/${item?.a_logo}`} alt="zdjecie-profilowe" />
                    </figure>
                    <div className="offerItem__mainInfo">
                        <h2 className="offerItem__title">
                            {item.offer_title}
                        </h2>
                        <h3 className="offerItem__localization">
                            <img className="icon" src={localization} alt="lokalizacja" />
                            {item.offer_city}, {countries[item.offer_country]}
                        </h3>
                        <h5 className="offerItem__company">
                            {item.a_data ? JSON.parse(item.a_data).name : ''}
                        </h5>
                    </div>
                </div>
                <div className="offerItem__category">
                    {categories[item.offer_category]}
                </div>
                <div className="offerItem__salary">
                    <span className="nowrap">
                        <img className="icon" src={salaryIcon} alt="wynagrodzenie" />
                        {item.offer_salaryFrom} {currencies[item.offer_salaryCurrency]}
                    </span> - {item.offer_salaryTo} {currencies[item.offer_salaryCurrency]}
                    <span className="netto">
                        netto/{item.offer_salaryType === 1 ? 'tyg.' : 'mies.'}
                    </span>
                </div>
                <div className="offerItem__requirements">
                    {JSON.parse(item.offer_requirements)?.slice(0, 3)?.map((item, index) => {
                        return <span className="offerItem__requirement" key={index}>
                            {item}
                        </span>
                    })}
                </div>
                <div className="offerItem__buttons offerItem__buttons--user flex">
                    <a href={`/oferta-pracy?id=${item.offer_id}`}
                       className="btn btn--white">
                        Przeglądaj ogłoszenie
                    </a>
                    <a href={`/aplikuj?id=${item.offer_id}`}
                       className="btn">
                        Aplikuj
                    </a>
                </div>
            </div>
        }) : <div className="center">
            <Loader />
        </div>}
    </div>
};

export default JobOfferList;
