import React, {useContext} from 'react';
import magnifier from '../static/img/magnifier.svg'
import pen from '../static/img/pen-blue.svg'
import {UserDataContext} from "../pages/UserEditData";

const AgencyFormSummary = () => {
    return <div className="userForm userForm--summary">
        <h4 className="userForm--summary__header userForm--summary__header--marginTop">
            Dalsze działania
        </h4>
        <div className="userForm--summary__buttons flex">
            <a className="btn btn--userForm btn--widthAuto" href="/dodaj-oferte-pracy">
                Dodaj ofertę pracy
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--white" href="/konto-agencji">
                Zobacz mój profil
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--userFormBack" href="/">
                Strona główna
            </a>
        </div>
    </div>
};

export default AgencyFormSummary;
