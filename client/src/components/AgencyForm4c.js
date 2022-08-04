import React, {useContext, useEffect, useState} from 'react';
import {
    countries, currencies,
    months,
    nipCountries, paycheckDay, paycheckFrequency,
    paymentTypes,
    pensionFrequency,
    pensionType,
    phoneNumbers
} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";
import upArrow from "../static/img/input-up-arrow.svg";
import downArrow from "../static/img/input-down-arrow.svg";

const AgencyForm4c = ({setPensionVisible, setHolidayAllowanceTypeVisible, setHolidayAllowanceFrequencyVisible,
        setDayVisible, setMonthVisible, setPaycheckFrequencyVisible, setPaycheckDayVisible,
        setHealthInsuranceVisible, setHealthInsuranceCurrencyVisible, submitAgencyData
                      }) => {
    const { setStep, setSubstep, agencyData, handleChange, pensionVisible, holidayAllowanceTypeVisible,
        holidayAllowanceFrequencyVisible, dayVisible, monthVisible, paycheckFrequencyVisible, paycheckDayVisible,
        healthInsuranceVisible, healthInsuranceCurrencyVisible
    } = useContext(AgencyDataContext);

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
                Składki emerytalne
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setPensionVisible(!pensionVisible); }}
                        >
                            {agencyData.pensionContributions !== null ? pensionType[agencyData.pensionContributions] : 'Wybierz'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {pensionVisible ? <div className="datepickerDropdown noscroll">
                                {pensionType?.map((item, index) => {
                                    return <button className="datepickerBtn center" key={index}
                                                   onClick={(e) => { handleChange('pensionContributions', index); }}>
                                        {item}
                                    </button>
                                })}
                            </div> : ''}
                    </div>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                Świadczenia urlopowe
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setHolidayAllowanceTypeVisible(!holidayAllowanceTypeVisible); }}
                        >
                            {agencyData.holidayAllowanceType !== null ? pensionType[agencyData.holidayAllowanceType] : 'Wybierz'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {holidayAllowanceTypeVisible ? <div className="datepickerDropdown noscroll">
                            {pensionType?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('holidayAllowanceType', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
                <div className="flex flex--start pensionFrequency">
                    <div className="label--date__input label--date__input--drivingLicence label--date__input--pensionFrequency">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setHolidayAllowanceFrequencyVisible(!holidayAllowanceFrequencyVisible); }}
                        >
                            {pensionFrequency[agencyData.holidayAllowanceFrequency]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {holidayAllowanceFrequencyVisible ? <div className="datepickerDropdown noscroll">
                            {pensionFrequency?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('holidayAllowanceFrequency', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
                <div className="label--flex">
                    {/* DAY */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--day"
                                onClick={(e) => { e.stopPropagation(); setDayVisible(!dayVisible); }}
                        >
                            {agencyData.holidayAllowanceDay+1}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {dayVisible ? <div className="datepickerDropdown noscroll">
                            {days?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('holidayAllowanceDay', item); }}>
                                    {item+1}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    {/* MONTH */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--month"
                                onClick={(e) => { e.stopPropagation(); setMonthVisible(!monthVisible); }}
                        >
                            {months[agencyData.holidayAllowanceMonth]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {monthVisible ? <div className="datepickerDropdown noscroll">
                            {months?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.stopPropagation(); handleChange('holidayAllowanceMonth', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                Wynagrodzenie
                <div className="label--flex salary">
                    {/* DAY */}
                    <div className="label--date__input">
                        <button className="datepicker datepicker--salary"
                                onClick={(e) => { e.stopPropagation(); setPaycheckFrequencyVisible(!paycheckFrequencyVisible); }}
                        >
                            {paycheckFrequency[agencyData.paycheckFrequency]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {paycheckFrequencyVisible ? <div className="datepickerDropdown noscroll">
                            {paycheckFrequency?.map((item, index) => {
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
                            {paycheckDay[agencyData.paycheckDay]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {paycheckDayVisible ? <div className="datepickerDropdown noscroll">
                            {paycheckDay?.map((item, index) => {
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
                Ubezpieczenie zdrowotne
                <div className="flex">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation();
                                    setHealthInsuranceVisible(!healthInsuranceVisible); }}
                        >
                            {agencyData.healthInsurance !== null ? paymentTypes[agencyData.healthInsurance] : 'Wybierz'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {healthInsuranceVisible ? <div className="datepickerDropdown noscroll">
                            {paymentTypes?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('healthInsurance', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label label--agencyPrice">
                        <input className="input"
                               type="number"
                               disabled={agencyData.healthInsurance === 1}
                               min={1}
                               value={agencyData.healthInsuranceCost}
                               onChange={(e) => { handleChange('healthInsuranceCost', parseInt(e.target.value)); }} />
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
                        miesięcznie
                    </span>
                </div>
            </div>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(1); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { submitAgencyData(agencyData); }}>
                Zapisz
            </button>
        </div>
    </>
};

export default AgencyForm4c;
