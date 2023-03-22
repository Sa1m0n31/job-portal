import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import magnifier from '../static/img/magnifier.svg'
import {filterAgencies, getAllApprovedAgencies} from "../helpers/agency";
import AgencyPreview from "../components/AgencyPreview";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import AgenciesFilters from "../components/AgenciesFilters";
import filterIcon from '../static/img/filter-results-button.svg'
import {LanguageContext} from "../App";
import {UserAccountContext} from "../components/UserWrapper";

const AgenciesList = ({data}) => {
    const { c } = useContext(LanguageContext);
    const { realAccount } = useContext(UserAccountContext);

    const [agencies, setAgencies] = useState([]);
    const [filtersActive, setFiltersActive] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [country, setCountry] = useState(-1);
    const [city, setCity] = useState('');
    const [distance, setDistance] = useState(0);
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [distanceVisible, setDistanceVisible] = useState(false);
    const [sorting, setSorting] = useState(-1);
    const [filteredAgencies, setFilteredAgencies] = useState([]);

    useEffect(() => {
        getAllApprovedAgencies(1)
            .then((res) => {
                if(res?.status === 200) {
                    setAgencies(res?.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setPage(2);
    }, []);

    const getAgencies = async () => {
        const newAgenciesResponse = await getAllApprovedAgencies(page);
        const newAgencies = newAgenciesResponse.data;

        if(newAgencies.length) {
            await setAgencies(prevState => ([...prevState, ...newAgencies]));
        }
        else {
            await setHasMore(false);
        }
        await setPage(prevState => (prevState+1));
    }

    const filterAgenciesWrapper = async () => {
        if(page > 1) {
            const newAgenciesResponse = await filterAgencies(country, city, distance, sorting, page);
            const newAgencies = newAgenciesResponse.data;

            if(newAgencies.length) {
                setFilteredAgencies(prevState => ([...prevState, ...newAgencies]));
            }
            else {
                setHasMore(false);
            }
            await setPage(prevState => (prevState+1));
        }
    }

    const submitFilter = () => {
        setFilteredAgencies([]);
        setPage(2);
        setHasMore(true);
        setFiltersActive(true);
        filterAgencies(country, city, distance, sorting, 1)
            .then(async (res) => {
                if(res?.status === 201) {
                    if(res?.data?.length) {
                        setFilteredAgencies(res?.data);
                        if(res?.data?.length < 10) {
                            setHasMore(false);
                        }
                    }
                    else {
                        await setHasMore(false);
                        setFilteredAgencies([]);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return <div className="container container--agencyJobOffers container--agenciesList" onClick={() => { setCountriesVisible(false); setDistanceVisible(false); }}>
        <LoggedUserHeader data={data}  />

        {filtersVisible ? <AgenciesFilters country={country}
                                           closeModal={() => { setFiltersVisible(false); }}
                                           countriesVisible={countriesVisible}
                                           setCountriesVisible={setCountriesVisible}
                                           distanceVisible={distanceVisible}
                                           setDistanceVisible={setDistanceVisible}
                                           distance={distance}
                                           sorting={sorting}
                                           setSorting={setSorting}
                                           city={city}
                                           setCountry={setCountry}
                                           setCity={setCity}
                                           submitFilter={submitFilter}
                                           setDistance={setDistance} /> : ''}

        <aside className="userAccount__top flex">
            <span className="userAccount__top__loginInfo">
                {c.loggedIn}: <span className="bold">{c.userZone}</span>
            </span>
            <button className="btn btn--filter" onClick={() => { setFiltersVisible(true); }}>
                {c.filters}
                <img className="img" src={magnifier} alt="powiększ" />
            </button>
        </aside>

        <button className="userAccount__top--mobile" onClick={() => { setFiltersVisible(true); }}>
            {c.filters}
            <img className="img" src={filterIcon} alt="filtry" />
        </button>

        {filtersActive && filteredAgencies?.length === 0 && !hasMore ? <h3 className="noOffersFound">
            {c.noAgenciesFound}
        </h3> : ''}

        {realAccount ? <main className="agenciesList flex">
            {!filtersActive ? <InfiniteScroll
                dataLength={agencies.length ? agencies.length : 10}
                next={getAgencies}
                hasMore={hasMore}
                loader={<div className="center w-100">
                    <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
                </div>}
                endMessage={<span></span>}
            >
                {agencies?.map((item, index) => {
                    return <AgencyPreview key={index}
                                          id={item.id}
                                          data={JSON.parse(item.data)} />
                })}
            </InfiniteScroll> : <InfiniteScroll
                dataLength={filteredAgencies.length ? filteredAgencies.length : 10}
                next={filterAgenciesWrapper}
                hasMore={hasMore}
                loader={<div className="center w-100">
                    <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
                </div>}
                endMessage={<span></span>}
            >
                {filteredAgencies?.map((item, index) => {
                    return <AgencyPreview key={index}
                                          id={item.id}
                                          data={JSON.parse(item.data)} />
                })}
            </InfiniteScroll>}
        </main> : <main className="agenciesList flex">
            <div>
                {!filtersActive ? agencies?.slice(0, 4)?.map((item, index) => {
                    return <AgencyPreview key={index}
                                          id={item.id}
                                          data={JSON.parse(item.data)} />
                }) : filteredAgencies?.slice(0, 4)?.map((item, index) => {
                    return <AgencyPreview key={index}
                                          id={item.id}
                                          data={JSON.parse(item.data)} />
                })}
            </div>

            <h4 className="testAccountHeader">
                {c.test_account_text_3}
            </h4>
        </main>}

    </div>
};

export default AgenciesList;
