import React, {useContext} from 'react';
import userPlaceholder from '../static/img/user-placeholder.svg'
import location from '../static/img/location.svg'
import phoneIcon from '../static/img/phone-grey.svg'
import mailIcon from '../static/img/message-grey.svg'
import settings from "../static/settings";
import eyeIcon from '../static/img/eye-icon.svg'
import {LanguageContext} from "../App";

const UserPreviewAdmin = ({i, id, data, blocked, registerDate, email,
                            setBlockCandidate, setUnblockCandidate}) => {
    const { c } = useContext(LanguageContext);

    const addTrailingZero = (n) => {
        if(n < 10) {
            return `0${n}`;
        }
        return n;
    }

    const getDateString = (date) => {
        const dateObject = new Date(date);

        return `${addTrailingZero(dateObject.getDate())}.${addTrailingZero(dateObject.getMonth()+1)}.${dateObject.getFullYear()}, 
        ${addTrailingZero(dateObject.getHours())}:${addTrailingZero(dateObject.getMinutes())}:${addTrailingZero(dateObject.getSeconds())}`;
    }

    return data ? <div className="preview preview--agency preview--admin flex" key={i}>
        <div className="preview__left">
            <figure className="preview__profileImage">
                <img className="img" src={data?.profileImage ? `${settings.API_URL}/${data.profileImage}` : userPlaceholder} alt="logo" />
            </figure>
            <div className="preview__content">
                <h3 className="preview__fullName">
                    {data?.firstName ? data.firstName + ' ' + data.lastName : 'Anonim'}
                </h3>

                {data.address || data.postalCode || data.city || data.country ? <p className="preview__data">
                    <img className="img" src={location} alt="lokalizacja" />
                    {data.address ? data.address + ',' : ''} {data.postalCode ? data.postalCode : ''} {data.city}{data.country !== null && data.country !== undefined && c.countries ? ', ' + JSON.parse(c.countries)[data.country] : ''}
                </p> : ''}

                {data.phoneNumber ? <p className="preview__data preview__data--nip">
                    <img className="img" src={phoneIcon} alt="lokalizacja" />
                    {data.phoneNumberCountry} {data.phoneNumber}
                </p> : ''}

                {email ? <p className="preview__data preview__data--nip">
                    <img className="img" src={mailIcon} alt="lokalizacja" />
                    {email}
                </p> : ''}

                {registerDate ? <p className="preview__data preview__data--nip">
                    <span className="registerDateTime">
                        Zarejestrowany:
                    </span>
                    {getDateString(registerDate)}
                </p> : ''}
            </div>
        </div>

        <div className="preview__buttons preview__buttons--admin flex flex--end">
            <div className="preview__col">
                <span className="preview__col__key">
                    Blokada konta
                </span>
                {blocked ? <button className="btn btn--unblock"
                                   onClick={() => { setUnblockCandidate(id); }}>
                    Odblokuj konto
                </button> : <button className="btn btn--block"
                                    onClick={() => { setBlockCandidate(id); }}>
                    Zablokuj konto
                </button>}
            </div>

            <div className="preview__col">
                <span className="preview__col__key">
                    Szczegóły profilu
                </span>
                <a className="btn btn--white"
                   href={`/panel/profil-pracownika?id=${id}`}>
                    <img className="img" src={eyeIcon} alt="profil" />
                    Zobacz profil
                </a>
            </div>
        </div>
    </div> : ''
};

export default UserPreviewAdmin;
