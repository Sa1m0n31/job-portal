import React, {useContext, useEffect, useState} from 'react';
import magnifier from '../static/img/magnifier.svg'
import pen from '../static/img/pen-blue.svg'
import {UserDataContext} from "../pages/UserEditData";
import CV from "./CV";
import {getDate} from "../helpers/others";
import {countries, currencies, noInfo} from "../static/content";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {LanguageContext} from "../App";

const UserFormSummary = () => {
    const { userData } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    const [data, setData] = useState({});

    useEffect(() => {
        setData(userData);
    }, [userData]);

    return <div className="userForm userForm--summary">
        <h3 className="userForm--summary__header">
            {c.yourGeneratedCV}
        </h3>
        <div className="userForm--summary__buttons flex">
            {data?.certificates ? <PDFDownloadLink document={<CV profileImage={data?.profileImageUrl}
                                                                 c={c}
                                                                 fullName={`${data.firstName} ${data.lastName}`}
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
                                                                 location={data.country >= 0 ? `${data.city}, ${countries[data.country]}` : c.noInfo}
                                                                 currentPlace={data.currentCountry >= 0 ? `${countries[data.currentCountry]}, ${data.currentCity}`: c.noInfo}
                                                                 availability={data.availabilityDay >= 0 ? getDate(data?.availabilityDay, data?.availabilityMonth, data?.availabilityYear) : c.noInfo}
                                                                 ownAccommodation={data.ownAccommodation ? data.accommodationPlace : ''}
                                                                 ownTools={data.ownTools ? c.yes : ''}
                                                                 salary={data.salaryFrom && data.salaryTo ? `${data.salaryFrom} - ${data.salaryTo} ${data.salaryCurrency >= 0 ? currencies[data.salaryCurrency] : 'EUR'} ${c.netto}/${data.salaryType === 0 ? c.monthlyShortcut : c.weeklyShortcut}` : c.noInfo}
            />}
                                                   fileName={`CV-${data.firstName}_${data.lastName}.pdf`}
                                                   className="btn btn--downloadCV">
                <img className="img" src={magnifier} alt="pobierz" />
                {c.preview}
            </PDFDownloadLink> : ''}
            <button className="btn btn--userForm btn--white" onClick={() => { window.location.reload(); }}>
                {c.edition}
                <img className="img" src={pen} alt="edytuj" />
            </button>
        </div>

        <h4 className="userForm--summary__header userForm--summary__header--marginTop">
            {c.nextActions}
        </h4>
        <div className="userForm--summary__buttons flex">
            <a className="btn btn--userForm btn--widthAuto" href="/oferty-pracy">
                {c.seeJobOffers}
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--white" href="/konto-pracownika">
                {c.myAccount}
            </a>
            <a className="btn btn--userForm btn--widthAuto btn--userFormBack" href="/">
                {c.homepage}
            </a>
        </div>
    </div>
};

export default UserFormSummary;
