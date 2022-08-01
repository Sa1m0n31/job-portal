import React, {useContext, useEffect, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import {countries, educationLevels} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import plusIcon from '../static/img/plus-in-circle.svg'
import trashIcon from '../static/img/trash.svg'

const UserForm3 = ({addNewJob, toggleJobInProgress, deleteJob, updateJobResponsibilities, addNewResponsibility, deleteResponsibility}) => {
    const { setStep, userData, handleChange } = useContext(UserDataContext);


    return <>
        <div className="userForm userForm3">
        {userData.jobs?.map((item, index) => {
            return <div className="form__job">
                <div className="form__school form__school--job flex" key={index}>
                    <label className="label">
                        Nazwa firmy
                        <input className="input"
                               value={item.name}
                               onChange={(e) => { handleChange('jobs', e.target.value, 'name', index); }} />
                    </label>
                    <label className="label">
                        Okres pracy
                        <input className="input"
                               type="number"
                               value={item.from}
                               onChange={(e) => { handleChange('jobs', e.target.value, 'from', index); }} />
                    </label>
                    -
                    <label className="label">
                        <input className="input"
                               type="number"
                               disabled={item.inProgress}
                               value={item.to}
                               onChange={(e) => { handleChange('jobs', e.target.value, 'to', index); }} />
                    </label>

                    <label className="label label--flex label--checkbox">
                        <button className={item.inProgress ? "checkbox checkbox--selected center" : "checkbox center"}
                                onClick={() => { toggleJobInProgress(index); }}>
                            <span></span>
                        </button>
                        W trakcie
                    </label>

                    <button className="deleteSchoolBtn" onClick={() => { deleteJob(index); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button>
                </div>
                <label className="label label--jobTitle">
                    Stanowisko
                    <input className="input"
                           value={item.title}
                           onChange={(e) => { handleChange('jobs', e.target.value, 'title', index); }} />
                </label>
                <div className="label">
                    Zakres obowiązków
                    {item.responsibilities.map((item, resIndex) => {
                        return <label className="label label--responsibility" key={resIndex}>
                            <input className="input"
                                   placeholder="Napisz za co byłeś odpowiedzialny..."
                                   value={item}
                                   onChange={(e) => { updateJobResponsibilities(index, resIndex, e.target.value); }} />
                            <button className="deleteSchoolBtn" onClick={() => { deleteResponsibility(index, resIndex); }}>
                                <img className="img" src={trashIcon} alt="usun" />
                            </button>
                        </label>
                    })}

                    <button className="addNewBtn addNewBtn--responsibility flex" onClick={() => { addNewResponsibility(index); }}>
                        Dodaj obowiązek
                        <img className="img" src={plusIcon} alt="dodaj" />
                    </button>
                </div>
            </div>
        })}

        <button className="addNewBtn flex" onClick={() => { addNewJob(); }}>
            Naciśnij + by dodać kolejną firmę i stanowisko
            <img className="img" src={plusIcon} alt="dodaj" />
        </button>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(1); }}>
            Wstecz
        </button>
        <button className="btn btn--userForm" onClick={() => { setStep(3); }}>
            Dalej
        </button>
    </div>
    </>
};

export default UserForm3;
