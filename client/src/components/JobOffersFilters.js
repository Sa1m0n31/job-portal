import React, {useContext} from 'react';
import closeIcon from '../static/img/close-icon.svg'
import {currencies, distances} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {LanguageContext} from "../App";

const JobOffersFilters = ({closeModal, title, category, country, city, distance,
                              salaryType, salaryFrom, salaryTo, salaryCurrency, submitFilters,
    setTitle, setCategory, setCountry, setCity, setDistance, setSalaryType, setSalaryFrom, setSalaryTo, setSalaryCurrency,
    countriesVisible, categoriesVisible, currenciesVisible, distanceVisible, setCountriesVisible, setCategoriesVisible, setCurrenciesVisible, setDistanceVisible
                          }) => {
    const { c } = useContext(LanguageContext);

    return <div className="modal modal--filters center">
        <div className="modal__inner">
            <button className="modal__inner__closeBtn"
                    onClick={() => { closeModal(); }}
            >
                <img className="img" src={closeIcon} alt="zamknij" />
            </button>
            <h3 className="modal__header">
                {c.filters}
            </h3>

            <div className="label label--special">
                {c.post}
                <input className="input--special"
                       value={title}
                       onChange={(e) => { e.target.value.length < 50 ? setTitle(e.target.value) : setTitle(title)}}
                       placeholder={c.postPlaceholder} />
            </div>

            <div className="label label--responsibility label--category">
                {c.category}
                <div className="label--date__input label--date__input--country label--date__input--category">
                    <button className="datepicker datepicker--country datepicker--category"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCategoriesVisible(!categoriesVisible); }}
                    >
                        {category !== -1 ? JSON.parse(c.categories)[category] : c.chooseCategory}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {categoriesVisible ? <div className="datepickerDropdown noscroll">
                        {JSON.parse(c.categories)?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation(); setCategoriesVisible(false); setCategory(index); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
            </div>

            <div className="label label--date label--date--address">
                {c.location}
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                        >
                            {country !== -1 ? JSON.parse(c.countries)[country] : c.chooseCountry}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {countriesVisible ? <div className="datepickerDropdown noscroll">
                            {JSON.parse(c.countries)?.map((item, index) => {
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
                               placeholder={c.city} />
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
                {c.finances}
                <p className="label--extraInfo">
                    {c.salaryExpectations.charAt(0).toUpperCase() + c.salaryExpectations.slice(1)} <span className="bold">{c.netto}</span>
                </p>
                <div className="flex flex--start jobOfferFilters__salaryType">
                    <label className={salaryType === 1 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={() => { setSalaryType(1); }}>
                            <span></span>
                        </button>
                        {c.weekly}
                    </label>
                    <label className={salaryType === 0 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                        <button className="checkbox center"
                                onClick={() => { setSalaryType(0); }}>
                            <span></span>
                        </button>
                        {c.monthly}
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
                        {currenciesVisible ? <div className="datepickerDropdown datepickerDropdown--currencies noscroll">
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

            <button className="btn btn--filterSubmit" onClick={() => { closeModal(); submitFilters(); }}>
                {c.submitFilters}
            </button>
        </div>
    </div>
};

export default JobOffersFilters;
