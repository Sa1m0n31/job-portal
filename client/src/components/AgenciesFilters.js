import React, {useContext} from 'react';
import closeIcon from '../static/img/close-icon.svg'
import {distances} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import magnifier from '../static/img/magnifier.svg'
import {LanguageContext} from "../App";

const AgenciesFilters = ({closeModal, country, city, distance,
    setCountry, setCity, setDistance,
    countriesVisible, distanceVisible, setCountriesVisible, setDistanceVisible,
    sorting, setSorting, submitFilter
                          }) => {
    const { c } = useContext(LanguageContext);

    return <div className="modal modal--filters modal--filters--agencies center">
        <div className="modal__inner">
            <button className="modal__inner__closeBtn"
                    onClick={() => { closeModal(); }}
            >
                <img className="img" src={closeIcon} alt="zamknij" />
            </button>
            <h3 className="modal__header">
                {c.filters}
            </h3>

            <div className="label label--date label--date--address">
                {c.location}
                <div className="flex flex--start">
                    <div className="label--date__input label--date__input--country">
                        <button className="datepicker datepicker--country"
                                onClick={(e) => { e.stopPropagation(); setCountriesVisible(!countriesVisible); }}
                        >
                            {country !== -1 && c.countries ? JSON.parse(c.countries)[country] : c.chooseCountry}
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

            <button className={sorting === 0 ? 'btn--bare btn--bare--selected' : 'btn--bare'}
                    onClick={() => { sorting === 0 ? setSorting(-1) : setSorting(0); }}
            >
                {c.sortByName}
            </button>

            <button className={sorting === 1 ? 'btn--bare btn--bare--selected btn--bare--marginTop' : 'btn--bare btn--bare--marginTop'}
                    onClick={() => { sorting === 1 ? setSorting(-1) : setSorting(1); }}
            >
                {c.sortByMostOffers}
            </button>
            <button className={sorting === 2 ? 'btn--bare btn--bare--selected btn--bare--marginBottom' : 'btn--bare btn--bare--marginBottom'}
                    onClick={() => { sorting === 2 ? setSorting(-1) : setSorting(2); }}
            >
                {c.sortByLeastOffers}
            </button>

            <button className="btn btn--filterSubmit" onClick={() => { closeModal(); submitFilter(); }}>
                {c.submitFiltersAndSearch}
                <img className="img" src={magnifier} alt="powiększ" />
            </button>
        </div>
    </div>
};

export default AgenciesFilters;
