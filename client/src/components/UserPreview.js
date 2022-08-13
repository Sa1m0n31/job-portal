import React, {useEffect} from 'react';
import userPlaceholder from '../static/img/user-placeholder.svg'
import location from '../static/img/location.svg'
import nipIcon from '../static/img/info-icon.svg'
import phoneIcon from '../static/img/phone-grey.svg'
import mailIcon from '../static/img/message-grey.svg'
import websiteIcon from '../static/img/www-icon.svg'
import settings from "../static/settings";
import {categories, countries} from "../static/content";
import eyeIcon from '../static/img/eye-icon.svg'
import messageIcon from '../static/img/message-empty.svg'
import downloadIcon from '../static/img/download-white.svg'

const UserPreview = ({i, id, data}) => {
    useEffect(() => {
        console.log(data);
    }, [data]);

    return data ? <div className="preview preview--agency preview--user flex" key={i}>
        <div className="preview__left">
            <figure className="preview__profileImage">
                <img className="img" src={data?.profileImage ? `${settings.API_URL}/${data.profileImage}` : userPlaceholder} alt="logo" />
            </figure>
            <div className="preview__content">
                <h3 className="preview__fullName">
                    {data?.firstName ? `${data.firstName} ${data?.lastName}` : 'Anonimowy'}
                </h3>

                <div className="preview__buttons preview__buttons--mobile">
                    <a className="btn btn--white"
                       href={`/napisz-wiadomosc?id=${id}`}>
                        <img className="img" src={messageIcon} alt="wiadomość" />
                        Napisz
                    </a>
                    <a className="btn btn--white"
                       href={`/profil-kandydata?id=${id}`}>
                        <img className="img" src={eyeIcon} alt="profil" />
                        Zobacz profil
                    </a>
                </div>

                {data.address || data.postalCode || data.city || data.country ? <p className="preview__data">
                    <img className="img" src={location} alt="lokalizacja" />
                    {data.address ? data.address + ',' : ''} {data.postalCode ? data.postalCode : ''} {data.city}{data.country !== null && data.country !== undefined ? ', ' + countries[data.country] : ''}
                </p> : ''}

                {data.categories?.length ? <p className="preview__data preview__data--nip">
                    <img className="img" src={nipIcon} alt="lokalizacja" />
                    {data.categories.map((item, index, array) => {
                        if(index !== array.length-1) {
                            return `${categories[item]}, `;
                        }
                        else {
                            return categories[item];
                        }
                    })}
                </p> : ''}

                {data.phoneNumber ? <p className="preview__data preview__data--nip">
                    <img className="img" src={phoneIcon} alt="lokalizacja" />
                    {data.phoneNumberCountry} {data.phoneNumber}
                </p> : ''}

                {data.email ? <p className="preview__data preview__data--nip">
                    <img className="img" src={mailIcon} alt="lokalizacja" />
                    {data.email}
                </p> : ''}

                {data.website ? <a className="preview__data preview__data--nip" href={data.website} target="_blank" rel="noreferrer">
                    <img className="img" src={websiteIcon} alt="lokalizacja" />
                    {data.website?.replace('https', '').replace('http', '').replace('://', '')}
                </a> : ''}
            </div>
        </div>

        <div className="preview__buttons">
            <div className="preview__buttons__section">
                Wygeneruj i pobierz CV
                <button className="btn btn--downloadCV">
                    <img className="img" src={downloadIcon} alt="pobierz" />
                    Pobierz CV
                </button>
            </div>

            <div className="preview__buttons__section preview__buttons__section--flex">
                <span className="w-100">
                    Działania
                </span>
                <a className="btn btn--white"
                   href={`/profil-kandydata?id=${id}`}>
                    <img className="img" src={eyeIcon} alt="profil" />
                    Zobacz profil
                </a>
                <a className="btn btn--white"
                   href={`/napisz-wiadomosc?pracownik=${id}`}>
                    <img className="img" src={messageIcon} alt="wiadomość" />
                    Napisz
                </a>
            </div>
        </div>
    </div> : ''
};

export default UserPreview;
