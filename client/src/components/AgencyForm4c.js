import React, {useContext, useEffect, useState} from 'react';
import {
    currencies,
    paycheckDay, paycheckFrequency,
} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";
import upArrow from "../static/img/input-up-arrow.svg";
import downArrow from "../static/img/input-down-arrow.svg";
import {LanguageContext} from "../App";
import Loader from "./Loader";

const AgencyForm4c = ({setPensionVisible, setHolidayAllowanceTypeVisible, setMonthVisible, setPaycheckFrequencyVisible, setPaycheckDayVisible,
        setHealthInsuranceVisible, setHealthInsuranceCurrencyVisible, submitAgencyData, setPensionContributionsVisible
                      }) => {
    const { setSubstep, agencyData, errorFields, handleChange, pensionVisible, holidayAllowanceTypeVisible,
        error, monthVisible, paycheckFrequencyVisible, paycheckDayVisible,
        healthInsuranceVisible, healthInsuranceCurrencyVisible, loading, pensionContributionsVisible
    } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    const [days, setDays] = useState([]);

    useEffect(() => {
        const m = agencyData.holidayAllowanceMonth;

        if(m === 0 || m === 2 || m === 4 || m === 6 || m === 7 || m === 9 || m === 11) {
            setDays(Array.from(Array(31).keys()));
        }
        else if(m === 1) {
            setDays(Array.from(Array(29).keys()));
        }
        else {
            setDays(Array.from(Array(30).keys()));
        }
    }, [agencyData.holidayAllowanceDay, agencyData.holidayAllowanceMonth]);

    return <>
        <div className="userForm userForm--4c userForm--4c--agency">
            <div className="label drivingLicenceWrapper">
                {c.pension} *

                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setPensionContributionsVisible(!pensionContributionsVisible); }}
                        >
                            {agencyData.pensionContributionsAvailable ? c.yes : c.no}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {pensionContributionsVisible ? <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setPensionContributionsVisible(false); handleChange('pensionContributionsAvailable', !agencyData.pensionContributionsAvailable); }}>
                                {agencyData.pensionContributionsAvailable ? c.no : c.yes}
                            </button>
                        </div> : ''}
                    </div>
                </div>

                {agencyData?.pensionContributionsAvailable ? <div className="flex flex--start marginTop10">
                    <div className="label--date__input label--date__input--drivingLicence">
                        <button className={agencyData.pensionContributions === null ? "datepicker datepicker--country input--error" : "datepicker datepicker--country"}
                                onClick={(e) => { e.stopPropagation(); setPensionVisible(!pensionVisible); }}
                        >
                            {agencyData.pensionContributions !== null && c.pensionContributionsType ? JSON.parse(c.pensionContributionsType)[agencyData.pensionContributions] : c.choose}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {pensionVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.pensionContributionsType)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('pensionContributions', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div> : ''}
            </div>

            <div className="label drivingLicenceWrapper">
                {c.holidayAllowance} *
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setHolidayAllowanceTypeVisible(!holidayAllowanceTypeVisible); }}
                        >
                            {agencyData.holidayAllowanceType !== null && c.holidayAllowanceType ? (JSON.parse(c.holidayAllowanceType)[agencyData.holidayAllowanceType] ? JSON.parse(c.holidayAllowanceType)[agencyData.holidayAllowanceType] : c.choose) : c.choose}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {holidayAllowanceTypeVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.holidayAllowanceType)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('holidayAllowanceType', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>

                {agencyData?.holidayAllowanceType === 1 ? <div className="label--flex">
                    {/* MONTH */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--month"
                                onClick={(e) => { e.stopPropagation(); setMonthVisible(!monthVisible); }}
                        >
                            {JSON.parse(c.months)[agencyData.holidayAllowanceMonth] ? JSON.parse(c.months)[agencyData.holidayAllowanceMonth] : c.month}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {monthVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.months)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.stopPropagation(); handleChange('holidayAllowanceMonth', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div> : ''}
            </div>

            <div className="label drivingLicenceWrapper">
                {c.salary} *
                <div className="label--flex salary">
                    {/* DAY */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--salary"
                                onClick={(e) => { e.stopPropagation(); setPaycheckFrequencyVisible(!paycheckFrequencyVisible); }}
                        >
                            {c.paycheckFrequency ? (JSON.parse(c.paycheckFrequency)[agencyData.paycheckFrequency] ? JSON.parse(c.paycheckFrequency)[agencyData.paycheckFrequency] : c.choose) : c.choose}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {paycheckFrequencyVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.paycheckFrequency)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('paycheckFrequency', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* MONTH */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--month"
                                onClick={(e) => { e.stopPropagation(); setPaycheckDayVisible(!paycheckDayVisible); }}
                        >
                            {c.paycheckDay ? (JSON.parse(c.paycheckDay)[agencyData.paycheckDay] ? JSON.parse(c.paycheckDay)[agencyData.paycheckDay] : c.choose) : c.choose}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {paycheckDayVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.paycheckDay)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.stopPropagation(); handleChange('paycheckDay', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            </div>

            <div className="label label--date label--date--address">
                {c.healthInsurance} *
                <div className="flex">
                    <div className="label--date__input label--date__input--country">
                        <button className={error && agencyData.healthInsurance === null ? "datepicker datepicker--country input--error" : "datepicker datepicker--country"}
                                onClick={(e) => { e.stopPropagation();
                                    setHealthInsuranceVisible(!healthInsuranceVisible); }}
                        >
                            {agencyData.healthInsurance !== null && c.healthInsuranceOptions ? (JSON.parse(c.healthInsuranceOptions)[agencyData.healthInsurance] ? JSON.parse(c.healthInsuranceOptions)[agencyData.healthInsurance] : c.choose) : c.choose}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {healthInsuranceVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.healthInsuranceOptions)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('healthInsurance', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label label--agencyPrice">
                        <input className={error && agencyData.healthInsurance !== 1 && !agencyData.healthInsuranceCost ? "input input--error" : "input"}
                               type="number"
                               disabled={agencyData.healthInsurance === 1}
                               min={1}
                               value={agencyData.healthInsuranceCost}
                               onChange={(e) => { handleChange('healthInsuranceCost', parseFloat(e.target.value)); }} />
                        <div className="label--agencyPrice__arrows">
                            <button className="label--agencyPrice__button"
                                    onClick={() => { handleChange('healthInsuranceCost', agencyData.healthInsuranceCost+1); }}>
                                <img className="img" src={upArrow} alt="więcej" />
                            </button>
                            <button className="label--agencyPrice__button"
                                    onClick={() => { handleChange('healthInsuranceCost', Math.max(0, agencyData.healthInsuranceCost-1)); }}>
                                <img className="img" src={downArrow} alt="mniej" />
                            </button>
                        </div>
                    </label>
                    <div className={agencyData.healthInsurance === 1 ? "label--date__input label--date__input--currency label--disabled" : "label--date__input label--date__input--currency"}>
                        <button className="datepicker datepicker--currency"
                                onClick={(e) => { e.stopPropagation(); setHealthInsuranceCurrencyVisible(!healthInsuranceCurrencyVisible); }}
                        >
                            {currencies[agencyData.healthInsuranceCurrency]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {healthInsuranceCurrencyVisible ? <div className="datepickerDropdown noscroll">
                            {currencies?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.stopPropagation();
                                                   setHealthInsuranceCurrencyVisible(false);
                                                   handleChange('healthInsuranceCurrency', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <span className="carAndBikePriceInfo">
                        {c.weekly}
                    </span>
                </div>
            </div>

            {error ? <span className="info info--error">
                {error}
                {errorFields?.map((item, index) => {
                    return <span className="info--error--point" key={index}>
                        {item}
                    </span>
                })}
            </span> : ''}
        </div>
        <div className="formBottom flex">
            {!loading ? <>
                <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(1); }}>
                    {c.back}
                </button>
                <button className="btn btn--userForm" onClick={() => { submitAgencyData(agencyData); }}>
                    {c.save}
                </button>
            </> : <div className="center marginTop">
                <Loader />
            </div>}
        </div>
    </>
};

export default AgencyForm4c;
