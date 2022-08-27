import React, {useState} from 'react';
import MobileHeader from "./MobileHeader";
import logo from "../static/img/logo-czarne.png";
import userPlaceholder from "../static/img/user-placeholder.svg";
import arrowDown from "../static/img/arrow-down.svg";
import logoutIcon from "../static/img/logout.svg";
import {logoutAdmin} from "../helpers/admin";

const LoggedAdminHeader = () => {
    const [dropdown, setDropdown] = useState(false);

    return <header className="loggedUserHeader loggedUserHeader--admin" onClick={() => { setDropdown(false); }}>
        <MobileHeader loggedAdmin={true} />

        <div className="loggedUserHeader__desktop flex">
            <a href="/panel" className="logo">
                PANEL ADMINISTRATORA
            </a>

            <div className="rel">
                <button className="loggedUserHeader__userBtn flex" onClick={(e) => { e.stopPropagation(); setDropdown(!dropdown); }}>
                    <figure>
                        <img className="img"
                             src={userPlaceholder}
                             alt="zdjecie-profilowe" />
                    </figure>
                    <span className="loggedUserHeader__fullName">
                        Menu
                    </span>
                    <img className="arrowImg" src={arrowDown} alt="rowiń" />
                </button>

                {dropdown ? <div className="loggedUserHeader__userDropdownMenu">
                    <button onClick={() => { logoutAdmin(); }}
                            className="loggedUserHeader__userDropdownMenu__item">
                        Wyloguj się
                        <img className="img" src={logoutIcon} alt="wyloguj-sie" />
                    </button>
                </div> : ''}
            </div>
        </div>
    </header>
};

export default LoggedAdminHeader;
