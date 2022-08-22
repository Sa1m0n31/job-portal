import React, {useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import Modal from "../components/Modal";
import magnifier from "../static/img/magnifier.svg";
import {filterAgencies, getAllApprovedAgencies} from "../helpers/agency";
import {filterUsers, getAllVisibleUsers} from "../helpers/user";
import filterIcon from "../static/img/filter-results-button.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../components/Loader";
import AgencyPreview from "../components/AgencyPreview";
import UserPreview from "../components/UserPreview";
import AgenciesFilters from "../components/AgenciesFilters";
import UsersFilters from "../components/UsersFilters";
import {currencies} from "../static/content";
import settings from "../static/settings";
import CV from "../components/CV";

const CandidatesList = ({data}) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filtersActive, setFiltersActive] = useState(false);

    // Filters
    const [category, setCategory] = useState(-1);
    const [country, setCountry] = useState(-1);
    const [city, setCity] = useState('');
    const [distance, setDistance] = useState(0);
    const [salaryType, setSalaryType] = useState(-1);
    const [salaryFrom, setSalaryFrom] = useState(null);
    const [salaryTo, setSalaryTo] = useState(null);
    const [salaryCurrency, setSalaryCurrency] = useState(0);
    const [ownTransport, setOwnTransport] = useState(null);
    const [bsnNumber, setBsnNumber] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [drivingLicences, setDrivingLicences] = useState([]);

    const [categoriesVisible, setCategoriesVisible] = useState(false);
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [distanceVisible, setDistanceVisible] = useState(false);
    const [ownTransportVisible, setOwnTransportVisible] = useState(false);
    const [bsnNumberVisible, setBsnNumberVisible] = useState(false);
    const [currenciesVisible, setCurrenciesVisible] = useState(false);

    useEffect(() => {
        getAllVisibleUsers(1)
            .then((res) => {
                if(res?.status === 200) {
                    setUsers(res?.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setPage(2);
    }, []);

    const getUsers = async () => {
        const newUsersResponse = await getAllVisibleUsers(page);
        const newUsers = newUsersResponse.data;

        if(newUsers.length) {
            await setUsers(prevState => ([...prevState, ...newUsers]));
        }
        else {
            await setHasMore(false);
        }
        await setPage(prevState => (prevState+1));
    }

    const filterUsersWrapper = async () => {
        if(page > 1) {
            const newUsersResponse = await filterUsers(category, country, city, distance, salaryType, salaryFrom, salaryTo,
                currencies[salaryCurrency], ownTransport, bsnNumber, languages, drivingLicences, page);
            const newUsers = newUsersResponse.data;

            if(newUsers.length) {
                setFilteredUsers(prevState => ([...prevState, ...newUsers]));
            }
            else {
                setHasMore(false);
            }
            await setPage(prevState => (prevState+1));
        }
    }

    const submitFilter = () => {
        setFilteredUsers([]);
        setPage(2);
        setHasMore(true);
        setFiltersActive(true);

        filterUsers(category, country, city, distance, salaryType, salaryFrom, salaryTo,
            currencies[salaryCurrency], ownTransport, bsnNumber, languages, drivingLicences, 1)
            .then(async (res) => {
                if(res?.status === 201) {
                    if(res?.data?.length) {
                        setFilteredUsers(res?.data);
                        if(res?.data?.length < 10) {
                            setHasMore(false);
                        }
                    }
                    else {
                        await setHasMore(false);
                        setFilteredUsers([]);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const hideAllDropdowns = () => {
        setCategoriesVisible(false);
        setCurrenciesVisible(false);
        setCountriesVisible(false);
        setDistanceVisible(false);
        setOwnTransportVisible(false);
        setBsnNumberVisible(false);
    }

    return <div className="container container--agencyJobOffers container--candidatesList" onClick={() => { hideAllDropdowns(); }}>
        <LoggedUserHeader data={data} agency={true} />

        {filtersVisible ? <UsersFilters country={country}
                                       closeModal={() => { setFiltersVisible(false); }}
                                       countriesVisible={countriesVisible}
                                       setCountriesVisible={setCountriesVisible}
                                       distanceVisible={distanceVisible}
                                       setDistanceVisible={setDistanceVisible}
                                       distance={distance}
                                       category={category}
                                       setCategory={setCategory}
                                       categoriesVisible={categoriesVisible}
                                       setCategoriesVisible={setCategoriesVisible}
                                        salaryType={salaryType}
                                        setSalaryType={setSalaryType}
                                        salaryFrom={salaryFrom}
                                        setSalaryFrom={setSalaryFrom}
                                        salaryTo={salaryTo}
                                        setSalaryTo={setSalaryTo}
                                        salaryCurrency={salaryCurrency}
                                        setSalaryCurrency={setSalaryCurrency}
                                        currenciesVisible={currenciesVisible}
                                        setCurrenciesVisible={setCurrenciesVisible}
                                        ownTransport={ownTransport}
                                        setOwnTransport={setOwnTransport}
                                        ownTransportVisible={ownTransportVisible}
                                        setOwnTransportVisible={setOwnTransportVisible}
                                        bsnNumber={bsnNumber}
                                        setBsnNumber={setBsnNumber}
                                        bsnNumberVisible={bsnNumberVisible}
                                        setBsnNumberVisible={setBsnNumberVisible}
                                        languages={languages}
                                        setLanguages={setLanguages}
                                        drivingLicences={drivingLicences}
                                        setDrivingLicences={setDrivingLicences}
                                       city={city}
                                       setCountry={setCountry}
                                       setCity={setCity}
                                       submitFilter={submitFilter}
                                       setDistance={setDistance} /> : ''}

        <aside className="userAccount__top flex">
            <span className="userAccount__top__loginInfo">
                Zalogowany w: <span className="bold">Strefa Pracodawcy</span>
            </span>
            <button className="btn btn--filter" onClick={() => { setFiltersVisible(true); }}>
                Filtry wyszukiwania
                <img className="img" src={magnifier} alt="powiększ" />
            </button>
        </aside>

        <button className="userAccount__top--mobile" onClick={() => { setFiltersVisible(true); }}>
            Filtry wyszukiwania
            <img className="img" src={filterIcon} alt="filtry" />
        </button>

        {filtersActive && filteredUsers?.length === 0 && !hasMore ? <h3 className="noOffersFound">
            Nie znaleziono kandydatów o podanych kryteriach
        </h3> : ''}

        <main className="agenciesList flex">
            {!filtersActive ? <InfiniteScroll
                dataLength={users.length ? users.length : 10}
                next={getUsers}
                hasMore={hasMore}
                loader={<div className="center w-100">
                    <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
                </div>}
                endMessage={<span></span>}
            >
                {users?.map((item, index) => {
                    return <UserPreview key={index}
                                          id={item.id}
                                          companyLogo={`${settings.API_URL}/${data.logo}`}
                                          companyName={data.name}
                                          data={JSON.parse(item.data)} />
                })}
            </InfiniteScroll> : <InfiniteScroll
                dataLength={filteredUsers?.length ? filteredUsers.length : 10}
                next={filterUsersWrapper}
                hasMore={hasMore}
                loader={<div className="center w-100">
                    <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
                </div>}
                endMessage={<span></span>}
            >
                {filteredUsers?.map((item, index) => {
                    return <UserPreview key={index}
                                          id={item.id}
                                          companyLogo={`${settings.API_URL}/${data.logo}`}
                                          companyName={data.name}
                                          data={JSON.parse(item.data)} />
                })}
            </InfiniteScroll>}
        </main>
    </div>
};

export default CandidatesList;
