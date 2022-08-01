import React, {useContext, useEffect, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import {countries, educationLevels} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import plusIcon from '../static/img/plus-in-circle.svg'
import trashIcon from '../static/img/trash.svg'

const UserForm2 = ({addNewSchool, toggleSchoolInProgress, deleteSchool, setEducationVisible}) => {
    const { setStep, userData, handleChange, educationVisible } = useContext(UserDataContext);

    const [error, setError] = useState('');

    return <>
        <div className="userForm userForm2">
        <div className="label--date__input label--date__input--country label--date__input--education">
            Wykształcenie
            <button className="datepicker datepicker--country"
                    onClick={(e) => { e.stopPropagation(); setEducationVisible(!educationVisible); }}
            >
                {educationLevels[userData.education]}
                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
            </button>
            {educationVisible ? <div className="datepickerDropdown noscroll">
                {educationLevels?.map((item, index) => {
                    return <button className="datepickerBtn center" key={index}
                                   onClick={(e) => { handleChange('education', index); }}>
                        {item}
                    </button>
                })}
            </div> : ''}
        </div>

        {userData.schools?.map((item, index) => {
            return <div className="form__school flex" key={index}>
                <label className="label">
                    Nazwa szkoły/uczleni
                    <input className="input"
                           value={item.name}
                           onChange={(e) => { handleChange('schools', e.target.value, 'name', index); }} />
                </label>
                <label className="label">
                    Wyuczony zawód
                    <input className="input"
                           value={item.title}
                           onChange={(e) => { handleChange('schools', e.target.value, 'title', index); }} />
                </label>
                <label className="label">
                    Lata nauki
                    <input className="input"
                           type="number"
                           value={item.from}
                           onChange={(e) => { handleChange('schools', e.target.value, 'from', index); }} />
                </label>
                -
                <label className="label">
                    <input className="input"
                           type="number"
                           disabled={item.inProgress}
                           value={item.to}
                           onChange={(e) => { handleChange('schools', e.target.value, 'to', index); }} />
                </label>

                <label className="label label--flex label--checkbox">
                    <button className={item.inProgress ? "checkbox checkbox--selected center" : "checkbox center"}
                            onClick={() => { toggleSchoolInProgress(index); }}>
                        <span></span>
                    </button>
                    W trakcie
                </label>

                <button className="deleteSchoolBtn" onClick={() => { deleteSchool(index); }}>
                    <img className="img" src={trashIcon} alt="usun" />
                </button>
            </div>
        })}

        <button className="addNewBtn flex" onClick={() => { addNewSchool(); }}>
            Naciśnij + by dodać następną szkołę/uczlenie
            <img className="img" src={plusIcon} alt="dodaj" />
        </button>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(0); }}>
            Wstecz
        </button>
        <button className="btn btn--userForm" onClick={() => { setStep(2); }}>
            Dalej
        </button>

        {error ? <span className="info info--error">
                {error}
            </span> : ''}
    </div>
    </>
};

export default UserForm2;
