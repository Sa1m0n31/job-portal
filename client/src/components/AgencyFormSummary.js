import React, {useContext} from 'react';
import {LanguageContext} from "../App";

const AgencyFormSummary = () => {
    const { c } = useContext(LanguageContext);

    return <div className="userForm userForm--summary">
        <h4 className="userForm--summary__header userForm--summary__header--marginTop">
            {c.nextActions}
        </h4>
        <div className="userForm--summary__buttons flex">
            <a className="btn btn--userForm btn--widthAuto" href="/dodaj-oferte-pracy">
                {c.addJobOffer}
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--white" href="/konto-agencji">
                {c.seeMyProfile}
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--userFormBack" href="/">
                {c.homepage}
            </a>
        </div>
    </div>
};

export default AgencyFormSummary;
