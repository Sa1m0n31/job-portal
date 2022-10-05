import React, {useContext, useEffect, useState} from 'react';
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import {UserDataContext} from "../pages/UserEditData";
import {phoneNumbers} from "../static/content";
import {numberRange} from "../helpers/others";
import plusIcon from "../static/img/plus-icon-opacity.svg";
import trashIcon from "../static/img/trash.svg";
import {LanguageContext} from "../App";

const UserForm1 = ({setDaysVisible, handleFileUpload, removeProfileImage, setMonthsVisible, setYearsVisible, setCountriesVisible, setPhoneNumbersCountriesVisible}) => {
    const { setStep, userData, handleChange, countriesVisible,
        daysVisible, monthsVisible, yearsVisible, phoneNumbersCountriesVisible
    } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    const [days, setDays] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        setYears(numberRange(1900, new Date().getFullYear()-14).reverse());
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
    }, [userData.birthdayMonth, userData.birthdayYear]);

    useEffect(() => {
        setDaysVisible(false);
    }, [userData.birthdayDay]);

    useEffect(() => {
        setMonthsVisible(false);
    }, [userData.birthdayMonth]);

    useEffect(() => {
        setYearsVisible(false);
    }, [userData.birthdayYear]);

    useEffect(() => {
        setCountriesVisible(false);
    }, [userData.country]);

    const validateData = () => {
        setStep(1);
    }

    return <>
        <div className="userForm userForm--1">
            <div className="label">
                {c.profileImage}
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    {c.profileImageDescription}
                </p>
                <div className={!userData?.profileImageUrl ? "filesUploadLabel center" : "filesUploadLabel filesUploadLabel--noBorder center"}>
                    {!userData.profileImageUrl ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : <div className="filesUploadLabel__profileImage">
                        <button className="removeProfileImageBtn" onClick={() => { removeProfileImage(); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={userData?.profileImageUrl} alt="zdjecie-profilowe" />
                    </div>}
                    <input className="input input--file"
                           type="file"
                           multiple={false}
                           onChange={(e) => { handleFileUpload(e); }} />
                </div>
            </div>

        <label className="label">
            {c.firstName} *
            <input className="input"
                   value={userData.firstName}
                   onChange={(e) => { handleChange('firstName', e.target.value); }} />
        </label>
        <label className="label">
            {c.lastName} *
            <input className="input"
                   value={userData.lastName}
                   onChange={(e) => { handleChange('lastName', e.target.value); }} />
        </label>
        <div className="label label--date">
            {c.birthday} *
            <div className="label--flex">
                {/* DAY */}
                <div className="label--date__input">
                    <button className="datepicker datepicker--day"
                            onClick={(e) => { e.stopPropagation(); setDaysVisible(!daysVisible); }}
                    >
                        {userData.birthdayDay >= 0 ? userData.birthdayDay+1 : 1}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {daysVisible ? <div className="datepickerDropdown noscroll">
                        {days?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { handleChange('birthdayDay', item); }}>
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
                        {userData?.birthdayMonth >= 0 ? JSON.parse(c.months)[userData.birthdayMonth] : c.month}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {monthsVisible ? <div className="datepickerDropdown noscroll">
                        {JSON.parse(c.months)?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation(); handleChange('birthdayMonth', index); }}>
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
                        {userData.birthdayYear ? userData.birthdayYear : c.year}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {yearsVisible ? <div className="datepickerDropdown noscroll">
                        {years?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation(); handleChange('birthdayYear', item); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
            </div>
        </div>

        <div className="label label--date label--date--address">
            {c.livingAddress} *
            <div className="flex flex--start label--date--address--firstLine">
                <div className="label--date__input label--date__input--country marginRight">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                    >
                        {userData?.country >= 0 ? JSON.parse(c.countries)[userData.country] : c.chooseCountry}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {countriesVisible ? <div className="datepickerDropdown noscroll">
                        {JSON.parse(c.countries)?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { handleChange('country', index); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
                <label>
                    <input className="input input--city"
                           value={userData.city}
                           onChange={(e) => { handleChange('city', e.target.value); }}
                           placeholder={c.city} />
                </label>
            </div>
            <div className="flex flex--start">
                <label className="marginRight">
                    <input className="input input--address"
                           value={userData.postalCode}
                           onChange={(e) => { handleChange('postalCode', e.target.value); }}
                           placeholder={c.postalCode} />
                </label>
                <label>
                    <input className="input input--address"
                           value={userData.address}
                           onChange={(e) => { handleChange('address', e.target.value); }}
                           placeholder={c.streetAndBuilding} />
                </label>
            </div>
        </div>

        <div className="label label--phoneNumber">
            {c.phoneNumber} *
            <button className="phoneNumberBtn" onClick={(e) => { e.stopPropagation(); setPhoneNumbersCountriesVisible(!phoneNumbersCountriesVisible); }}>
                {userData.phoneNumberCountry}
            </button>
            {phoneNumbersCountriesVisible ? <div className="datepickerDropdown datepickerDropdown--phoneNumbers noscroll">
                {phoneNumbers?.map((item, index) => {
                    return <button className="datepickerBtn center" key={index}
                                   onClick={(e) => { setPhoneNumbersCountriesVisible(false); handleChange('phoneNumberCountry', item); }}>
                        {item}
                    </button>
                })}
            </div> : ''}
            <input className="input"
                   value={userData.phoneNumber}
                   onChange={(e) => { handleChange('phoneNumber', e.target.value); }} />
        </div>

        <label className="label">
            {c.email}
            <input className="input"
                   disabled={true}
                   value={userData.email}
                   onChange={(e) => { handleChange('email', e.target.value); }} />
        </label>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm" onClick={() => { validateData(); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default UserForm1;
