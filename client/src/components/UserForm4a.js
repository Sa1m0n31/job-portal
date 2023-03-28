import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import {languageLevels} from "../static/content";
import {isElementInArray} from "../helpers/others";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {LanguageContext} from "../App";

const UserForm4A = ({toggleLanguage, updateLanguageLvl, toggleDrivingLicenceCategory, setLevelsVisible, setDrivingLicenceVisible}) => {
    const { userData, setStep, setSubstep, handleChange, levelsVisible, drivingLicenceVisible, error } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm">
        <div className={userData.languages.findIndex((i) => (i)) === -1 && !userData.extraLanguages ? "label error" : "label"}>
            {c.foreignLanguages.charAt(0).toUpperCase() + c.foreignLanguages.slice(1)} *
            <div className="languagesWrapper flex">
                {JSON.parse(c.languages).map((item, index) => {
                    return <label className={isElementInArray(index, Array.isArray(userData.languages) ? userData.languages.map((item) => (item.language)) : []) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
                        <button className={isElementInArray(index, Array.isArray(userData.languages) ? userData.languages.map((item) => (item.language)) : []) ? "checkbox checkbox--selected center" : "checkbox center"}
                                onClick={() => { toggleLanguage(index); }}>
                            <span></span>
                        </button>
                        {item}
                    </label>
                })}
            </div>
        </div>
        <div className="label label--special">
            {c.otherLanguages}
            <input className="input--special"
                   value={userData.extraLanguages}
                   onChange={(e) => { handleChange('extraLanguages', e.target.value); }}
                   placeholder={c.otherLanguagesPlaceholder} />
        </div>
        {userData?.languages?.length ? <div className="label">
            {c.foreignLanguageLevel}
            <p className="label--extraInfo">
                {c.foreignLanguageLevelDescription}:
            </p>
            <div className="languageLvlWrapper flex">
                {Array.isArray(userData?.languages) ? userData.languages.map((item, index) => {
                    const langIndex = item.language;
                    return <div className="languageLvl flex" key={index}>
                        {JSON.parse(c.languages)[item.language]}

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
                }) : ''}
            </div>
        </div> : ''}

        <div className="label drivingLicenceWrapper">
            {c.drivingLicence.charAt(0).toUpperCase() + c.drivingLicence.slice(1)}
            <p className="label--extraInfo">
                {c.drivingLicenceDescription} *
            </p>
            <div className="flex flex--start">
                <div className="label--date__input label--date__input--bool label--date__input--drivingLicence">
                    <button className="datepicker datepicker--country"
                            onClick={(e) => { e.stopPropagation(); setDrivingLicenceVisible(!drivingLicenceVisible); }}
                    >
                        {userData.drivingLicence ? c.yes : c.no}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {drivingLicenceVisible ? <div className="datepickerDropdown noscroll">
                        <button className="datepickerBtn center"
                                onClick={() => { setDrivingLicenceVisible(false); handleChange('drivingLicence', !userData.drivingLicence); }}>
                            {userData.drivingLicence ? c.no : c.yes}
                        </button>
                    </div> : ''}
                </div>
            </div>
        </div>

        {userData.drivingLicence ? <div className="label drivingLicenceCategoriesWrapper">
            <span className="w-100">
                {c.drivingLicenceCategory}
            </span>
            {JSON.parse(c.drivingLicences).map((item, index) => {
                return <label className={isElementInArray(index, Array.isArray(userData.drivingLicenceCategories) ? userData.drivingLicenceCategories : []) ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"} key={index}>
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
            {c.back}
        </button>
        <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default UserForm4A;
