import React, {useContext, useEffect, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import {drivingLicences, languageLevels, languages} from "../static/content";
import {isElementInArray} from "../helpers/others";
import penIcon from '../static/img/pen.svg'
import dropdownArrow from "../static/img/dropdown-arrow.svg";

const UserForm4A = ({toggleLanguage, updateLanguageLvl, toggleDrivingLicenceCategory, setLevelsVisible, setDrivingLicenceVisible}) => {
    const { userData, setStep, setSubstep, handleChange, levelsVisible, drivingLicenceVisible } = useContext(UserDataContext);

    return <>
        <div className="userForm">
        <div className="label">
            Języki obce
            <div className="languagesWrapper flex">
                {languages.map((item, index) => {
                    return <label className={isElementInArray(index, userData.languages.map((item) => (item.language))) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
                        <button className={isElementInArray(index, userData.languages.map((item) => (item.language))) ? "checkbox checkbox--selected center" : "checkbox center"}
                                onClick={() => { toggleLanguage(index); }}>
                            <span></span>
                        </button>
                        {item}
                    </label>
                })}
            </div>
        </div>
        <div className="label label--special">
            Wpisz inne języki obce, wraz z poziomem
            <input className="input--special"
                   value={userData.extraLanguages}
                   onChange={(e) => { handleChange('extraLanguages', e.target.value); }}
                   placeholder="np. chiński - A2" />
        </div>
        {userData.languages.length ? <div className="label">
            Stopień zaawansowania języka obcego
            <p className="label--extraInfo">
                Wybierz poziom, na jaki określasz swoją znajomość wybranych języków obcych:
            </p>
            <div className="languageLvlWrapper flex">
                {userData.languages.map((item, index) => {
                    const langIndex = item.language;
                    return <div className="languageLvl flex" key={index}>
                        {languages[item.language]}

                        <div className="label--date__input label--date__input--languageLvl">
                            <button className="datepicker datepicker--languageLvl"
                                    onClick={(e) => { e.stopPropagation(); levelsVisible === index ? setLevelsVisible(-1) : setLevelsVisible(index); }}
                            >
                                {item.lvl}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {levelsVisible === index ? <div className="datepickerDropdown noscroll">
                                {languageLevels?.map((item, index) => {
                                    return <button className="datepickerBtn center" key={index}
                                                   onClick={(e) => { e.stopPropagation(); setLevelsVisible(-1); updateLanguageLvl(langIndex, item); }}>
                                        {item}
                                    </button>
                                })}
                            </div> : ''}
                        </div>
                    </div>
                })}
            </div>
        </div> : ''}

        <div className="label drivingLicenceWrapper">
            Prawo jazdy
            <p className="label--extraInfo">
                Czy posiadasz prawo jazdy?
            </p>
            <div className="flex flex--start">
                <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setDrivingLicenceVisible(!drivingLicenceVisible); }}
                    >
                        {userData.drivingLicence ? 'Tak' : 'Nie'}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {drivingLicenceVisible ? <div className="datepickerDropdown noscroll">
                        <button className="datepickerBtn center"
                                onClick={() => { setDrivingLicenceVisible(false); handleChange('drivingLicence', !userData.drivingLicence); }}>
                            {userData.drivingLicence ? 'Nie' : 'Tak'}
                        </button>
                    </div> : ''}
                </div>
            </div>
        </div>

        {userData.drivingLicence ? <div className="label drivingLicenceCategoriesWrapper">
            <span className="w-100">
                Kategoria prawa jazdy
            </span>
            {drivingLicences.map((item, index) => {
                return <label className={isElementInArray(index, userData.drivingLicenceCategories) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
                    <button className="checkbox center"
                            onClick={() => { toggleDrivingLicenceCategory(index); }}>
                        <span></span>
                    </button>
                    {item}
                </label>
            })}
        </div> : ''}
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(2); }}>
            Wstecz
        </button>
        <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
            Dalej
        </button>
    </div>
    </>
};

export default UserForm4A;
