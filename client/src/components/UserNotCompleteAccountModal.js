import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from "../App";
import Loader from "./Loader";
import {registerTestAccount} from "../helpers/user";
import {isEmail} from "../helpers/others";

const UserNotCompleteAccountModal = ({closeModal}) => {
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
            <p>
                <b>{c.profile_popup_header}</b>
            </p>
            <p>
                {c.profile_popup_1}
            </p>
            <p>
                {c.profile_popup_2}
            </p>
            <p>
                {c.profile_popup_3}
            </p>
            <p>
                <b>{c.profile_popup_4}</b>
            </p>
            <p>
                <b>{c.profile_popup_5}</b>
            </p>
            <ul>
                <li>{c.profile_popup_6}</li>
                <li>{c.profile_popup_7}</li>
                <li>{c.profile_popup_8}</li>
            </ul>
            <p>
                <b>{c.profile_popup_9}</b>
            </p>
            <ul>
                <li>{c.profile_popup_10}</li>
                <li>{c.profile_popup_11}</li>
                <li>{c.profile_popup_12}</li>
                <li>{c.profile_popup_13}</li>
                <li>{c.profile_popup_14}</li>
                <li>{c.profile_popup_15}</li>
            </ul>
            <p>
                {c.profile_popup_16}
            </p>
            <p>
                <a href="https://www.youtube.com/watch?app=desktop&v=fJtBRdfXKYU&t" target="_blank">
                    Fill in full profile - Candidates - YouTube
                </a>
            </p>

            <a className="btn btn--modal btn--modalNotes" href="/edycja-danych">
                {c.editProfile}
            </a>
        </div>
    </div>
};

export default UserNotCompleteAccountModal;
