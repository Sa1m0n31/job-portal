import React from 'react';
import LanguageSwitcher from "./LanguageSwitcher";

const LoginAndRegisterAside = () => {
    return <aside className="login__left__bottom flex">
        <div className="login__left__bottom__links flex">
            <a href="/polityka-prywatnosci">
                Polityka prywatności
            </a>
            <a href="/polityka-prywatnosci">
                Regulamin portalu
            </a>
        </div>

        <LanguageSwitcher horizontal={true} />
    </aside>
};

export default LoginAndRegisterAside;
