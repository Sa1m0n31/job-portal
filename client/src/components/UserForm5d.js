import React, {useContext, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import plusIcon from '../static/img/plus-icon-opacity.svg'
import fileIcon from '../static/img/doc.svg'
import trashIcon from '../static/img/trash.svg'
import Loader from "./Loader";
import {LanguageContext} from "../App";
import {Tooltip} from "react-tippy";

const UserForm5D = ({submitUserData, removeAttachment, changeAttachmentName, removeOldAttachment}) => {
    const { userData, setSubstep, handleChange, errorFields, error, loading } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    const [attachmentsError, setAttachmentsError] = useState('');

    const handleAttachments = (e) => {
        if(e.target.files.length + userData.oldAttachments?.length + userData.attachments.length > 10) {
            e.preventDefault();
            setAttachmentsError(c.maxNumberOfAttachmentsError);
        }
        else {
            setAttachmentsError('');
            handleChange('attachments', e.target.files);
        }
    }

    const handleDescriptionChange = (e) => {
        setAttachmentsError('');
        if(e.target.value.length < 1000) {
            handleChange('situationDescription', e.target.value);
        }
    }

    return <>
        <div className="userForm userForm--5d">
        <label className="label label--rel certificatesWrapper flex">
            <span>
                {c.currentSituationDescription}
                <Tooltip
                    html={<span className="tooltipVisible">
                        {c.situationTooltip}
                                </span>}
                    followCursor={true}
                    position="right"
                >
                    <div className="tooltip">
                        ?
                    </div>
                </Tooltip>
            </span>
            <span className="letterCounter">
                {userData.situationDescription.length} / 1000
            </span>
            <textarea className="input input--textarea input--situation"
                      value={userData.situationDescription}
                      onChange={(e) => { handleDescriptionChange(e); }}
                      placeholder={c.currentSituationPlaceholder} />
        </label>

            <div className="label">
                {c.attachments}
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    {c.userAttachmentsDescription}
                </p>
                <label className="filesUploadLabel center">
                    <img className="img" src={plusIcon} alt="dodaj-pliki" />
                    <input className="input input--file"
                           type="file"
                           multiple={true}
                           maxLength={10}
                           onChange={(e) => { handleAttachments(e); }} />
                </label>

                {userData?.oldAttachments?.map((item, index) => {
                    return <div className="filesUploadLabel__item" key={index}>
                        <button className="removeAttachmentBtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeOldAttachment(index, true); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={fileIcon} alt={`file-${index}`} />
                        <input className="fileName"
                               onChange={(e) => { changeAttachmentName(index, e.target.value, true); }}
                               value={item.name}>
                        </input>
                    </div>
                })}

                {Array.from(userData?.attachments)?.map((item, index) => {
                    return <div className="filesUploadLabel__item" key={index}>
                        <button className="removeAttachmentBtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeAttachment(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={fileIcon} alt={`file-${index}`} />
                        <input className="fileName"
                               onChange={(e) => { changeAttachmentName(index, e.target.value); }}
                               value={item.name}
                        >
                        </input>
                    </div>
                })}
            </div>

        {attachmentsError ? <span className="info info--error">
            {attachmentsError}
        </span> : ''}

        <label className="label label--flex label--checkbox">
            <button className={userData.checkbox ? "checkbox checkbox--selected center" : "checkbox center"} onClick={() => { handleChange('checkbox', !userData.checkbox); }}>
                <span></span>
            </button>
            {c.updateUserAgreement}
        </label>

        {error ? <span className="info info--error">
            {error}
            {errorFields?.map((item, index) => {
                return <span key={index} className="info--error--point">
                    - {item}
                </span>
            })}
        </span> : ''}
    </div>

    <div className="formBottom flex">
        {loading ? <div className="center">
            <Loader />
        </div> : <>
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(2); }}>
                {c.back}
            </button>
            <button className="btn btn--userForm"
                    disabled={!userData.checkbox}
                    onClick={() => { submitUserData(userData); }}>
                {c.end}
            </button>
        </>}
    </div>
    </>
};

export default UserForm5D;
