import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import plusIcon from '../static/img/plus-in-circle.svg'
import trashIcon from '../static/img/trash.svg'
import {LanguageContext} from "../App";

const UserForm2 = ({addNewSchool, toggleSchoolInProgress, deleteSchool, setEducationVisible}) => {
    const { setStep, error, userData, handleChange, educationVisible, ownCv } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm userForm2">
        <div className="label--date__input label--date__input--country label--date__input--education">
            {c.education} {!ownCv ? '*' : ''}
            <button className="datepicker datepicker--country"
                    onClick={(e) => { e.stopPropagation(); setEducationVisible(!educationVisible); }}
            >
                {JSON.parse(c.educationLevels)[userData.education] ? JSON.parse(c.educationLevels)[userData.education] : c.education}
                <img className="dropdown" src={dropdownArrow} alt="rozwiń" />
            </button>
            {educationVisible ? <div className="datepickerDropdown noscroll">
                {JSON.parse(c.educationLevels)?.map((item, index) => {
                    return <button className="datepickerBtn center" key={index}
                                   onClick={() => { handleChange('education', index); }}>
                        {item}
                    </button>
                })}
            </div> : ''}
        </div>

        {userData.schools?.map((item, index) => {
            return <div className="form__school flex flex-wrap" key={index}>
                <label className="label">
                    {c.schoolOrUniversityName} *
                    <input className={error && !item.name ? "input input--error" : "input"}
                           value={item.name}
                           onChange={(e) => { handleChange('schools', e.target.value, 'name', index); }} />
                </label>
                <label className="label label--profession">
                    {c.learnedProfession} *
                    <input className={error && !item.title ? "input input--error" : "input"}
                           value={item.title}
                           onChange={(e) => { handleChange('schools', e.target.value, 'title', index); }} />
                </label>

                <div className="form__school__row">
                    <label className="label">
                        <span className="oneline">
                            {c.educationYears} *
                        </span>
                        <input type="text"
                               className={error && !item.from ? "input input--error" : "input"}
                               value={item.from}
                               placeholder="YYYY-MM"
                               onChange={(e) => { handleChange('schools', e.target.value, 'from', index); }} />
                    </label>
                    -
                    <label className="label">
                        <input className={error && !item.to && !item.inProgress ? "input input--error" : "input"}
                               type="text"
                               disabled={item.inProgress}
                               value={item.to}
                               placeholder="YYYY-MM"
                               onChange={(e) => { handleChange('schools', e.target.value, 'to', index); }} />
                    </label>

                    <label className="label label--flex label--checkbox">
                        <button className={item.inProgress ? "checkbox checkbox--selected center" : "checkbox center"}
                                onClick={() => { toggleSchoolInProgress(index); }}>
                            <span></span>
                        </button>
                        {c.during}
                    </label>

                    <button className="deleteSchoolBtn" onClick={() => { deleteSchool(index); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button>
                </div>
            </div>
        })}

        <button className={userData?.schools?.length < 3 || !userData?.schools ? (error && !userData?.schools?.length ? "addNewBtn input--error flex" : "addNewBtn flex") : "addNewBtn flex btn--disabled"} onClick={() => { addNewSchool(); }}>
            {c.addNextSchool}
            <img className="img" src={plusIcon} alt="dodaj" />
        </button>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(0); }}>
            {c.back}
        </button>
        <button className="btn btn--userForm" onClick={() => { setStep(2); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default UserForm2;
