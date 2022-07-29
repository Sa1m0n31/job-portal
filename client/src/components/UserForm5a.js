import React, {useContext, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {currencies} from "../static/content";

const UserForm5A = () => {
    const { setStep, setSubstep, userData, handleChange } = useContext(UserDataContext);

    const [currenciesVisible, setCurrenciesVisible] = useState(false);

    return <div className="userForm userForm--5b">
        <div className="label drivingLicenceWrapper">
            <p className="label--extraInfo">
                Czy posiadasz własne zakwaterowanie w Holandii?
            </p>
            <div className="flex flex--start">
                <label className={userData.ownAccommodation ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownAccommodation', userData.ownAccommodation === true ? null : true); }}>
                        <span></span>
                    </button>
                    Tak
                </label>
                <label className={userData.ownAccommodation === false ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownAccommodation', userData.ownAccommodation === false ? null : false); }}>
                        <span></span>
                    </button>
                    Nie
                </label>
            </div>
            {userData.ownAccommodation ? <label className="label label--accommodationPlace">
                Gdzie ono się znajduje?
                <input className="input"
                       value={userData.accommodationPlace}
                       onChange={(e) => { handleChange('accommodationPlace', e.target.value); }} />
            </label> : ''}
        </div>

        <div className="label drivingLicenceWrapper drivingLicenceWrapper--tools">
            <p className="label--extraInfo">
                Czy posiadasz własne narzędzia, niezbędne do wykonywania pracy na danym stanowisku technicznym?
            </p>
            <div className="flex flex--start">
                <label className={userData.ownTools ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownTools', userData.ownTools === true ? null : true); }}>
                        <span></span>
                    </button>
                    Tak
                </label>
                <label className={userData.ownTools === false ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('ownTools', userData.ownTools === false ? null : false); }}>
                        <span></span>
                    </button>
                    Nie
                </label>
            </div>
        </div>

        <div className="label drivingLicenceWrapper drivingLicenceWrapper--salary">
            Finanse
            <p className="label--extraInfo">
                Wskaż Twoje oczekiwania finansowe <span className="bold">netto</span>
            </p>
            <div className="flex flex--start">
                <label className={userData.salaryType === 1 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('salaryType', 1); }}>
                        <span></span>
                    </button>
                    tygodniowo
                </label>
                <label className={userData.salaryType === 0 ? "label label--flex label--checkbox label--checkbox--selected" : "label label--flex label--checkbox"}>
                    <button className="checkbox center"
                            onClick={() => { handleChange('salaryType', 0); }}>
                        <span></span>
                    </button>
                    miesięcznie
                </label>
            </div>
            <div className="flex flex--start salaryInputsWrapper">
                <label className="label">
                    <input className="input"
                           type="number"
                           value={userData.salaryFrom}
                           onChange={(e) => { handleChange('salaryFrom', e.target.value); }} />
                </label>
                -
                <label className="label">
                    <input className="input"
                           type="number"
                           value={userData.salaryTo}
                           onChange={(e) => { handleChange('salaryTo', e.target.value); }} />
                </label>
                <div className="label--date__input">
                    <button className="datepicker datepicker--currency"
                            onClick={() => { setCurrenciesVisible(!currenciesVisible); }}
                    >
                        {userData.salaryCurrency}
                        <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {currenciesVisible ? <div className="datepickerDropdown noscroll">
                        {currencies?.map((item, index) => {
                            return <button className="datepickerBtn center" key={index}
                                           onClick={(e) => { e.stopPropagation();
                                           setCurrenciesVisible(false);
                                           handleChange('salaryCurrency', item); }}>
                                {item}
                            </button>
                        })}
                    </div> : ''}
                </div>
            </div>
        </div>

        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(3); setSubstep(1); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
                Dalej
            </button>
        </div>
    </div>
};

export default UserForm5A;
