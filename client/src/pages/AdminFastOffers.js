import React, {useContext, useEffect, useState} from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import Modal from "../components/Modal";
import {deleteFastOffer, getActiveFastOffers} from "../helpers/offer";
import settings from "../static/settings";
import userPlaceholder from "../static/img/user-placeholder.svg";
import localization from "../static/img/location.svg";
import salaryIcon from "../static/img/dolar-icon.svg";
import {currencies} from "../static/content";
import {LanguageContext} from "../App";

const AdminFastOffers = () => {
    const [offers, setOffers] = useState([]);
    const [deleteSuccess, setDeleteSuccess] = useState(0);
    const [deleteCandidate, setDeleteCandidate] = useState(0);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        getActiveFastOffers()
            .then((res) => {
                if(res?.status === 200) {
                    setOffers(res?.data);
                }
            });
    }, [deleteSuccess]);

    const deleteOfferById = async () => {
        const res = await deleteFastOffer(deleteCandidate, true);
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

        {deleteCandidate ? <Modal header="Czy na pewno chcesz usunąć tę ofertę błyskawiczną?"
                                modalAction={deleteOfferById}
                                 success={deleteSuccess === 1}
                                 closeModal={() => { setDeleteCandidate(0); }}
                                 message={deleteSuccess ? "Oferta została usunięta" : ''}
        /> : ''}

        <main className="adminMain">
            <PanelMenu menuOpen={4} />
            <div className="adminMain__main">
                <h1 className="adminMain__header">
                    Dodane błyskawiczne oferty pracy
                </h1>
                <div className="agenciesList agenciesList--admin agenciesList--fastOffers flex">
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
                                <a href={`/panel/szczegoly-oferty-blyskawicznej?id=${item.offer_id}`}
                                   className="btn btn--white">
                                    Szczegóły oferty
                                </a>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </main>
    </div>
};

export default AdminFastOffers;
