import React, {useContext, useEffect, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import uploadIcon from '../static/img/upload-icon.svg'
import checkIcon from '../static/img/green-check.svg'
import {numberRange} from "../helpers/others";
import trashIcon from "../static/img/trash.svg";
import {LanguageContext} from "../App";

const UserForm5a = ({setCountriesVisible, setBsnVisible, setDaysVisible, setMonthsVisible, setYearsVisible}) => {
    const { setStep, setSubstep, userData, handleChange, countriesVisible, bsnVisible, daysVisible,
            monthsVisible, yearsVisible
    } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext)

    const [days, setDays] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        setYears(numberRange(new Date().getFullYear(), new Date().getFullYear()+3));
    }, []);

    useEffect(() => {
        const m = userData.birthdayMonth;
        const y = userData.birthdayYear;

        if(m === 0 || m === 2 || m === 4 || m === 6 || m === 7 || m === 9 || m === 11) {
            setDays(Array.from(Array(31).keys()));
        }
        else if(m === 1 && ((y % 4 === 0) && (y % 100 !== 0))) {
            setDays(Array.from(Array(29).keys()));
        }
        else if(m === 1) {
            setDays(Array.from(Array(28).keys()));
        }
        else {
            setDays(Array.from(Array(30).keys()));
        }
    }, [userData.availabilityMonth, userData.availabilityYear]);

    useEffect(() => {
        setDaysVisible(false);
    }, [userData.birthdayDay]);

    useEffect(() => {
        setMonthsVisible(false);
    }, [userData.birthdayMonth]);

    useEffect(() => {
        setYearsVisible(false);
    }, [userData.birthdayYear]);

    return <>
        <div className="userForm userForm--5b userForm--5a">
        <div className="label label--date label--date--address">
            {c.currentLivingPlace}
            <div className="flex">
                <div className="label--date__input label--date__input--country">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                    >
                        {JSON.parse(c.countries)[userData.currentCountry]}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {countriesVisible ? <div className="datepickerDropdown noscroll">
                        {JSON.parse(c.countries)?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { setCountriesVisible(false); handleChange('currentCountry', index); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
                <label>
                    <input className="input input--city"
                           value={userData.currentPostalCode}
                           onChange={(e) => { handleChange('currentPostalCode', e.target.value); }}
                           placeholder={c.postalCode} />
                </label>
                <label>
                    <input className="input input--address"
                           value={userData.currentCity}
                           onChange={(e) => { handleChange('currentCity', e.target.value); }}
                           placeholder={c.city} />
                </label>
            </div>
        </div>

        <div className="label drivingLicenceWrapper">
            {c.bsnNumber}
            <p className="label--extraInfo">
                {c.bsnNumberDescription}
            </p>
            <div className="flex flex--start">
                <div className="label--date__input label--date__input--bool">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setBsnVisible(!bsnVisible); }}
                    >
                        {userData.hasBsnNumber ? c.yes : c.no}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {bsnVisible ? <div className="datepickerDropdown noscroll">
                        <button className="datepickerBtn center"
                                       onClick={() => { setBsnVisible(false); handleChange('hasBsnNumber', !userData.hasBsnNumber); }}>
                            {userData.hasBsnNumber ? c.no : c.yes}
                        </button>
                    </div> : ''}
                </div>

                {userData.hasBsnNumber ? <div className="bsnInputWrapper flex">
                    <label className="bsnInputLabel flex">
                        {userData.bsnNumberDocument ? <>
                            <img className="img" src={checkIcon} alt="dodaj-plik" />
                            {c.documentAdded}
                        </> : <>
                            <img className="img" src={uploadIcon} alt="dodaj-plik" />
                            <input className="input--file"
                                   multiple={false}
                                   onChange={(e) => { handleChange('bsnNumberDocument', e.target.files[0]); }}
                                   type="file" />
                            {window.innerWidth > 576 ? c.addDocument : c.addDocumentShortcut}
                        </>}
                    </label>
                    {userData.bsnNumberDocument ? <button className="deleteSchoolBtn" onClick={() => { handleChange('bsnNumberDocument', null); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button> : ''}
                </div> : ''}
            </div>
            {userData.hasBsnNumber ? <div className="label label--special">
                <input className="input--special"
                       value={userData.bsnNumber}
                       onChange={(e) => { handleChange('bsnNumber', e.target.value); }}
                       placeholder={c.bsnNumberPlaceholder} />
            </div> : ''}
        </div>

        <div className="label label--date">
            <p className="label--extraInfo label--extraInfo--marginBottom">
                {c.whenAreYouReady}
            </p>
            <div className="label--flex">
                {/* DAY */}
                <div className="label--date__input">
                    <button className="datepicker datepicker--day"
                            onClick={(e) => { e.stopPropagation(); setDaysVisible(!daysVisible); }}
                    >
                        {userData.availabilityDay+1}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {daysVisible ? <div className="datepickerDropdown noscroll">
                        {days?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={() => { setDaysVisible(false); handleChange('availabilityDay', item); }}>
                                {item+1}
                            </button>
                        })}
                    </div> : ''}
                </div>
                {/* MONTH */}
                <div className="label--date__input">
                    <button className="datepicker datepicker--month"
                            onClick={(e) => { e.stopPropagation(); setMonthsVisible(!monthsVisible); }}
                    >
                        {JSON.parse(c.months)[userData.availabilityMonth]}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {monthsVisible ? <div className="datepickerDropdown noscroll">
                        {JSON.parse(c.months)?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={() => { setMonthsVisible(false); handleChange('availabilityMonth', index); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
                {/* YEARS */}
                <div className="label--date__input">
                    <button className="datepicker datepicker--year"
                            onClick={(e) => { e.stopPropagation(); setYearsVisible(!yearsVisible); }}
                    >
                        {userData.availabilityYear}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {yearsVisible ? <div className="datepickerDropdown noscroll">
                        {years?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation(); setYearsVisible(false); handleChange('availabilityYear', item); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
            </div>
        </div>

        <div className="label drivingLicenceWrapper drivingLicenceWrapper--noMarginTop">
            <p className="label--extraInfo">
                {c.longTermQuestion}
            </p>
            <div className="flex flex--start">
                <label className={userData.longTermJobSeeker ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('longTermJobSeeker', userData.longTermJobSeeker === true ? null : true); }}>
                        <span></span>
                    </button>
                    {c.yes}
                </label>
                <label className={userData.longTermJobSeeker === false ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('longTermJobSeeker', userData.longTermJobSeeker === false ? null : false); }}>
                        <span></span>
                    </button>
                    {c.no}
                </label>
            </div>
        </div>

        <div className="label drivingLicenceWrapper drivingLicenceWrapper--tools drivingLicenceWrapper--noMarginTop">
            <p className="label--extraInfo">
                {c.ownTransportQuestion}
            </p>
            <div className="flex flex--start">
                <label className={userData.ownTransport ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownTransport', userData.ownTransport === true ? null : true); }}>
                        <span></span>
                    </button>
                    {c.yes}
                </label>
                <label className={userData.ownTransport === false ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownTransport', userData.ownTransport === false ? null : false); }}>
                        <span></span>
                    </button>
                    {c.no}
                </label>
            </div>
        </div>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(3); setSubstep(1); }}>
            {c.back}
        </button>
        <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default UserForm5a;
