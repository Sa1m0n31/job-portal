import React, {useContext} from 'react';
import {countries, currencies, houses, nipCountries, paymentTypes, phoneNumbers, rooms} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";
import upArrow from '../static/img/input-up-arrow.svg'
import downArrow from '../static/img/input-down-arrow.svg'

const AgencyForm4b = ({setCarVisible, setCarCurrencyVisible, setBikeVisible, setBikeCurrencyVisible, setTransportCostReturnVisible}) => {
    const { setSubstep, agencyData, handleChange, carVisible,
        carCurrencyVisible, bikeVisible, bikeCurrencyVisible, transportCostReturnVisible
    } = useContext(AgencyDataContext);

    return <>
        <div className="userForm userForm--4a userForm--4a--agency userForm--4b--agency">
            <div className="label label--date label--date--address">
                Samochód służbowy
                <div className="flex">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation();
                                setCarVisible(!carVisible); }}
                        >
                            {agencyData.car !== null ? paymentTypes[agencyData.car] : 'Wybierz'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {carVisible ? <div className="datepickerDropdown noscroll">
                            {paymentTypes?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('car', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label label--agencyPrice">
                        <input className="input"
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
                        miesięcznie
                    </span>
                </div>
            </div>

            <div className="label label--date label--date--address">
                Rower
                <div className="flex">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation();
                                    setBikeVisible(!bikeVisible); }}
                        >
                            {agencyData.bike !== null ? paymentTypes[agencyData.bike] : 'Wybierz'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {bikeVisible ? <div className="datepickerDropdown noscroll">
                            {paymentTypes?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { handleChange('bike', index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <label className="label label--agencyPrice">
                        <input className="input"
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
                        miesięcznie
                    </span>
                </div>

                <div className="label drivingLicenceWrapper">
                    Zwrot kosztów przy własnym transporcie
                    <div className="flex flex--start">
                        <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                            <button className="datepicker datepicker--country"
                                    onClick={(e) => { e.stopPropagation(); setTransportCostReturnVisible(!transportCostReturnVisible); }}
                            >
                                {agencyData.costReturnWithOwnTransport ? 'Tak' : 'Nie'}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {transportCostReturnVisible ? <div className="datepickerDropdown noscroll">
                                <button className="datepickerBtn center"
                                        onClick={() => { setTransportCostReturnVisible(false); handleChange('costReturnWithOwnTransport', !agencyData.costReturnWithOwnTransport); }}>
                                    {agencyData.costReturnWithOwnTransport ? 'Nie' : 'Tak'}
                                </button>
                            </div> : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(0); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(2); }}>
                Dalej
            </button>
        </div>
    </>
};

export default AgencyForm4b;