import React, {useContext} from 'react';
import LanguageSwitcher from "./LanguageSwitcher";
import {LanguageContext} from "../App";

const LoggedUserFooter = () => {
    const { c } = useContext(LanguageContext);

    return <div className="loggedUserFooter">
        <LanguageSwitcher horizontal={true} />
        <div className="loggedUserFooter__links center">
            <a href="/regulamin" className="loggedUserFooter__links__item">
                {c.termsOfServiceHeader}
            </a>
            <a href="/polityka-prywatnosci" className="loggedUserFooter__links__item">
                {c.privacyPolicyHeader}
            </a>
            <a href="/kontakt" className="loggedUserFooter__links__item">
                {c.contact}
            </a>
        </div>
        <h6 className="loggedUserFooter__bottom">
            &copy; {new Date().getFullYear()} Jooob.eu
        </h6>
    </div>
};

export default LoggedUserFooter;
