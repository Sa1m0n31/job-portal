import React, {useContext} from 'react';
import LanguageSwitcher from "./LanguageSwitcher";
import {LanguageContext} from "../App";

const LoginAndRegisterAside = () => {
    const { c } = useContext(LanguageContext);

    return <aside className="login__left__bottom flex">
        <div className="login__left__bottom__links flex">
            <a href="/polityka-prywatnosci">
                {c.privacyPolicyHeader}
            </a>
            <a href="/polityka-prywatnosci">
                {c.termsOfServiceHeader}
            </a>
        </div>

        <LanguageSwitcher horizontal={true} />
    </aside>
};

export default LoginAndRegisterAside;
