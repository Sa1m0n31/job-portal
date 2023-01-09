import React, {useContext} from 'react';
import {AgencyDataContext} from "../pages/AgencyEditData";
import {LanguageContext} from "../App";
import {Tooltip} from "react-tippy";

const AgencyForm3a = () => {
    const { setStep, setSubstep, agencyData, handleChange } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    const handleRecruitmentChange = (e) => {
        if(e.target.value.length <= 600) {
            handleChange('recruitmentProcess', e.target.value);
        }
    }

    const handleBenefitsChange = (e) => {
        if(e.target.value.length <= 1000) {
            handleChange('benefits', e.target.value);
        }
    }

    return <>
        <div className="userForm userForm--3a userForm--3a--agency">
            <label className="label label--rel certificatesWrapper flex">
                <span>
                    {c.recruitmentProcess} *
                    <Tooltip
                        html={<span className="tooltipVisible">
                        {c.recruitmentProcessTooltip}
                                </span>}
                        position={window.innerWidth > 768 ? "right" : "top"}
                        followCursor={true}
                    >
                        <div className="tooltip">
                            ?
                        </div>
                    </Tooltip>
                </span>
                <span className="letterCounter">
                    {agencyData?.recruitmentProcess.length} / 600
                </span>
                <textarea className="input input--textarea input--situation"
                          value={agencyData.recruitmentProcess}
                          onChange={(e) => { handleRecruitmentChange(e); }}
                          placeholder={c.recruitmentProcessPlaceholder} />
            </label>
            <label className="label label--rel certificatesWrapper flex">
                <span>
                    {c.benefits} *
                    <Tooltip
                        html={<span className="tooltipVisible">
                        {c.benefitsTooltip}
                                </span>}
                        position={window.innerWidth > 768 ? "right" : "top"}
                        followCursor={true}
                    >
                        <div className="tooltip">
                            ?
                        </div>
                    </Tooltip>
                </span>
                <span className="letterCounter">
                    {agencyData?.benefits?.length} / 1000
                </span>
                <textarea className="input input--textarea input--situation"
                          value={agencyData.benefits}
                          onChange={(e) => { handleBenefitsChange(e); }}
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
