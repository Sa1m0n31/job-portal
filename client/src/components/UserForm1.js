import React, {useContext, useEffect, useState} from 'react';
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import {UserDataContext} from "../pages/UserEditData";
import {countries, formErrors, months, phoneNumbers} from "../static/content";
import {numberRange} from "../helpers/others";
import plusIcon from "../static/img/plus-icon-opacity.svg";
import trashIcon from "../static/img/trash.svg";

const UserForm1 = ({setDaysVisible, handleFileUpload, removeProfileImage, setMonthsVisible, setYearsVisible, setCountriesVisible, setPhoneNumbersCountriesVisible}) => {
    const { setStep, userData, handleChange, countriesVisible,
        daysVisible, monthsVisible, yearsVisible, phoneNumbersCountriesVisible
    } = useContext(UserDataContext);

    const [days, setDays] = useState([]);
    const [years, setYears] = useState([]);
    const [error, setError] = useState('');

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
        // if(!userData.firstName || !userData.lastName || !userData.city || !userData.address || !userData.phoneNumber) {
        //     setError(formErrors[0]);
        // }
        // else {
        //     setStep(1);
        // }
        setStep(1);
    }

    return <>
        <div className="userForm userForm--1">
            <div className="label">
                Zdjęcie profilowe
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    Dodaj swoje zdjęcie profilowe. Zalecane wymiary to 250 x 250px.
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
            Imię lub imiona
            <input className="input"
                   value={userData.firstName}
                   onChange={(e) => { handleChange('firstName', e.target.value); }} />
        </label>
        <label className="label">
            Nazwisko
            <input className="input"
                   value={userData.lastName}
                   onChange={(e) => { handleChange('lastName', e.target.value); }} />
        </label>
        <div className="label label--date">
            Data urodzenia
            <div className="label--flex">
                {/* DAY */}
                <div className="label--date__input">
                    <button className="datepicker datepicker--day"
                            onClick={(e) => { e.stopPropagation(); setDaysVisible(!daysVisible); }}
                    >
                        {userData.birthdayDay+1}
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
                        {months[userData.birthdayMonth]}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {monthsVisible ? <div className="datepickerDropdown noscroll">
                        {months?.map((item, index) => {
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
                        {userData.birthdayYear}
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
            Adres zamieszkania
            <div className="flex">
                <div className="label--date__input label--date__input--country">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                    >
                        {countries[userData.country]}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {countriesVisible ? <div className="datepickerDropdown noscroll">
                        {countries?.map((item, index) => {
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
                           placeholder="Miejscowość" />
                </label>
                <label>
                    <input className="input input--address"
                           value={userData.address}
                           onChange={(e) => { handleChange('address', e.target.value); }}
                           placeholder="Ulica i nr domu" />
                </label>
            </div>
        </div>

        <div className="label label--phoneNumber">
            Numer telefonu
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
            Adres e-mail
            <input className="input"
                   value={userData.email}
                   onChange={(e) => { handleChange('email', e.target.value); }} />
        </label>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm" onClick={() => { validateData(); }}>
            Dalej
        </button>

        {error ? <span className="info info--error">
                {error}
            </span> : ''}
    </div>
    </>
};

export default UserForm1;
