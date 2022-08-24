import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {deleteFastOffer, getFastJobOffersByAgency} from "../helpers/offer";
import localization from '../static/img/location.svg'
import settings from "../static/settings";
import {currencies} from "../static/content";
import salaryIcon from '../static/img/dolar-icon.svg'
import magnifier from '../static/img/magnifier.svg'
import pen from '../static/img/pen.svg'
import trash from '../static/img/trash.svg'
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import userPlaceholder from '../static/img/user-placeholder.svg'
import {LanguageContext} from "../App";

const MyFastJobOffers = ({data}) => {
    const [offers, setOffers] = useState([]);
    const [render, setRender] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [deleteSuccessful, setDeleteSuccessful] = useState(false);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        getFastJobOffersByAgency()
            .then((res) => {
                if(res?.status === 200) {
                    setOffers(res?.data);
                }
                setRender(true);
            })
            .catch((err) => {
                setRender(true);
            });
    }, [deleteSuccessful]);

    const openDeleteModal = (i) => {
        setDeleteCandidate(i);
        setDeleteModal(true);
    }

    const deleteJobOffer = () => {
        deleteFastOffer(deleteCandidate)
            .then((res) => {
                if(res?.status === 200) {
                    setDeleteMessage(c.offerDeleted);
                    setDeleteSuccessful(!deleteSuccessful);
                }
                else {
                    setDeleteMessage(JSON.parse(c.formErrors)[1]);
                }
            })
            .catch((err) => {
                setDeleteMessage(JSON.parse(c.formErrors)[1]);
            });
    }

    const closeModal = () => {
        setDeleteModal(false);
        setDeleteMessage('');
        setDeleteCandidate(0);
    }

    return <div className="container container--agencyJobOffers">
        <LoggedUserHeader data={data} agency={true} />

        {deleteModal ? <Modal header={c.deleteOfferModal}
                        message={deleteMessage}
                        closeModal={closeModal}
                        modalAction={deleteJobOffer}
        /> : ''}

        <aside className="userAccount__top flex">
                <span className="userAccount__top__loginInfo">
                    {c.loggedIn}: <span className="bold">{c.agencyZone}</span>
                </span>
        </aside>
        {render ? <div className="userAccount__top userAccount__top--offersInfo flex">
            <h1 className="userAccount__top__jobOffersHeader">
                {c.yourFastOffersHeader}
            </h1>
        </div> : ''}
        {render ? offers?.map((item, index) => {
            return <div className="offerItem flex" key={index}>
                <span className="offerItem__date">
                    {item.created_at?.substring(0, 10)}
                </span>
                <div className="offerItem__left">
                    <figure className="offerItem__figure">
                        <img className="img" src={data?.logo ? `${settings.API_URL}/${data?.logo}` : userPlaceholder} alt="zdjecie-profilowe" />
                    </figure>
                    <div className="offerItem__mainInfo">
                        <h2 className="offerItem__title">
                            {item.title}
                        </h2>
                        <h3 className="offerItem__localization">
                            <img className="icon" src={localization} alt="lokalizacja" />
                            {item.city}, {JSON.parse(c.countries)[item.country]}
                        </h3>
                        <h5 className="offerItem__company">
                            {data.name}
                        </h5>
                    </div>
                </div>
                <div className="offerItem__category">
                    {JSON.parse(c.categories)[item.category]}
                </div>
                <div className="offerItem__salary">
                    <span className="nowrap">
                        <img className="icon" src={salaryIcon} alt="wynagrodzenie" />
                        {item.salaryFrom} {currencies[item.salaryCurrency]}
                    </span> - {item.salaryTo} {currencies[item.salaryCurrency]}
                    <span className="netto">
                        {c.netto}/{item.salaryType === 1 ? c.weeklyShortcut : c.monthlyShortcut}
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
                    <a href={`/blyskawiczna-oferta-pracy?id=${item.id}`}
                       className="btn btn--white">
                        {c.preview}
                        <img className="img" src={magnifier} alt="podglad" />
                    </a>
                    <a href={`/edycja-blyskawicznej-oferty-pracy?id=${item.id}`}
                       className="btn">
                        {c.edition}
                        <img className="img" src={pen} alt="podglad" />
                    </a>
                    <button onClick={() => { openDeleteModal(item.id); }}
                       className="btn btn--grey">
                        {c.delete}
                        <img className="img" src={trash} alt="podglad" />
                    </button>
                </div>
            </div>
        }) : <div className="center">
            <Loader />
        </div>}
    </div>
};

export default MyFastJobOffers;
