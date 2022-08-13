import React from 'react';
import userPlaceholder from '../static/img/user-placeholder.svg'
import location from '../static/img/location.svg'
import nipIcon from '../static/img/info-icon.svg'
import phoneIcon from '../static/img/phone-grey.svg'
import mailIcon from '../static/img/message-grey.svg'
import websiteIcon from '../static/img/www-icon.svg'
import settings from "../static/settings";
import {countries} from "../static/content";
import eyeIcon from '../static/img/eye-icon.svg'
import messageIcon from '../static/img/message-empty.svg'

const AgencyPreview = ({i, id, data}) => {
    return data ? <div className="preview preview--agency flex" key={i}>
        <div className="preview__left">
            <figure className="preview__profileImage">
                <img className="img" src={data?.logo ? `${settings.API_URL}/${data.logo}` : userPlaceholder} alt="logo" />
            </figure>
            <div className="preview__content">
                <h3 className="preview__fullName">
                    {data?.name}
                </h3>

                <div className="preview__buttons preview__buttons--mobile">
                    <a className="btn btn--white"
                       href={`/napisz-wiadomosc?agencja=${id}`}>
                        <img className="img" src={messageIcon} alt="wiadomość" />
                        Napisz
                    </a>
                    <a className="btn btn--white"
                       href={`/profil-agencji?id=${id}`}>
                        <img className="img" src={eyeIcon} alt="profil" />
                        Zobacz profil
                    </a>
                </div>

                {data.address || data.postalCode || data.city || data.country ? <p className="preview__data">
                    <img className="img" src={location} alt="lokalizacja" />
                    {data.address ? data.address + ',' : ''} {data.postalCode ? data.postalCode : ''} {data.city}{data.country !== null && data.country !== undefined ? ', ' + countries[data.country] : ''}
                </p> : ''}

                {data.nip ? <p className="preview__data preview__data--nip">
                    <img className="img" src={nipIcon} alt="lokalizacja" />
                    {data.nip}
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
            <a className="btn btn--white"
               href={`/napisz-wiadomosc?agencja=${id}`}>
                <img className="img" src={messageIcon} alt="wiadomość" />
                Napisz
            </a>
            <a className="btn btn--white"
               href={`/profil-agencji?id=${id}`}>
                <img className="img" src={eyeIcon} alt="profil" />
                Zobacz profil
            </a>
        </div>
    </div> : ''
};

export default AgencyPreview;
