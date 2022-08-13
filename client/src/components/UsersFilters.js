import React from 'react';
import closeIcon from '../static/img/close-icon.svg'
import {
    categories,
    countries,
    currencies,
    distances,
    drivingLicences as allDrivingLicences,
    languages as allLanguages
} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import magnifier from '../static/img/magnifier.svg'
import {isElementInArray} from "../helpers/others";

const UsersFilters = ({closeModal, country, city, distance,
    setCountry, setCity, setDistance,
    countriesVisible, distanceVisible, setCountriesVisible, setDistanceVisible,
    category, setCategory, salaryType, setSalaryType, salaryFrom, setSalaryFrom, salaryTo, setSalaryTo,
    salaryCurrency, setSalaryCurrency, ownTransport, setOwnTransport, bsnNumber, setBsnNumber,
    languages, setLanguages, drivingLicences, setDrivingLicences, submitFilter,
    categoriesVisible, setCategoriesVisible, ownTransportVisible, setOwnTransportVisible,
    bsnNumberVisible, setBsnNumberVisible, currenciesVisible, setCurrenciesVisible
                          }) => {

    const toggleLanguage = (i) => {
        if(isElementInArray(i, languages)) {
            setLanguages(prevState => (prevState.filter((item) => (item !== i))));
        }
        else {
            setLanguages(prevState => ([...prevState, i]));
        }
    }

    const toggleDrivingLicence = (i) => {
        if(isElementInArray(i, drivingLicences)) {
            setDrivingLicences(prevState => (prevState.filter((item) => (item !== i))));
        }
        else {
            setDrivingLicences(prevState => ([...prevState, i]));
        }
    }

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

            <div className="label label--responsibility label--category">
                Branża
                <div className="label--date__input label--date__input--country label--date__input--category">
                    <button className="datepicker datepicker--country datepicker--category"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCategoriesVisible(!categoriesVisible); }}
                    >
                        {category !== -1 ? categories[category] : 'Wybierz branżę'}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {categoriesVisible ? <div className="datepickerDropdown noscroll">
                        {categories?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation(); setCategoriesVisible(false); setCategory(index); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
            </div>
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

            <div className="label drivingLicenceWrapper">
                Własny transport
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setOwnTransportVisible(!ownTransportVisible); }}
                        >
                            {(ownTransport !== null ? (ownTransport ? 'Tak' : 'Nie') : 'Wybierz')}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {ownTransportVisible ? (ownTransport !== null ? <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setOwnTransportVisible(false); setOwnTransport(!ownTransport); }}>
                                {ownTransport ? 'Nie' : 'Tak'}
                            </button>
                        </div> : <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setOwnTransportVisible(false); setOwnTransport(true); }}>
                                Tak
                            </button>
                            <button className="datepickerBtn center"
                                    onClick={() => { setOwnTransportVisible(false); setOwnTransport(false); }}>
                                Nie
                            </button>
                        </div>) : ''}
                    </div>
                </div>
            </div>

            <div className="label drivingLicenceWrapper">
                Nr BSN/SOFI
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setBsnNumberVisible(!bsnNumberVisible); }}
                        >
                            {bsnNumber !== null ? (bsnNumber ? 'Tak' : 'Nie') : 'Wybierz'}
                            <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                        </button>
                        {bsnNumberVisible ? (bsnNumber !== null ? <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setBsnNumberVisible(false); setBsnNumber(!bsnNumber); }}>
                                {bsnNumber ? 'Nie' : 'Tak'}
                            </button>
                        </div> : <div className="datepickerDropdown noscroll">
                            <button className="datepickerBtn center"
                                    onClick={() => { setBsnNumberVisible(false); setBsnNumber(true); }}>
                                Tak
                            </button>
                            <button className="datepickerBtn center"
                                    onClick={() => { setBsnNumberVisible(false); setBsnNumber(false); }}>
                                Nie
                            </button>
                        </div>) : ''}
                    </div>
                </div>
            </div>

            <div className="label label--smallMarginBottom">
                Języki obce
                <div className="languagesWrapper flex">
                    {allLanguages.map((item, index) => {
                        return <label className={isElementInArray(index, languages) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
                            <button className={isElementInArray(index, languages) ? "checkbox checkbox--selected center" : "checkbox center"}
                                    onClick={() => { toggleLanguage(index); }}>
                                <span></span>
                            </button>
                            {item}
                        </label>
                    })}
                </div>
            </div>

            <div className="label drivingLicenceCategoriesWrapper">
            <span className="w-100">
                Kategoria prawa jazdy
            </span>
                {allDrivingLicences.map((item, index) => {
                    return <label className={isElementInArray(index, drivingLicences) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
                        <button className="checkbox center"
                                onClick={() => { toggleDrivingLicence(index); }}>
                            <span></span>
                        </button>
                        {item}
                    </label>
                })}
            </div>

            <button className="btn btn--filterSubmit" onClick={() => { closeModal(); submitFilter(); }}>
                Zatwierdź filtry i szukaj
                <img className="img" src={magnifier} alt="powiększ" />
            </button>
        </div>
    </div>
};

export default UsersFilters;
