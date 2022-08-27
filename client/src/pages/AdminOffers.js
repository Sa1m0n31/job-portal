import React, {useContext, useEffect, useState} from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import {getAllAgencies} from "../helpers/agency";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Modal from "../components/Modal";
import {blockUser,unblockUser} from "../helpers/admin";
import {getAllUsers} from "../helpers/user";
import UserPreviewAdmin from "../components/UserPreviewAdmin";
import {deleteOffer, getAllOffers} from "../helpers/offer";
import settings from "../static/settings";
import userPlaceholder from "../static/img/user-placeholder.svg";
import localization from "../static/img/location.svg";
import salaryIcon from "../static/img/dolar-icon.svg";
import {currencies} from "../static/content";
import {isElementInArray} from "../helpers/others";
import {LanguageContext} from "../App";

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [deleteSuccess, setDeleteSuccess] = useState(0);
    const [deleteCandidate, setDeleteCandidate] = useState(0);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        setHasMore(true);
        getAllOffers(1)
            .then((res) => {
                if(res?.status === 200) {
                    setOffers(res?.data);
                }
            });
        setPage(2);
    }, [deleteSuccess]);

    const getOffers = async () => {
        const newAgenciesResponse = await getAllOffers(page);
        const newAgencies = newAgenciesResponse.data;

        if(newAgencies.length) {
            await setOffers(prevState => ([...prevState, ...newAgencies]));
        }
        else {
            await setHasMore(false);
        }
        await setPage(prevState => (prevState+1));
    }

    const deleteOfferById = async () => {
        const res = await deleteOffer(deleteCandidate, true);
        if(res?.status === 201) {
            setDeleteSuccess(1);
        }
        else {
            setDeleteSuccess(-1);
        }
    }

    useEffect(() => {
        setDeleteSuccess(0);
    }, [deleteCandidate]);

    return <div className="container">
        <LoggedAdminHeader />

        {deleteCandidate ? <Modal header="Czy na pewno chcesz usunąć tę ofertę?"
                                modalAction={deleteOfferById}
                                 success={deleteSuccess === 1}
                                 closeModal={() => { setDeleteCandidate(0); }}
                                 message={deleteSuccess ? "Oferta została usunięta" : ''}
        /> : ''}

        <main className="adminMain">
            <PanelMenu menuOpen={3} />
            <div className="adminMain__main">
                <h1 className="adminMain__header">
                    Dodane oferty pracy
                </h1>
                <div className="agenciesList agenciesList--admin flex">
                    <InfiniteScroll
                        dataLength={offers.length ? offers.length : 10}
                        next={getOffers}
                        hasMore={hasMore}
                        loader={<div className="center w-100">
                            <Loader type="ThreeDots" color="#ad946d" height={80} width={80} />
                        </div>}
                        endMessage={<span></span>}
                    >
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

                                <div className="offerItem__buttons offerItem__buttons--user flex">
                                    <button onClick={() => { setDeleteCandidate(item.offer_id); }}
                                       className="btn btn--modal--delete">
                                        Usuń ofertę
                                    </button>
                                    <a href={`/panel/szczegoly-oferty-pracy?id=${item.offer_id}`}
                                       className="btn btn--white">
                                        Szczegóły oferty
                                    </a>
                                </div>
                            </div>
                        })}
                    </InfiniteScroll>
                </div>
            </div>
        </main>
    </div>
};

export default AdminOffers;
