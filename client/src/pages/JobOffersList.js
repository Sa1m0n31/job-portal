import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {filterOffers, getActiveJobOffers} from "../helpers/offer";
import localization from '../static/img/location.svg'
import settings from "../static/settings";
import {currencies, distances} from "../static/content";
import salaryIcon from '../static/img/dolar-icon.svg'
import magnifier from '../static/img/magnifier.svg'
import dolarIcon from '../static/img/dolar-icon.svg'
import Loader from "../components/Loader";
import {getUserApplications} from "../helpers/user";
import {isElementInArray} from "../helpers/others";
import JobOffersFilters from "../components/JobOffersFilters";
import InfiniteScroll from 'react-infinite-scroll-component';
import userPlaceholder from '../static/img/user-placeholder.svg'
import filterIcon from "../static/img/filter-results-button.svg";
import {LanguageContext} from "../App";
import { UserAccountContext } from "../components/UserWrapper";

const JobOfferList = ({data}) => {
    const { realAccount } = useContext(UserAccountContext);

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
    const [loading, setLoading] = useState(false);

    {/* FILTERS */}
    const [title, setTitle] = useState('');
    const [keywords, setKeywords] = useState('');
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

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        getActiveJobOffers(page)
            .then((res) => {
                if(res?.status === 200) {
                    setRender(true);
                    const offersString = JSON.stringify(res?.data)?.replace(/«/g, '\'').replace(/»/g, '\'');
                    setOffers(JSON.parse(offersString));
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
        if(offers.length) {
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
        setLoading(true);
        setPage(2);
        setHasMore(true);
        setFilterActive(true);
        filterOffers(1, title, keywords, category, country, city, distance, salaryType, salaryFrom, salaryTo, salaryCurrency)
            .then(async (res) => {
                setLoading(false);
                if(res?.status === 201) {
                    if(res?.data?.length) {
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
                setLoading(false);
            });
    }

    return <div className="container container--agencyJobOffers container--jobOffers" onClick={() => { hideAllDropdowns(); setDropdownVisible(false); }}>
        <LoggedUserHeader data={data}  />

        {filtersVisible ? <JobOffersFilters closeModal={() => { setFiltersVisible(false); }}
                                            title={title}
                                            keywords={keywords}
                                            submitFilters={submitFilter}
                                            category={category}
                                            country={country}
                                            city={city}
                                            distance={distance}
                                            salaryType={salaryType}
                                            salaryFrom={salaryFrom}
                                            salaryTo={salaryTo}
                                            salaryCurrency={salaryCurrency}
                                            setTitle={setTitle}
                                            setKeywords={setKeywords}
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
                    {c.loggedIn}: <span className="bold">{c.userZone}</span>
                </span>
        </aside>

        <button className="userAccount__top--mobile" onClick={() => { setFiltersVisible(true); }}>
            {c.filters}
            <img className="img" src={filterIcon} alt="filtry" />
        </button>

        <div className="offerFilters flex">
            <button className="btn btn--offerFiltersOpen"
                    onClick={() => { setFiltersVisible(true); }}
            >
                {c.filters}
                <img className="img" src={magnifier} alt="powiększ" />
            </button>

            <div className="offerFilters__section">
                <p className="offerFilters__section__item">
                    {c.post}
                    <span className="offerFilters__section__frame">
                        {title ? title : c.all}
                    </span>
                </p>
                <p className="offerFilters__section__item">
                    {c.category}
                    <span className="offerFilters__section__frame">
                        {category !== -1 ? JSON.parse(c.categories)[category] : c.all}
                    </span>
                </p>
            </div>

            <div className="offerFilters__section">
                <p className="offerFilters__section__item">
                    {c.jobPlace}
                    <span className="offerFilters__section__value offerFilters__section__value--location">
                        <img className="img" src={localization} alt="lokalizacja" />
                        {city ? <>
                            {city}
                            <span className="distance">
                            {distances[distance]}
                        </span>
                        </> : c.all}
                    </span>
                </p>
                <p className="offerFilters__section__item">
                    {c.salaryShort}
                    <span className="offerFilters__section__value">
                        <img className="img" src={dolarIcon} alt="zarobki" />
                        {salaryFrom || salaryTo ? <>
                            {salaryFrom} - {salaryTo}
                            <span className="distance">
                            {currencies[salaryCurrency]} netto/{salaryType === 0 ? c.weeklyShortcut : c.monthlyShortcut}
                        </span>
                        </> : c.all}
                    </span>
                </p>
            </div>

            <button className="btn btn--filter" onClick={() => { submitFilter(); }}>
                <span>{c.search}</span>
                <img className="img" src={magnifier} alt="wyszukiwarka" />
            </button>
        </div>

        {!realAccount ? <div>
            {render ? offers?.slice(0, 3)?.map((item, index) => {
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
                        <a href={`/oferta-pracy?id=${item.offer_id}`}
                           className="btn btn--white">
                            {c.checkOffer}
                        </a>
                    </div>
                </div>
            }) : ''}

            <h4 className="testAccountHeader">
                Załóż konto, aby zobaczyć wszystkie oferty {/* TODO */}
            </h4>
        </div> : (!loading ? (!filterActive ? <InfiniteScroll
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
                        <a href={`/oferta-pracy?id=${item.offer_id}`}
                           className="btn btn--white">
                            {c.checkOffer}
                        </a>
                        {realAccount ? <a href={`/aplikuj?id=${item.offer_id}`}
                                          className={isElementInArray(item.offer_id, applications) ? "btn btn--disabled" : "btn"}>
                            {c.apply}
                        </a> : ''}
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
                        {JSON.parse(item.offer_requirements)?.slice(0, 3)?.map((item, index) => {
                            return <span className="offerItem__requirement" key={index}>
                            {item}
                        </span>
                        })}
                    </div>
                    <div className="offerItem__buttons offerItem__buttons--user flex">
                        <a href={`/oferta-pracy?id=${item.offer_id}`}
                           className="btn btn--white">
                            {c.checkOffer}
                        </a>
                        {realAccount ? <a href={`/aplikuj?id=${item.offer_id}`}
                                          className={isElementInArray(item.offer_id, applications) ? "btn btn--disabled" : "btn"}>
                            {c.apply}
                        </a> : ''}
                    </div>
                </div>
            }) : <h4 className="noOffersFound">
                {c.noOffersFound}
            </h4>) : ''}
        </InfiniteScroll>) : <div className="offersLoader">
            <Loader />
        </div>)}
    </div>
};

export default JobOfferList;
