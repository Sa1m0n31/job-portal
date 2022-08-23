import React, {useContext} from 'react';
import {AgencyDataContext} from "../pages/AgencyEditData";
import {LanguageContext} from "../App";

const AgencyForm3a = () => {
    const { setStep, setSubstep, agencyData, handleChange } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm userForm--3a userForm--3a--agency">
            <label className="label label--rel">
                {c.recruitmentProcess}
                <textarea className="input input--textarea input--situation"
                          value={agencyData.recruitmentProcess}
                          onChange={(e) => { handleChange('recruitmentProcess', e.target.value); }}
                          placeholder={c.recruitmentProcessPlaceholder} />
            </label>
            <label className="label label--rel">
                {c.benefits}
                <textarea className="input input--textarea input--situation"
                          value={agencyData.benefits}
                          onChange={(e) => { handleChange('benefits', e.target.value); }}
                          placeholder={c.benefitsPlaceholder} />
            </label>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(1); }}>
                {c.back}
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
                {c.next}
            </button>
        </div>
    </>
};

export default AgencyForm3a;
