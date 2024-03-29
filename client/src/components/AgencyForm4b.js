import React, {useContext} from 'react';
import {currencies} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";
import upArrow from '../static/img/input-up-arrow.svg'
import downArrow from '../static/img/input-down-arrow.svg'
import {LanguageContext} from "../App";

const AgencyForm4b = ({setCarVisible, setCarCurrencyVisible, setBikeVisible, setBikeCurrencyVisible, setTransportCostReturnVisible, setCarAvailableVisible,
                      setBikeAvailableVisible}) => {
    const { setSubstep, agencyData, handleChange, carVisible, carAvailableVisible, bikeAvailableVisible,
        carCurrencyVisible, bikeVisible, bikeCurrencyVisible, transportCostReturnVisible, error
    } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    const handleChangeWrapper = (field, val) => {
        if(val?.length <= 300) {
            handleChange(field, val);
        }
    }

    return <>
        <div className="userForm userForm--4a userForm--4a--agency userForm--4b--agency">
            <div className="label label--date label--date--address">
                {c.car} *

                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setCarAvailableVisible(!carAvailableVisible); }}
                        >
                            {agencyData.carAvailable ? c.yes : c.no}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {carAvailableVisible ? <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setCarAvailableVisible(false); handleChange('carAvailable', !agencyData.carAvailable); }}>
                                {agencyData.carAvailable ? c.no : c.yes}
                            </button>
                        </div> : ''}
                    </div>
                </div>

                {agencyData?.carAvailable ? <div className="flex marginTop10">
                    <div className="label--date__input label--date__input--country">
                        <button className={agencyData.car === null && error ? "datepicker datepicker--country input--error" : "datepicker datepicker--country"}
                                onClick={(e) => { e.stopPropagation();
                                    setCarVisible(!carVisible); }}
                        >
                            {agencyData.car !== null && c.paymentTypes ? JSON.parse(c.paymentTypes)[agencyData.car] : c.choose}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {carVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.paymentTypes)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('car', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label label--agencyPrice">
                        <input className={agencyData.car !== 1 && error && !agencyData.carPrice ? "input input--error" : "input"}
                               type="number"
                               disabled={agencyData.car === 1}
                               min={1}
                               value={agencyData.carPrice}
                               onChange={(e) => { handleChange('carPrice', parseInt(e.target.value)); }} />
                        <div className="label--agencyPrice__arrows">
                            <button className="label--agencyPrice__button"
                                    onClick={() => { handleChange('carPrice', agencyData.carPrice+1); }}>
                                <img className="img" src={upArrow} alt="więcej" />
                            </button>
                            <button className="label--agencyPrice__button"
                                    onClick={() => { handleChange('carPrice', Math.max(0, agencyData.carPrice-1)); }}>
                                <img className="img" src={downArrow} alt="mniej" />
                            </button>
                        </div>
                    </label>
                    <div className={agencyData.car === 1 ? "label--date__input label--date__input--currency label--disabled" : "label--date__input label--date__input--currency"}>
                        <button className="datepicker datepicker--currency"
                                onClick={(e) => { e.stopPropagation(); setCarCurrencyVisible(!carCurrencyVisible); }}
                        >
                            {currencies[agencyData.carPriceCurrency]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {carCurrencyVisible ? <div className="datepickerDropdown noscroll">
                            {currencies?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.stopPropagation();
                                                   setCarCurrencyVisible(false);
                                                   handleChange('carPriceCurrency', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <span className="carAndBikePriceInfo">
                        {c.weekly}
                    </span>
                </div> : ''}

                {agencyData.carAvailable ? <label className="label label--rel label--bike">
                    {c.additionalInfo}
                    <span className="letterCounter">
                    {agencyData?.carAdditionalInfo?.length} / 300
                </span>
                    <textarea className="input input--textarea input--bike"
                              value={agencyData.carAdditionalInfo}
                              onChange={(e) => { handleChangeWrapper('carAdditionalInfo', e.target.value); }} />
                </label> : ''}
            </div>

            <div className="label label--date label--date--address">
                {c.bike} *

                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setBikeAvailableVisible(!bikeAvailableVisible); }}
                        >
                            {agencyData.bikeAvailable ? c.yes : c.no}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {bikeAvailableVisible ? <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setBikeAvailableVisible(false); handleChange('bikeAvailable', !agencyData.bikeAvailable); }}>
                                {agencyData.bikeAvailable ? c.no : c.yes}
                            </button>
                        </div> : ''}
                    </div>
                </div>

                {agencyData?.bikeAvailable ? <div className="flex marginTop10">
                    <div className="label--date__input label--date__input--country">
                        <button className={agencyData.bike === null && error ? "datepicker datepicker--country input--error" : "datepicker datepicker--country"}
                                onClick={(e) => { e.stopPropagation();
                                    setBikeVisible(!bikeVisible); }}
                        >
                            {agencyData.bike !== null && c.paymentTypes ? JSON.parse(c.paymentTypes)[agencyData.bike] : c.choose}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {bikeVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.paymentTypes)?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('bike', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label label--agencyPrice">
                        <input className={agencyData.bike !== 1 && error && !agencyData.bikePrice ? "input input--error" : "input"}
                               type="number"
                               disabled={agencyData.bike === 1}
                               min={1}
                               value={agencyData.bikePrice}
                               onChange={(e) => { handleChange('bikePrice', parseInt(e.target.value)); }} />
                        <div className="label--agencyPrice__arrows">
                            <button className="label--agencyPrice__button"
                                    onClick={() => { handleChange('bikePrice', agencyData.bikePrice+1); }}>
                                <img className="img" src={upArrow} alt="więcej" />
                            </button>
                            <button className="label--agencyPrice__button"
                                    onClick={() => { handleChange('bikePrice', Math.max(0, agencyData.bikePrice-1)); }}>
                                <img className="img" src={downArrow} alt="mniej" />
                            </button>
                        </div>
                    </label>
                    <div className={agencyData.bike === 1 ? "label--date__input label--date__input--currency label--disabled" : "label--date__input label--date__input--currency"}>
                        <button className="datepicker datepicker--currency"
                                onClick={(e) => { e.stopPropagation(); setBikeCurrencyVisible(!bikeCurrencyVisible); }}
                        >
                            {currencies[agencyData.bikePriceCurrency]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {bikeCurrencyVisible ? <div className="datepickerDropdown noscroll">
                            {currencies?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.stopPropagation();
                                                   setCarCurrencyVisible(false);
                                                   handleChange('bikePriceCurrency', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <span className="carAndBikePriceInfo">
                        {c.weekly}
                    </span>
                </div> : ''}

                {agencyData.bikeAvailable ? <label className="label label--rel label--bike">
                    {c.additionalInfo}
                    <span className="letterCounter">
                    {agencyData?.bikeAdditionalInfo?.length} / 300
                </span>
                    <textarea className="input input--textarea input--bike"
                              value={agencyData.bikeAdditionalInfo}
                              onChange={(e) => { handleChangeWrapper('bikeAdditionalInfo', e.target.value); }} />
                </label> : ''}

                <div className="label drivingLicenceWrapper">
                    {c.costReturnWithOwnTransport} *
                    <div className="flex flex--start">
                        <div className="label--date__input label--date__input--bool label--date__input--drivingLicence label--costReturnWithOwnTransport">
                            <button className="datepicker datepicker--country"
                                    onClick={(e) => { e.stopPropagation(); setTransportCostReturnVisible(!transportCostReturnVisible); }}
                            >
                                {agencyData.costReturnWithOwnTransport ? c.yes : c.no}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {transportCostReturnVisible ? <div className="datepickerDropdown noscroll">
                                <button className="datepickerBtn center"
                                        onClick={() => { setTransportCostReturnVisible(false); handleChange('costReturnWithOwnTransport', !agencyData.costReturnWithOwnTransport); }}>
                                    {agencyData.costReturnWithOwnTransport ? c.no : c.yes}
                                </button>
                            </div> : ''}
                        </div>
                    </div>
                </div>

                {agencyData.costReturnWithOwnTransport ? <label className="label label--rel label--bike">
                    {c.additionalInfo}
                    <span className="letterCounter">
                    {agencyData?.costReturnAdditionalInfo?.length} / 300
                </span>
                    <textarea className="input input--textarea input--bike"
                              value={agencyData.costReturnAdditionalInfo}
                              onChange={(e) => { handleChangeWrapper('costReturnAdditionalInfo', e.target.value); }} />
                </label> : ''}
            </div>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(0); }}>
                {c.back}
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(2); }}>
                {c.next}
            </button>
        </div>
    </>
};

export default AgencyForm4b;
