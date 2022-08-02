import React from 'react';
import logo from '../static/img/logo-niebieskie.png'
import arrow from '../static/img/left-blue-arrow.svg'

const MobileHeader = ({back, loggedUser, loggedAgency}) => {
    const handleBack = () => {
        window.location = back ? back : '/';
    }

    return <div className="mobileHeader">
        <a href="." className="mobileHeader__logo">
            <img className="img" src={logo} alt="jooob.eu" />
        </a>

        {back ? <button className="mobileHeader__backBtn"
                        onClick={() => { handleBack(); }}>
            <img className="img" src={arrow} alt="powrot" />
        </button> : <div className="mobileHeader__right">

        </div>}
    </div>
};

export default MobileHeader;
