import React, {useContext, useEffect, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import plusIcon from '../static/img/plus-in-circle.svg'
import trashIcon from '../static/img/trash.svg'
import {Tooltip} from "react-tippy";

const UserForm4B = ({addNewCourse, deleteCourse, addNewCertificate, deleteCertificate}) => {
    const { setStep, setSubstep, userData, handleChange } = useContext(UserDataContext);

    return <>
        <div className="userForm">
        <div className="certificatesWrapper">
            <span>
                Ukończone szkolenia
                <Tooltip
                    html={<span className="tooltipVisible">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam molestie ipsum metus. Nullam vitae turpis tellus. Nullam vel gravida nunc, et hendrerit dolor. Integer posuere nisl eu porta cursus.
                                </span>}
                    position="left"
                >
                                <div className="tooltip">
                                    ?
                                </div>
                            </Tooltip>
            </span>
            {userData.courses?.map((item, index) => {
                return <div className="form__job flex">
                    <label className="label">
                        <input className="input"
                               placeholder="Nazwa szkolenia"
                               value={item}
                               onChange={(e) => { handleChange('courses', e.target.value, null, index); }} />
                    </label>
                    <button className="deleteSchoolBtn" onClick={() => { deleteCourse(index); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button>
                </div>
            })}
            <button className="addNewBtn flex" onClick={() => { addNewCourse(); }}>
                Naciśnij + by dodać następne szkolenie
                <img className="img" src={plusIcon} alt="dodaj" />
            </button>
        </div>

        <div className="certificatesWrapper">
            <span>
                Certyfikaty
                <Tooltip
                    html={<span className="tooltipVisible">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam molestie ipsum metus. Nullam vitae turpis tellus. Nullam vel gravida nunc, et hendrerit dolor. Integer posuere nisl eu porta cursus.
                                </span>}
                    position="left"
                >
                                <div className="tooltip">
                                    ?
                                </div>
                            </Tooltip>
            </span>
            {userData.certificates?.map((item, index) => {
                return <div className="form__job flex">
                    <label className="label">
                        <input className="input"
                               placeholder="Nazwa certyfikatu"
                               value={item}
                               onChange={(e) => { handleChange('certificates', e.target.value, null, index); }} />
                    </label>
                    <button className="deleteSchoolBtn" onClick={() => { deleteCertificate(index); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button>
                </div>
            })}
            <button className="addNewBtn flex" onClick={() => { addNewCertificate(); }}>
                Naciśnij + by dodać certyfikat/dyplom
                <img className="img" src={plusIcon} alt="dodaj" />
            </button>
        </div>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(0); }}>
            Wstecz
        </button>
        <button className="btn btn--userForm" onClick={() => { setSubstep(0); setStep(4); }}>
            Dalej
        </button>
    </div>
    </>
};

export default UserForm4B;
