import React from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";
import userIcon from '../static/img/user-icon.svg'
import agencyIcon from '../static/img/enterprise.svg'
import offerIcon from '../static/img/job-description.svg'
import fastOfferIcon from '../static/img/stopwatch.svg'

const AdminPanel = () => {
    return <div className="container">
        <LoggedAdminHeader />
        <main className="adminMain">
            <PanelMenu menuOpen={0} />
            <div className="adminMain__main">
                <h1 className="adminMain__header">
                    Witaj w panelu administratora jooob.eu!
                </h1>
                <div className="adminMain__grid">
                    <a href="/panel/agencje"
                       className="adminMain__grid__item">
                        <img className="img" src={agencyIcon} alt="agencje" />
                        Agencje
                    </a>
                    <a href="/panel/pracownicy"
                       className="adminMain__grid__item">
                        <img className="img" src={userIcon} alt="uzytkownicy" />
                        Kandydaci
                    </a>
                    <a href="/panel/oferty"
                       className="adminMain__grid__item">
                        <img className="img" src={offerIcon} alt="agencje" />
                        Oferty pracy
                    </a>
                    <a href="/panel/oferty-blyskawiczne"
                       className="adminMain__grid__item">
                        <img className="img" src={fastOfferIcon} alt="agencje" />
                        Oferty błyskawiczne
                    </a>
                </div>
            </div>
        </main>
    </div>
};

export default AdminPanel;
