import React, {useContext} from 'react';
import magnifier from '../static/img/magnifier.svg'
import pen from '../static/img/pen-blue.svg'
import {UserDataContext} from "../pages/UserEditData";

const UserFormSummary = () => {
    const { setStep } = useContext(UserDataContext);

    const showCV = () => {

    }

    return <div className="userForm userForm--summary">
        <h3 className="userForm--summary__header">
            Twoje wygenerowane CV
        </h3>
        <div className="userForm--summary__buttons flex">
            <button className="btn btn--userForm" onClick={() => { showCV(); }}>
                Podgląd
                <img className="img" src={magnifier} alt="powieksz" />
            </button>
            <button className="btn btn--userForm btn--white" onClick={() => { window.location.reload(); }}>
                Edycja
                <img className="img" src={pen} alt="edytuj" />
            </button>
        </div>

        <h4 className="userForm--summary__header userForm--summary__header--marginTop">
            Dalsze działania
        </h4>
        <div className="userForm--summary__buttons flex">
            <a className="btn btn--userForm btn--widthAuto" href="/oferty-pracy">
                Przeglądaj oferty pracy
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--white" href="/moj-profil">
                Zobacz mój profil
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--userFormBack" href="/">
                Strona główna
            </a>
        </div>
    </div>
};

export default UserFormSummary;
