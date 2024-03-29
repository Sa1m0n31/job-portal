import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from "../App";
import Loader from "./Loader";
import {registerTestAccount} from "../helpers/user";
import {isEmail} from "../helpers/others";

const AgencyNotCompleteAccountModal = ({closeModal}) => {
    const { c } = useContext(LanguageContext);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                closeModal();
            }
        });
    }, []);

    return <div className="modal modal--notComplete center">
        <div className="modal__inner">
            <p className="bold">
                {c.agency_popup_1}
            </p>
            <ul className="agencyModalList">
                <li><b>{c.agency_popup_2.split('.')[0]}</b> - {c.agency_popup_2.split('.')[1]}.</li>
                <li><b>{c.agency_popup_3.split('.')[0]}</b> - {c.agency_popup_3.split('.')[1]}.</li>
                <li><b>{c.agency_popup_4.split('.')[0]}</b> - {c.agency_popup_4.split('.')[1]}.</li>
                <li><b>{c.agency_popup_5.split('.')[0]}</b> - {c.agency_popup_5.split('.')[1]}.</li>
            </ul>
            <p className="bold">
                {c.agency_popup_6}
            </p>

            <a className="btn btn--modal btn--modalNotes" href="/edycja-danych-agencji">
                {c.editProfile}
            </a>
        </div>
    </div>
};

export default AgencyNotCompleteAccountModal;
