import React from 'react';
import LanguageSwitcher from "./LanguageSwitcher";

const LoggedUserFooter = () => {
    return <div className="loggedUserFooter">
        <LanguageSwitcher horizontal={true} />
        <div className="loggedUserFooter__links center">
            <a href="/regulamin" className="loggedUserFooter__links__item">
                Regulamin
            </a>
            <a href="/polityka-prywatnosci" className="loggedUserFooter__links__item">
                Polityka prywatności
            </a>
            <a href="/kontakt" className="loggedUserFooter__links__item">
                Kontakt
            </a>
        </div>
        <h6 className="loggedUserFooter__bottom">
            &copy; {new Date().getFullYear()} Jooob.eu
        </h6>
    </div>
};

export default LoggedUserFooter;
