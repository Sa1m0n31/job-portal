import React, {useContext, useEffect, useState} from 'react';
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import {countries, formErrors, months, nipCountries, phoneNumbers} from "../static/content";
import {numberRange} from "../helpers/others";
import {AgencyDataContext} from "../pages/AgencyEditData";

const AgencyForm1 = ({setCountriesVisible, setPhoneNumbersCountriesVisible, setNipCountriesVisible}) => {
    const { setStep, agencyData, handleChange, countriesVisible, phoneNumbersCountriesVisible, nipCountriesVisible } = useContext(AgencyDataContext);

    const [days, setDays] = useState([]);
    const [years, setYears] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        setYears(numberRange(1900, new Date().getFullYear()-14).reverse());
    }, []);

    return <>
        <div className="userForm userForm--1 userForm--1--agency">
        <label className="label">
            Nazwa firmy
            <input className="input"
                   value={agencyData.name}
                   onChange={(e) => { handleChange('name', e.target.value); }} />
        </label>
        <div className="label label--date label--date--address">
            Adres siedziby
            <div className="flex">
                <div className="label--date__input label--date__input--country">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                    >
                        {countries[agencyData.country]}
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
                    <input className="input input--postalCode"
                           value={agencyData.postalCode}
                           onChange={(e) => { handleChange('postalCode', e.target.value); }}
                           placeholder="Kod pocztowy" />
                </label>
                <label>
                    <input className="input input--city"
                           value={agencyData.city}
                           onChange={(e) => { handleChange('city', e.target.value); }}
                           placeholder="Miejscowość" />
                </label>
                <label>
                    <input className="input input--address"
                           value={agencyData.address}
                           onChange={(e) => { handleChange('address', e.target.value); }}
                           placeholder="Ulica i nr domu" />
                </label>
            </div>
        </div>

        <div className="label label--phoneNumber">
            NIP
            <button className="phoneNumberBtn" onClick={(e) => { e.stopPropagation();
            setNipCountriesVisible(!nipCountriesVisible); }}>
                {agencyData.nipCountry}
            </button>
            {nipCountriesVisible ? <div className="datepickerDropdown datepickerDropdown--phoneNumbers noscroll">
                {nipCountries?.map((item, index) => {
                    return <button className="datepickerBtn center" key={index}
                                   onClick={(e) => { setNipCountriesVisible(false); handleChange('nipCountry', item); }}>
                        {item}
                    </button>
                })}
            </div> : ''}
            <input className="input"
                   value={agencyData.nip}
                   onChange={(e) => { handleChange('nip', e.target.value); }} />
        </div>

        <div className="label label--phoneNumber">
            Numer telefonu
            <button className="phoneNumberBtn" onClick={(e) => { e.stopPropagation(); setPhoneNumbersCountriesVisible(!phoneNumbersCountriesVisible); }}>
                {agencyData.phoneNumberCountry}
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
                   value={agencyData.phoneNumber}
                   onChange={(e) => { handleChange('phoneNumber', e.target.value); }} />
        </div>

        <label className="label">
            Adres e-mail
            <input className="input"
                   value={agencyData.email}
                   onChange={(e) => { handleChange('email', e.target.value); }} />
        </label>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm" onClick={() => { setStep(1); }}>
            Dalej
        </button>

        {error ? <span className="info info--error">
                {error}
            </span> : ''}
    </div>
    </>
};

export default AgencyForm1;
