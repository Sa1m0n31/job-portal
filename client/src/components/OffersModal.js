import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from "../App";
import { updateNotes } from "../helpers/notes";
import Loader from "./Loader";
import {sendMessage} from "../helpers/messages";
import {getJobOffersByAgency} from "../helpers/offer";
import settings from "../static/settings";

const OffersModal = ({closeModal, agencyId, userId, agencyName, userEmail}) => {
    const { c } = useContext(LanguageContext);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [offers, setOffers] = useState([]);
    const [offerId, setOfferId] = useState(-1);

    useEffect(() => {
        getJobOffersByAgency()
            .then((res) => {
                if(res?.status === 200) {
                    setOffers(res?.data);
                }
            });
    }, []);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                closeModal();
            }
        });
    }, []);

    useEffect(() => {
        console.log(agencyName);
    }, [agencyName]);

    const handleSubmit = async () => {
        setLoading(true);

        const offerLink = `${settings.WEBSITE_URL}/oferta-pracy?id=${offerId}`;

        // Append new message to chat column
        const newChat = [{
            fromAgency: true,
            content: `${c.invitationContent}\n\n<a href="${offerLink}">${offerLink}</a>`,
            created_at: new Date(),
            read: false
        }];

        // Send request
        const sendResult = await sendMessage(null, userId, agencyId,
            `${c.invitationTitle} ${agencyName}`, newChat, userEmail);
        if(sendResult.status === 201) {
            setSuccess(true);
            setLoading(false);
        }
        else {
            setLoading(false);
            setError(JSON.parse(c.formErrors)[1]);
        }
    }

    return <div className="modal modal--notes center">
        <div className="modal__inner">
            <button className="modal__inner__closeBtn" onClick={() => { closeModal(); }}>
                &times;
            </button>
            <h4 className="modal__header">
                {c.yourJobOffers}
            </h4>

            <div className="modalOffers__menu scroll">
                {offers?.map((item, index) => {
                    return <button className={offerId === item.id ? "modalOffers__menu__item modalOffers__menu__item--selected" : "modalOffers__menu__item"}
                                   onClick={() => { setOfferId(item.id); }}
                                   key={index}>
                        {item.title}
                    </button>
                })}
            </div>

            {success ? <span className="info info--success">
                {c.messageSend}
            </span> : ''}

            {!loading ? (!success ? <button className="btn btn--modal btn--modalNotes" onClick={() => { handleSubmit(); }}>
                {c.sendInvitation}
            </button> : '') : <div className="center">
                <Loader />
            </div>}
        </div>
    </div>
};

export default OffersModal;
