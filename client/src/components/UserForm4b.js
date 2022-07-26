import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import plusIcon from '../static/img/plus-in-circle.svg'
import trashIcon from '../static/img/trash.svg'
import {Tooltip} from "react-tippy";
import {LanguageContext} from "../App";

const UserForm4B = ({addNewCourse, deleteCourse, addNewCertificate, deleteCertificate, addNewSkill, deleteSkill}) => {
    const { setStep, setSubstep, userData, handleChange } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm">
        <div className="certificatesWrapper">
            <span>
                {c.finishedCourses}
                <Tooltip
                    html={<span className="tooltipVisible">
                        {c.coursesTooltip}
                                </span>}
                    position={window.innerWidth > 968 ? "right" : "top"}
                    followCursor={true}
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
                               placeholder={c.courseName}
                               value={item}
                               onChange={(e) => { handleChange('courses', e.target.value, null, index); }} />
                    </label>
                    <button className="deleteSchoolBtn" onClick={() => { deleteCourse(index); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button>
                </div>
            })}

            <button className="addNewBtn flex"
                    disabled={userData?.courses?.length >= 10}
                    onClick={() => { addNewCourse(); }}>
                {c.addCourse}
                <img className="img" src={plusIcon} alt="dodaj" />
            </button>
        </div>

        <div className="certificatesWrapper">
            <span>
                {c.certificates}
                <Tooltip
                    html={<span className="tooltipVisible">
                        {c.certificatesTooltip}
                                </span>}
                    followCursor={true}
                    position={window.innerWidth > 968 ? "right" : "top"}
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
                               placeholder={c.certificateName}
                               value={item}
                               onChange={(e) => { handleChange('certificates', e.target.value, null, index); }} />
                    </label>
                    <button className="deleteSchoolBtn" onClick={() => { deleteCertificate(index); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button>
                </div>
            })}

            <button className="addNewBtn flex"
                    disabled={userData?.certificates?.length >= 10}
                    onClick={() => { addNewCertificate(); }}>
                {c.addCertificate}
                <img className="img" src={plusIcon} alt="dodaj" />
            </button>
        </div>

            <div className="certificatesWrapper">
            <span>
                {c.skills}
                <Tooltip
                    html={<span className="tooltipVisible">
                        {c.skillTooltip}
                                </span>}
                    followCursor={true}
                    position={window.innerWidth > 968 ? "right" : "top"}
                >
                                <div className="tooltip">
                                    ?
                                </div>
                            </Tooltip>
            </span>
                {userData.skills?.map((item, index) => {
                    return <div className="form__job flex">
                        <label className="label">
                            <input className="input"
                                   placeholder={c.skillName}
                                   value={item}
                                   onChange={(e) => { handleChange('skills', e.target.value, null, index); }} />
                        </label>
                        <button className="deleteSchoolBtn" onClick={() => { deleteSkill(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                    </div>
                })}

                <button className="addNewBtn flex"
                        disabled={userData?.skills?.length >= 10}
                        onClick={() => { addNewSkill(); }}>
                    {c.addSkill}
                    <img className="img" src={plusIcon} alt="dodaj" />
                </button>
            </div>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(0); }}>
            {c.back}
        </button>
        <button className="btn btn--userForm" onClick={() => { setSubstep(0); setStep(4); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default UserForm4B;
