import React, {useContext} from 'react';
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import {nipCountries, phoneNumbers} from "../static/content";
import {AgencyDataContext} from "../pages/AgencyEditData";
import {LanguageContext} from "../App";

const AgencyForm1 = ({setCountriesVisible, setPhoneNumbersCountriesVisible, setNipCountriesVisible}) => {
    const { setStep, agencyData, handleChange, countriesVisible, phoneNumbersCountriesVisible, nipCountriesVisible } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm userForm--1 userForm--1--agency">
        <label className="label">
            {c.companyName} *
            <input className="input"
                   value={agencyData.name}
                   onChange={(e) => { handleChange('name', e.target.value); }} />
        </label>
        <div className="label label--date label--date--address">
            {c.companyAddress} *
            <div className="flex">
                <div className="label--date__input label--date__input--country">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                    >
                        {agencyData?.country !== undefined && c.countries ? JSON.parse(c.countries)[agencyData.country] : c.chooseCountry}
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
                    <input className="input input--postalCode"
                           value={agencyData.postalCode}
                           onChange={(e) => { handleChange('postalCode', e.target.value); }}
                           placeholder={c.postalCode} />
                </label>
                <label>
                    <input className="input input--city"
                           value={agencyData.city}
                           onChange={(e) => { handleChange('city', e.target.value); }}
                           placeholder={c.city} />
                </label>
                <label>
                    <input className="input input--address"
                           value={agencyData.address}
                           onChange={(e) => { handleChange('address', e.target.value); }}
                           placeholder={c.streetAndBuilding} />
                </label>
            </div>
        </div>

        <div className="label label--phoneNumber">
            {c.nip} *
            <button className="phoneNumberBtn" onClick={(e) => { e.stopPropagation();
            setNipCountriesVisible(!nipCountriesVisible); }}>
                {agencyData.nipCountry ? agencyData.nipCountry : 'PL'}
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
            {c.phoneNumber} *
            <button className="phoneNumberBtn" onClick={(e) => { e.stopPropagation(); setPhoneNumbersCountriesVisible(!phoneNumbersCountriesVisible); }}>
                {agencyData.phoneNumberCountry ? agencyData.phoneNumberCountry : 'PL +48'}
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
            {c.email}
            <input className="input"
                   disabled={true}
                   value={agencyData.email}
                   onChange={(e) => { handleChange('email', e.target.value); }} />
        </label>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm" onClick={() => { setStep(1); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default AgencyForm1;
