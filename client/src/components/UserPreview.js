import React, {useContext, useEffect, useState} from 'react';
import userPlaceholder from '../static/img/user-placeholder.svg'
import location from '../static/img/location.svg'
import nipIcon from '../static/img/info-icon.svg'
import phoneIcon from '../static/img/phone-grey.svg'
import mailIcon from '../static/img/message-grey.svg'
import websiteIcon from '../static/img/www-icon.svg'
import settings from "../static/settings";
import eyeIcon from '../static/img/eye-icon.svg'
import messageIcon from '../static/img/message-empty.svg'
import downloadIcon from '../static/img/download-white.svg'
import {PDFDownloadLink} from "@react-pdf/renderer";
import CV from "./CV";
import {getDate} from "../helpers/others";
import downloadWhite from "../static/img/download-white.svg";
import {LanguageContext} from "../App";
import Loader from "./Loader";
import {currencies} from "../static/content";
import DeleteModal from "./DeleteModal";
import {hideApplication, hideFastApplication} from "../helpers/offer";

const UserPreview = ({i, id, data, application, companyLogo, companyName, deleteFromOffer, deleteFromFastOffer}) => {
    const { c } = useContext(LanguageContext);

    const [loading, setLoading] = useState(false);
    const [downloadCV, setDownloadCV] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [removeSuccess, setRemoveSuccess] = useState(false);
    const [removeApplicationModal, setRemoveApplicationModal] = useState(false);

    const generateCV = () => {
        setDownloadCV(true);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const removeApplication = () => {
        setRemoveApplicationModal(true);
    }

    const removeUserApplication = () => {
        console.log(deleteFromFastOffer);
        if(deleteFromFastOffer) {
            hideFastApplication(application.id, id)
                .then((res) => {
                   if(res?.status === 201) {
                       setRemoveSuccess(true);
                   }
                });
        }
        else {
            hideApplication(application.id, id)
                .then((res) => {
                    if(res?.status === 201) {
                        setRemoveSuccess(true);
                    }
                });
        }
    }

    return data ? <div className={application ? "preview preview--agency preview--user flex flex-wrap" : "preview preview--agency preview--user flex"} key={i}>
        {application ? <button className="btn btn--removeApplication" onClick={() => { removeApplication(); }}>
            &times;
        </button> : ''}

        {removeApplicationModal ? <DeleteModal closeModal={() => { setRemoveApplicationModal(false); }}
                                               modalAction={removeUserApplication}
                                               header={c.deleteApplication1}
                                               message={c.deleteApplication2}
                                               success={removeSuccess} /> : ''}

        <div className="preview__left">
            <figure className="preview__profileImage">
                <img className="img" src={data?.profileImage ? `${settings.API_URL}/${data.profileImage}` : userPlaceholder} alt="logo" />
            </figure>
            <div className="preview__content">
                <h3 className="preview__fullName">
                    {data?.firstName ? `${data.firstName} ${data?.lastName}` : c.anonim}
                </h3>

                <div className="preview__buttons preview__buttons--mobile">
                    <a className="btn btn--white"
                       href={`/nowa-wiadomosc?kandydat=${id}`}>
                        <img className="img" src={messageIcon} alt="wiadomość" />
                        {c.write}
                    </a>
                    <a className="btn btn--white"
                       href={`/profil-kandydata?id=${id}`}>
                        <img className="img" src={eyeIcon} alt="profil" />
                        {c.seeProfile}
                    </a>
                </div>

                {data.address || data.postalCode || data.city || data.country ? <p className="preview__data">
                    <img className="img" src={location} alt="lokalizacja" />
                    {data.address ? data.address + ',' : ''} {data.postalCode ? data.postalCode : ''} {data.city}{data.country !== null && data.country !== undefined ? ', ' + JSON.parse(c.countries)[data.country] : ''}
                </p> : ''}

                {data.categories?.length ? <p className="preview__data preview__data--nip">
                    <img className="img" src={nipIcon} alt="lokalizacja" />
                    {data.categories.map((item, index, array) => {
                        if(index !== array.length-1) {
                            return `${JSON.parse(c.categories)[item]}, `;
                        }
                        else {
                            return JSON.parse(c.categories)[item];
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
                {c.generateAndDownloadCV}:

                {loading ? <div className="preview__loader">
                    <Loader />
                </div> : ''}

                {downloadCV ? <PDFDownloadLink document={<CV profileImage={`${settings.API_URL}/${data?.profileImage}`}
                                                             c={c}
                                                             enableDownload={() => { setDisabled(false); }}
                                                             translate={true}
                                                             fullName={data.firstName ? `${data.firstName} ${data.lastName}` : c.anonim}
                                                             // companyName={companyName}
                                                             // companyLogo={companyLogo}
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
                                                             phoneNumber={data.phoneNumber ? `${data.phoneNumberCountry} ${data.phoneNumber}` : c.noInfo}
                                                             location={data.country >= 0 ? `${data.address}, ${data.city}, ${JSON.parse(c.countries)[data.country]}` : c.noInfo}
                                                             currentPlace={data.currentCountry >= 0 ? `${JSON.parse(c.countries)[data.currentCountry]}, ${data.currentCity}`: c.noInfo}
                                                             availability={data.availabilityDay >= 0 ? getDate(data?.availabilityDay, data?.availabilityMonth, data?.availabilityYear) : c.noInfo}
                                                             ownAccommodation={data.ownAccommodation ? data.accommodationPlace : ''}
                                                             ownTools={data.ownTools ? c.yes : ''}
                                                             salary={data.salaryFrom && data.salaryTo ? `${data.salaryFrom} - ${data.salaryTo} ${data.salaryCurrency >= 0 ? currencies[data.salaryCurrency] : 'EUR'} ${c.netto}/${data.salaryType === 0 ? c.monthlyShortcut : c.weeklyShortcut}` : c.noInfo}
                                                             />}
                                               fileName={`CV-${data.firstName}_${data.lastName}.pdf`}
                                               className={disabled || loading ? "btn btn--downloadCV btn--disabled" : "btn btn--downloadCV"}>
                    <img className="img" src={downloadWhite} alt="pobierz" />
                    {c.downloadCV}
                </PDFDownloadLink> : <button className="btn btn--downloadCV" onClick={() => { generateCV(); }}>
                    {c.generateCV}
                </button>}
            </div> : ''}

            <div className="preview__buttons__section preview__buttons__section--flex">
                <span className="w-100">
                    {c.actions}
                </span>
                <a className="btn btn--white"
                   href={`/profil-kandydata?id=${id}`}>
                    <img className="img" src={eyeIcon} alt="profil" />
                    {c.seeProfile}
                </a>
                <a className="btn btn--white"
                   href={`/nowa-wiadomosc?kandydat=${id}`}>
                    <img className="img" src={messageIcon} alt="wiadomość" />
                    {c.write}
                </a>
            </div>
        </div>

        {application ? <div className="preview__bottom">
            {application.message ? <div className="preview__bottom__section">
                <h4 className="preview__bottom__header">
                    {c.message}
                </h4>
                <div className="preview__bottom__content">
                    {application.message}
                </div>
            </div> : ''}
            {/*{application.friendLink ? <div className="preview__bottom__section">*/}
            {/*    <h4 className="preview__bottom__header">*/}
            {/*        {c.friendLink}*/}
            {/*    </h4>*/}
            {/*    <a className="preview__bottom__content" href={application.friendLink}>*/}
            {/*        {application.friendLink}*/}
            {/*    </a>*/}
            {/*</div> : ''}*/}
            {/*<div className="preview__bottom__section">*/}
            {/*    <h4 className="preview__bottom__header">*/}
            {/*        {c.preferableContact}*/}
            {/*    </h4>*/}
            {/*    <div className="preview__bottom__content">*/}
            {/*        {application.preferableContact?.map((item, index, array) => {*/}
            {/*            if(index === array.length-1) {*/}
            {/*                return JSON.parse(c.preferableContactForms)[item];*/}
            {/*            }*/}
            {/*            else {*/}
            {/*                return JSON.parse(c.preferableContactForms)[item] + ', ';*/}
            {/*            }*/}
            {/*        })}*/}
            {/*    </div>*/}
            {/*</div>*/}
            {application?.attachments?.length ? <div className="preview__bottom__section">
                <h3 className="preview__bottom__header">
                    {c.attachments}
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
