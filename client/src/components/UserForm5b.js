import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {categories, currencies} from "../static/content";
import trashIcon from "../static/img/trash.svg";
import plusIcon from "../static/img/plus-in-circle.svg";
import {LanguageContext} from "../App";
import {Tooltip} from "react-tippy";

const UserForm5b = ({addNewCategory, deleteCategory, setCategoriesVisible, setCurrenciesVisible}) => {
    const { setSubstep, error, userData, handleChange, categoriesVisible, currenciesVisible } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm userForm--5b">
        <div className="label drivingLicenceWrapper drivingLicenceWrapper--noMarginBottom">
            <p className={error && userData.ownAccommodation === null ? "label--extraInfo error" : "label--extraInfo"}>
                {c.ownAccommodationQuestion} *
            </p>
            <div className="flex flex--start">
                <label className={userData.ownAccommodation ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownAccommodation', userData.ownAccommodation === true ? null : true); }}>
                        <span></span>
                    </button>
                    {c.yes}
                </label>
                <label className={userData.ownAccommodation === false ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownAccommodation', userData.ownAccommodation === false ? null : false); }}>
                        <span></span>
                    </button>
                    {c.no}
                </label>
            </div>
            {userData.ownAccommodation ? <label className="label label--accommodationPlace">
                {c.accommodationPlaceQuestion}
                <input className="input"
                       value={userData.accommodationPlace}
                       onChange={(e) => { handleChange('accommodationPlace', e.target.value); }} />
            </label> : ''}
        </div>

        <div className="label drivingLicenceWrapper drivingLicenceWrapper--tools drivingLicenceWrapper--toolsQuestion">
            <p className="label--extraInfo">
                {c.toolsQuestion}
                <Tooltip
                    html={<span className="tooltipVisible">
                            {c.toolsTooltip}
                                    </span>}
                    position={window.innerWidth > 768 ? "right" : "top"}
                    followCursor={true}
                >
                    <div className="tooltip">
                        ?
                    </div>
                </Tooltip>
            </p>
            <div className="flex flex--start">
                <label className={userData.ownTools ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownTools', userData.ownTools === true ? null : true); }}>
                        <span></span>
                    </button>
                    {c.yes}
                </label>
                <label className={userData.ownTools === false ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownTools', userData.ownTools === false ? null : false); }}>
                        <span></span>
                    </button>
                    {c.no}
                </label>
            </div>

            {userData.ownTools ? <label className="label label--accommodationPlace">
                <input className="input"
                       value={userData.ownToolsDescription}
                       placeholder={c.ownToolsDescription}
                       onChange={(e) => { handleChange('ownToolsDescription', e.target.value); }} />
            </label> : ''}
        </div>

        <div className="label drivingLicenceWrapper drivingLicenceWrapper--salary label--rel certificatesWrapper flex">
            <span>
                {c.finances} *
                <Tooltip
                    html={<span className="tooltipVisible">
                            {c.salaryTooltip}
                                    </span>}
                    position={window.innerWidth > 768 ? "right" : "top"}
                    followCursor={true}
                >
                            <div className="tooltip">
                                ?
                            </div>
                        </Tooltip>
            </span>
            <p className="label--extraInfo">
                {c.showYourExpectations} <span className="bold">{c.netto}</span>
            </p>
            <div className="flex flex--start">
                <label className={userData.salaryType === 1 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('salaryType', 1); }}>
                        <span></span>
                    </button>
                    {c.weekly}
                </label>
                <label className={userData.salaryType === 0 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('salaryType', 0); }}>
                        <span></span>
                    </button>
                    {c.monthly}
                </label>
            </div>
            <div className="flex flex--start salaryInputsWrapper">
                <label className="label">
                    <input className={error && !userData.salaryFrom ? "input input--error" : "input"}
                           type="number"
                           value={userData.salaryFrom}
                           onChange={(e) => { handleChange('salaryFrom', e.target.value); }} />
                </label>
                -
                <label className="label">
                    <input className={error && !userData.salaryTo ? "input input--error" : "input"}
                           type="number"
                           value={userData.salaryTo}
                           onChange={(e) => { handleChange('salaryTo', e.target.value); }} />
                </label>
                <div className="label--date__input">
                    <button className="datepicker datepicker--currency"
                            onClick={(e) => { e.stopPropagation(); setCurrenciesVisible(!currenciesVisible); }}
                    >
                        {currencies[userData.salaryCurrency]}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {currenciesVisible ? <div className="datepickerDropdown noscroll">
                        {currencies?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation();
                                           setCurrenciesVisible(false);
                                           handleChange('salaryCurrency', index); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
            </div>
        </div>

        <div className="categories">
            <div className="label label--rel certificatesWrapper flex">
                <span className={error && (userData.categories[0] === '-' || userData?.categories?.length === 0) ? 'error' : ''}>
                     {c.mainCategories} *
                    <Tooltip
                        html={<span className="tooltipVisible">
                                {c.categoriesTooltip}
                                        </span>}
                        position={window.innerWidth > 768 ? "right" : "top"}
                        followCursor={true}
                    >
                        <div className="tooltip">
                            ?
                        </div>
                    </Tooltip>
                </span>
                {userData.categories.map((item, index) => {
                    return <div className="label label--flex label--responsibility label--category" key={index}>
                        <div className="label--date__input label--date__input--country label--date__input--category">
                            <button className="datepicker datepicker--country datepicker--category"
                                    onClick={(e) => { e.stopPropagation(); categoriesVisible === index ? setCategoriesVisible(-1) : setCategoriesVisible(index); }}
                            >
                                {item >= 0 ? JSON.parse(c.categories)[item] : c.chooseCategory}
                                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                            </button>
                            {categoriesVisible === index ? <div className="datepickerDropdown noscroll">
                                {JSON.parse(c.categories)?.map((item, childIndex) => {
                                    return <button className="datepickerBtn center" key={childIndex}
                                                   onClick={(e) => { e.stopPropagation(); setCategoriesVisible(-1); handleChange('categories', childIndex, null, index); }}>
                                        {item}
                                    </button>
                                })}
                            </div> : ''}
                        </div>
                        <button className="deleteSchoolBtn" onClick={() => { deleteCategory(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                    </div>
                })}

                {userData.categories.length <= 2 ? <button className="addNewBtn addNewBtn--responsibility flex" onClick={() => { addNewCategory(); }}>
                    {c.addNewCategory}
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button> : ''}
            </div>
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

export default UserForm5b;
