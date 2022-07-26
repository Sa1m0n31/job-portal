import React, {useContext} from 'react';
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import {nipCountries, phoneNumbers} from "../static/content";
import {AgencyDataContext} from "../pages/AgencyEditData";
import {LanguageContext} from "../App";

const AgencyForm1 = ({setCountriesVisible, setPhoneNumbersCountriesVisible, setNipCountriesVisible}) => {
    const { setStep, agencyData, error, handleChange, countriesVisible, phoneNumbersCountriesVisible, nipCountriesVisible } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm userForm--1 userForm--1--agency">
        <label className="label">
            {c.companyName} *
            <input className={error && !agencyData.name ? "input input--error" : "input"}
                   value={agencyData.name}
                   onChange={(e) => { handleChange('name', e.target.value); }} />
        </label>
        <div className="label label--date label--date--address">
            {c.companyAddress} *
            <div className="flex">
                <div className="label--date__input label--date__input--country">
                    <button className={error && agencyData.country < 0 ? "datepicker datepicker--country input--error" : "datepicker datepicker--country"}
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
                    <input className={error && !agencyData.postalCode ? "input input--postalCode input--error" : "input input--postalCode"}
                           value={agencyData.postalCode}
                           onChange={(e) => { handleChange('postalCode', e.target.value); }}
                           placeholder={c.postalCode} />
                </label>
                <label>
                    <input className={error && !agencyData.city ? "input input--city input--error" : "input input--city"}
                           value={agencyData.city}
                           onChange={(e) => { handleChange('city', e.target.value); }}
                           placeholder={c.city} />
                </label>
                <label>
                    <input className={error && !agencyData.address ? "input input--address input--error" : "input input--address"}
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
            {nipCountriesVisible ? <div className="datepickerDropdownWrapper">
                <div className="datepickerDropdown datepickerDropdown--phoneNumbers datepickerDropdown--fixed noscroll">
                    {nipCountries?.map((item, index) => {
                        return <button className="datepickerBtn center" key={index}
                                       onClick={(e) => { setNipCountriesVisible(false); handleChange('nipCountry', item); }}>
                            {item}
                        </button>
                    })}
                </div>
            </div> : ''}
            <input className={error && !agencyData.nip ? "input input--error" : "input"}
                   value={agencyData.nip}
                   onChange={(e) => { handleChange('nip', e.target.value); }} />
        </div>

        <div className="label label--phoneNumber">
            {c.phoneNumber} *
            <button className="phoneNumberBtn" onClick={(e) => { e.stopPropagation(); setPhoneNumbersCountriesVisible(!phoneNumbersCountriesVisible); }}>
                {agencyData.phoneNumberCountry ? agencyData.phoneNumberCountry : 'PL +48'}
            </button>
            {phoneNumbersCountriesVisible ? <div className="datepickerDropdownWrapper">
                <div className="datepickerDropdown datepickerDropdown--phoneNumbers datepickerDropdown--fixed noscroll">
                    {phoneNumbers?.map((item, index) => {
                        return <button className="datepickerBtn center" key={index}
                                       onClick={(e) => { setPhoneNumbersCountriesVisible(false); handleChange('phoneNumberCountry', item); }}>
                            {item}
                        </button>
                    })}
                </div>
            </div> : ''}
            <input className={error && !agencyData.phoneNumber ? "input input--error" : "input"}
                   value={agencyData.phoneNumber}
                   onChange={(e) => { handleChange('phoneNumber', e.target.value); }} />
        </div>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm" onClick={() => { setStep(1); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default AgencyForm1;
