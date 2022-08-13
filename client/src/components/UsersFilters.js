import React from 'react';
import closeIcon from '../static/img/close-icon.svg'
import {categories, countries, currencies, distances} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import magnifier from '../static/img/magnifier.svg'

const UsersFilters = ({closeModal, country, city, distance,
    setCountry, setCity, setDistance,
    countriesVisible, distanceVisible, setCountriesVisible, setDistanceVisible,
    category, setCategory, salaryType, setSalaryType, salaryFrom, setSalaryFrom, salaryTo, setSalaryTo,
    salaryCurrency, setSalaryCurrency, ownTransport, setOwnTransport, bsnNumber, setBsnNumber,
    languages, setLanguages, drivingLicences, setDrivingLicences, submitFilter,
    categoriesVisible, setCategoriesVisible, ownTransportVisible, setOwnTransportVisible,
    bsnNumberVisible, setBsnNumberVisible, currenciesVisible, setCurrenciesVisible
                          }) => {
    return <div className="modal modal--filters modal--filters--users center">
        <div className="modal__inner">
            <button className="modal__inner__closeBtn"
                    onClick={() => { closeModal(); }}
            >
                <img className="img" src={closeIcon} alt="zamknij" />
            </button>
            <h3 className="modal__header">
                Filtry wyszukiwania
            </h3>

            <div className="label label--date label--date--address">
                Lokalizacja
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                        >
                            {country !== -1 ? countries[country] : 'Wybierz kraj'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {countriesVisible ? <div className="datepickerDropdown noscroll">
                            {countries?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { setCountry(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                    <div className="distanceFilterWrapper">
                        <input className="input input--city"
                               value={city}
                               onChange={(e) => { setCity(e.target.value); }}
                               placeholder="Miejscowość" />
                        <div className="label--date__input label--date__input--distance">
                            <button className="datepicker datepicker--distance"
                                    onClick={(e) => { e.stopPropagation(); setDistanceVisible(!distanceVisible); }}
                            >
                                {distances[distance]}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {distanceVisible ? <div className="datepickerDropdown noscroll">
                                {distances?.map((item, index) => {
                                    return <button className="datepickerBtn center" key={index}
                                                   onClick={(e) => { setDistance(index); }}>
                                        {item}
                                    </button>
                                })}
                            </div> : ''}
                        </div>
                    </div>
                </div>
            </div>

            <div className="label drivingLicenceWrapper drivingLicenceWrapper--salary">
                Finanse
                <div className="flex flex--start">
                    <label className={salaryType === 1 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={() => { setSalaryType(1); }}>
                            <span></span>
                        </button>
                        tygodniowo
                    </label>
                    <label className={salaryType === 0 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={() => { setSalaryType(0); }}>
                            <span></span>
                        </button>
                        miesięcznie
                    </label>
                </div>
                <div className="flex flex--start salaryInputsWrapper">
                    <label className="label">
                        <input className="input"
                               type="number"
                               value={salaryFrom}
                               onChange={(e) => { setSalaryFrom(e.target.value); }} />
                    </label>
                    -
                    <label className="label">
                        <input className="input"
                               type="number"
                               value={salaryTo}
                               onChange={(e) => { setSalaryTo(e.target.value); }} />
                    </label>
                    <div className="label--date__input">
                        <button className="datepicker datepicker--currency"
                                onClick={(e) => { e.stopPropagation(); setCurrenciesVisible(!currenciesVisible); }}
                        >
                            {currencies[salaryCurrency]}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {currenciesVisible ? <div className="datepickerDropdown noscroll">
                            {currencies?.map((item, index) => {
                                return <button className="datepickerBtn center" key={index}
                                               onClick={(e) => { e.stopPropagation();
                                                   setCurrenciesVisible(false);
                                                   setSalaryCurrency(index); }}>
                                    {item}
                                </button>
                            })}
                        </div> : ''}
                    </div>
                </div>
            </div>

            <button className="btn btn--filterSubmit" onClick={() => { closeModal(); submitFilter(); }}>
                Zatwierdź filtry i szukaj
                <img className="img" src={magnifier} alt="powiększ" />
            </button>
        </div>
    </div>
};

export default UsersFilters;
