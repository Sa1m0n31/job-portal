import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import plusIcon from '../static/img/plus-in-circle.svg'
import trashIcon from '../static/img/trash.svg'
import {LanguageContext} from "../App";
import {Tooltip} from "react-tippy";

const UserForm3 = ({addNewJob, toggleJobInProgress, deleteJob, updateJobResponsibilities, addNewResponsibility, deleteResponsibility}) => {
    const { setStep, userData, handleChange } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm userForm3">
        {userData.jobs?.map((item, index) => {
            return <div className="form__job">
                <div className="form__school form__school--job flex" key={index}>
                    <label className="label">
                        {c.companyName} *
                        <input className="input"
                               value={item.name}
                               onChange={(e) => { handleChange('jobs', e.target.value, 'name', index); }} />
                    </label>
                    <label className="label label--month">
                        <span className="oneline">
                            {c.workingYears} *
                        </span>
                        <input className="input"
                               type="month"
                               value={item.from}
                               onChange={(e) => { handleChange('jobs', e.target.value, 'from', index); }} />
                    </label>
                    -
                    <label className="label label--month">
                        <input className="input"
                               type="month"
                               disabled={item.inProgress}
                               value={item.to}
                               onChange={(e) => { handleChange('jobs', e.target.value, 'to', index); }} />
                    </label>

                    <label className="label label--flex label--checkbox">
                        <button className={item.inProgress ? "checkbox checkbox--selected center" : "checkbox center"}
                                onClick={() => { toggleJobInProgress(index); }}>
                            <span></span>
                        </button>
                        {c.during}
                    </label>

                    <button className="deleteSchoolBtn" onClick={() => { deleteJob(index); }}>
                        <img className="img" src={trashIcon} alt="usun" />
                    </button>
                </div>
                <label className="label label--jobTitle">
                    {c.post} *
                    <input className="input"
                           value={item.title}
                           onChange={(e) => { handleChange('jobs', e.target.value, 'title', index); }} />
                </label>
                <div className="label label--rel certificatesWrapper flex">
                    <span>
                        {c.responsibilities} *
                        <Tooltip
                            html={<span className="tooltipVisible">
                            {c.responsibilitiesTooltip}
                                    </span>}
                            position={window.innerWidth > 768 ? "left" : "top"}
                            followCursor={true}
                        >
                            <div className="tooltip">
                                ?
                            </div>
                        </Tooltip>
                    </span>
                    {item.responsibilities.map((item, resIndex) => {
                        return <label className="label label--responsibility" key={resIndex}>
                            <input className="input"
                                   placeholder={c.responsibilitiesPlaceholder}
                                   value={item}
                                   maxLength={70}
                                   onChange={(e) => { updateJobResponsibilities(index, resIndex, e.target.value); }} />
                            <button className="deleteSchoolBtn" onClick={() => { deleteResponsibility(index, resIndex); }}>
                                <img className="img" src={trashIcon} alt="usun" />
                            </button>
                        </label>
                    })}

                    <button className="addNewBtn addNewBtn--responsibility flex" onClick={() => { addNewResponsibility(index); }}>
                        {c.addResponsibility}
                        <img className="img" src={plusIcon} alt="dodaj" />
                    </button>
                </div>
            </div>
        })}

        <button className="addNewBtn flex" onClick={() => { addNewJob(); }}>
            {c.addNewCompany}
            <img className="img" src={plusIcon} alt="dodaj" />
        </button>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(1); }}>
            {c.back}
        </button>
        <button className="btn btn--userForm" onClick={() => { setStep(3); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default UserForm3;
