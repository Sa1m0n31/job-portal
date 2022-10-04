import React, {useContext} from 'react';
import {LanguageContext} from "../App";
import {AgencyDataContext} from "../pages/AgencyEditData";

const AgencyForm3C = () => {
    const { agencyData, setStep, setSubstep, handleChange } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    return <>
        <div className="userForm">
            <label className="label label--friendLink">
                <p className="label--extraInfo">
                    {c.whereYouFindOurApp}
                </p>
                <input className="input"
                       value={agencyData.whereYouFindOurApp}
                       onChange={(e) => { handleChange('whereYouFindOurApp', e.target.value); }} />
            </label>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(1); }}>
                {c.back}
            </button>
            <button className="btn btn--userForm" onClick={() => { setStep(3); setSubstep(0); }}>
                {c.next}
            </button>
        </div>
    </>
};

export default AgencyForm3C;
