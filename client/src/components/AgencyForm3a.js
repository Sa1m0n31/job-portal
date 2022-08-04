import React, {useContext} from 'react';
import {countries, nipCountries, phoneNumbers} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";

const AgencyForm3a = () => {
    const { setStep, setSubstep, agencyData, handleChange } = useContext(AgencyDataContext);


    return <>
        <div className="userForm userForm--3a userForm--3a--agency">
            <label className="label label--rel">
                Proces rekrutacyjny
                <textarea className="input input--textarea input--situation"
                          value={agencyData.recruitmentProcess}
                          onChange={(e) => { handleChange('recruitmentProcess', e.target.value); }}
                          placeholder="Opisz dokładnie proces rekrutacji w Twojej firmie." />
            </label>
            <label className="label label--rel">
                Benefity
                <textarea className="input input--textarea input--situation"
                          value={agencyData.benefits}
                          onChange={(e) => { handleChange('benefits', e.target.value); }}
                          placeholder="Wskaż co zyskuje pracownik, kiedy dołącza do Twojej firmy." />
            </label>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(1); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(1); }}>
                Dalej
            </button>
        </div>
    </>
};

export default AgencyForm3a;
