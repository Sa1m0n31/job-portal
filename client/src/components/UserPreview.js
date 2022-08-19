import React, {useEffect} from 'react';
import userPlaceholder from '../static/img/user-placeholder.svg'
import location from '../static/img/location.svg'
import nipIcon from '../static/img/info-icon.svg'
import phoneIcon from '../static/img/phone-grey.svg'
import mailIcon from '../static/img/message-grey.svg'
import websiteIcon from '../static/img/www-icon.svg'
import settings from "../static/settings";
import {categories, countries, noInfo, preferableContactForms} from "../static/content";
import eyeIcon from '../static/img/eye-icon.svg'
import messageIcon from '../static/img/message-empty.svg'
import downloadIcon from '../static/img/download-white.svg'
import {PDFDownloadLink} from "@react-pdf/renderer";
import CV from "./CV";
import {getDate} from "../helpers/others";
import downloadWhite from "../static/img/download-white.svg";

const UserPreview = ({i, id, data, application, companyLogo, companyName}) => {
    return data ? <div className={application ? "preview preview--agency preview--user flex flex-wrap" : "preview preview--agency preview--user flex"} key={i}>
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
                       href={`/nowa-wiadomosc?kandydat=${id}`}>
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
            {data?.firstName && data?.lastName ? <div className="preview__buttons__section preview__buttons__section--cv">
                Wygeneruj i pobierz CV:
                <PDFDownloadLink document={<CV profileImage={`${settings.API_URL}/${data?.profileImage}`}
                                                       fullName={`${data.firstName} ${data.lastName}`}
                                                       companyName={companyName}
                                                       companyLogo={companyLogo}
                                                       categories={data.categories}
                                                       email={data.email}
                                                       birthday={getDate(data?.birthdayDay, data?.birthdayMonth, data?.birthdayYear)}
                                                       schools={data.schools}
                                                       jobs={data.jobs}
                                                       additionalLanguages={data.extraLanguages}
                                                       languages={data.languages}
                                                       drivingLicence={data.drivingLicenceCategories}
                                                       certs={data.certificates?.concat(data.courses)}
                                                       desc={data.situationDescription}
                                                       phoneNumber={data.phoneNumber ? `${data.phoneNumberCountry} ${data.phoneNumber}` : noInfo}
                                                       location={data.country >= 0 ? `${data.city}, ${countries[data.country]}` : noInfo}
                                                       currentPlace={data.currentCountry >= 0 ? `${countries[data.currentCountry]}, ${data.currentCity}`: noInfo}
                                                       availability={data.availabilityDay >= 0 ? getDate(data?.availabilityDay, data?.availabilityMonth, data?.availabilityYear) : noInfo}
                                                       ownAccommodation={data.ownAccommodation ? data.accommodationPlace : ''}
                                                       ownTools={data.ownTools ? 'Tak' : ''}
                                                       salary={data.salaryFrom && data.salaryTo ? `${data.salaryFrom} - ${data.salaryTo} ${data.salaryCurrency} netto/${data.salaryType === 0 ? 'mies.' : 'tyg.'}` : noInfo}
                />}
                                         fileName={`CV-${data.firstName}_${data.lastName}.pdf`}
                                         className="btn btn--downloadCV">
                    <img className="img" src={downloadWhite} alt="pobierz" />
                    Pobierz CV
                </PDFDownloadLink>
            </div> : ''}

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
                   href={`/nowa-wiadomosc?kandydat=${id}`}>
                    <img className="img" src={messageIcon} alt="wiadomość" />
                    Napisz
                </a>
            </div>
        </div>

        {application ? <div className="preview__bottom">
            <div className="preview__bottom__section">
                <h4 className="preview__bottom__header">
                    Wiadomość
                </h4>
                <div className="preview__bottom__content">
                    {application.message}
                </div>
            </div>
            <div className="preview__bottom__section">
                <h4 className="preview__bottom__header">
                    Preferowana forma kontaktu
                </h4>
                <div className="preview__bottom__content">
                    {application.preferableContact?.map((item, index, array) => {
                        if(index === array.length-1) {
                            return preferableContactForms[item];
                        }
                        else {
                            return preferableContactForms[item] + ', ';
                        }
                    })}
                </div>
            </div>
            {application?.attachments?.length ? <div className="preview__bottom__section">
                <h3 className="preview__bottom__header">
                    Załączniki
                </h3>
                <div className="jobOffer__section__text jobOffer__section__text--attachments">
                    {application.attachments?.map((item, index) => {
                        return <a href={`${settings.API_URL}/uploads/offer/${item.path}`}
                                  download
                                  target="_blank"
                            // download={`${item.path.replace(`-${item.path.split('-')?.slice(-1)[0]}`, '')}.${item.path.split('.').slice(-1)[0]}`.split('\\').slice(-1)[0]}
                                  key={index}
                                  className="jobOffer__attachmentBtn">
                            <img className="img" src={downloadIcon} alt="pobierz" />
                            {item.name}
                        </a>
                    })}
                </div>
            </div> : ''}
        </div> : ''}
    </div> : ''
};

export default UserPreview;
