import React, {useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {deleteOffer, filterOffers, getActiveJobOffers, getJobOffersByAgency} from "../helpers/offer";
import localization from '../static/img/location.svg'
import settings from "../static/settings";
import {categories, countries, currencies, distances, formErrors, myJobOffersFilter} from "../static/content";
import salaryIcon from '../static/img/dolar-icon.svg'
import magnifier from '../static/img/magnifier.svg'
import dolarIcon from '../static/img/dolar-icon.svg'
import Loader from "../components/Loader";
import {getUserApplications} from "../helpers/user";
import {isElementInArray} from "../helpers/others";
import JobOffersFilters from "../components/JobOffersFilters";
import InfiniteScroll from 'react-infinite-scroll-component';

const JobOfferList = ({data}) => {
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [render, setRender] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [deleteSuccessful, setDeleteSuccessful] = useState(false);
    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filterActive, setFilterActive] = useState(false);

    {/* FILTERS */}
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(-1);
    const [country, setCountry] = useState(-1);
    const [city, setCity] = useState('');
    const [distance, setDistance] = useState(0);
    const [salaryFrom, setSalaryFrom] = useState(null);
    const [salaryTo, setSalaryTo] = useState(null);
    const [salaryType, setSalaryType] = useState(0);
    const [salaryCurrency, setSalaryCurrency] = useState(0);

    const [categoriesVisible, setCategoriesVisible] = useState(false);
    const [currenciesVisible, setCurrenciesVisible] = useState(false);
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [distanceVisible, setDistanceVisible] = useState(false);

    useEffect(() => {
        getActiveJobOffers(page)
            .then((res) => {
                if(res?.status === 200) {
                    setRender(true);
                    setOffers(res?.data);
                }
            });
        setPage(2);

        getUserApplications()
            .then((res) => {
               if(res?.status === 200) {
                   setApplications(res?.data?.map((item) => (item.offer)));
               }
            });

        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                hideAllDropdowns();
            }
        })
    }, [deleteSuccessful]);

    const fetchJobOffers = async () => {
        const newOffersResponse = await getActiveJobOffers(page);
        const newOffers = newOffersResponse.data;

        if(newOffers.length) {
            await setOffers(prevState => ([...prevState, ...newOffers]));
        }
        else {
            await setHasMore(false);
        }
        await setPage(prevState => (prevState+1));
    }

    useEffect(() => {
        changeFilter(0);
    }, [offers]);

    const changeFilter = (i) => {
        if(i === 0) {
            setFilteredOffers(offers);
        }
    }

    const hideAllDropdowns = () => {
        setCategoriesVisible(false);
        setCountriesVisible(false);
        setCurrenciesVisible(false);
        setDistanceVisible(false);
    }

    const filterOffersWrapper = async () => {
        if(page > 1) {
            const newOffersResponse = await filterOffers(page, title, category, country, city, distance, salaryType, salaryFrom, salaryTo, salaryCurrency);
            const newOffers = newOffersResponse.data;

            console.log(page);
            console.log(newOffersResponse);

            if(newOffers.length) {
                setFilteredOffers(prevState => ([...prevState, ...newOffers]));
            }
            else {
                setHasMore(false);
            }
            await setPage(prevState => (prevState+1));
        }
    }

    const submitFilter = () => {
        setPage(2);
        setHasMore(true);
        setFilterActive(true);
        filterOffers(1, title, category, country, city, distance, salaryType, salaryFrom, salaryTo, salaryCurrency)
            .then(async (res) => {
                if(res?.status === 201) {
                    if(res?.data?.length) {
                        console.log('initialize');
                        setFilteredOffers(res?.data);
                        if(res?.data?.length < 2) {
                            setHasMore(false);
                        }
                    }
                    else {
                        await setHasMore(false);
                        setFilteredOffers([]);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return <div className="container container--agencyJobOffers container--jobOffers" onClick={() => { hideAllDropdowns(); setDropdownVisible(false); }}>
        <LoggedUserHeader data={data}  />

        {filtersVisible ? <JobOffersFilters closeModal={() => { setFiltersVisible(false); }}
                                            title={title}
                                            category={category}
                                            country={country}
                                            city={city}
                                            distance={distance}
                                            salaryType={salaryType}
                                            salaryFrom={salaryFrom}
                                            salaryTo={salaryTo}
                                            salaryCurrency={salaryCurrency}
                                            setTitle={setTitle}
                                            setCategory={setCategory}
                                            setCountry={setCountry}
                                            setCity={setCity}
                                            setDistance={setDistance}
                                            setSalaryType={setSalaryType}
                                            setSalaryFrom={setSalaryFrom}
                                            setSalaryTo={setSalaryTo}
                                            setSalaryCurrency={setSalaryCurrency}
                                            categoriesVisible={categoriesVisible}
                                            setCategoriesVisible={setCategoriesVisible}
                                            countriesVisible={countriesVisible}
                                            setCountriesVisible={setCountriesVisible}
                                            distanceVisible={distanceVisible}
                                            setDistanceVisible={setDistanceVisible}
                                            currenciesVisible={currenciesVisible}
                                            setCurrenciesVisible={setCurrenciesVisible} /> : ''}

        <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    Zalogowany w: <span className="bold">Strefa Pracodawcy</span>
                </span>
        </aside>

        <div className="offerFilters flex">
            <button className="btn btn--offerFiltersOpen"
                    onClick={() => { setFiltersVisible(true); }}
            >
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
                            {distances[distance]}
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

            <button className="btn btn--filter" onClick={() => { submitFilter(); }}>
                Wyszukaj
                <img className="img" src={magnifier} alt="wyszukiwarka" />
            </button>
        </div>

        {!filterActive ? <InfiniteScroll
            dataLength={offers?.length ? offers?.length : 2}
            next={fetchJobOffers}
            hasMore={hasMore}
            loader={<div className="center">
                <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
            </div>}
            endMessage={<span></span>}
        >
            {render ? offers?.map((item, index) => {
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
                           className={isElementInArray(item.offer_id, applications) ? "btn btn--disabled" : "btn"}>
                            Aplikuj
                        </a>
                    </div>
                </div>
            }) : ''}
        </InfiniteScroll> : <InfiniteScroll
            dataLength={filteredOffers.length ? filteredOffers.length : 2}
            next={filterOffersWrapper}
            hasMore={hasMore}
            loader={<div className="center">
                <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
            </div>}
            endMessage={<span></span>}
        >
            {render ? (filteredOffers?.length ? filteredOffers?.map((item, index) => {
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
                           className={isElementInArray(item.offer_id, applications) ? "btn btn--disabled" : "btn"}>
                            Aplikuj
                        </a>
                    </div>
                </div>
            }) : <h4 className="noOffersFound">
                Nie znaleziono ofert pracy o podanych kryteriach
            </h4>) : ''}
        </InfiniteScroll>}
    </div>
};

export default JobOfferList;
