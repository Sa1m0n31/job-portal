import React, {useContext, useEffect, useState} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import plusIcon from '../static/img/plus-icon-opacity.svg'
import fileIcon from '../static/img/doc.svg'
import trashIcon from '../static/img/trash.svg'
import {attachmentsErrors} from "../static/content";
import Loader from "./Loader";

const UserForm5D = ({submitUserData, removeAttachment, error, loading}) => {
    const { userData, setSubstep, handleChange } = useContext(UserDataContext);

    const [attachmentsError, setAttachmentsError] = useState('');

    const handleAttachments = (e) => {
        if(e.target.files.length > 5) {
            e.preventDefault();
            setAttachmentsError(attachmentsErrors[0]);
        }
        else {
            setAttachmentsError('');
            handleChange('attachments', e.target.files);
        }
    }

    const handleDescriptionChange = (e) => {
        setAttachmentsError('');
        if(e.target.value.length < 150) {
            handleChange('situationDescription', e.target.value);
        }
    }

    return <>
        <div className="userForm userForm--5d">
        <label className="label label--rel">
            Opis aktualnej sytuacji
            <span className="letterCounter">
                {userData.situationDescription.length} / 150
            </span>
            <textarea className="input input--textarea input--situation"
                      value={userData.situationDescription}
                      onChange={(e) => { handleDescriptionChange(e); }}
                      placeholder="Tutaj zamieść opis aktualnej sytuacji: miejsce pobytu, plany na przyszłość, preferowane stanowisko etc." />
        </label>

        <label className="label">
            Załączniki
            <p className="label--extraInfo label--extraInfo--marginBottom">
                Tutaj możesz dodać załączniki do swojego profilu i CV, np. skany certyfikatów czy zdjęcia portfolio.
            </p>
            <div className="filesUploadLabel center">
                {userData?.attachments?.length === 0 ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : ''}
                <input className="input input--file"
                       type="file"
                       multiple={true}
                       maxLength={5}
                       onChange={(e) => { handleAttachments(e); }} />

                {Array.from(userData.attachments)?.map((item, index) => {
                    return <div className="filesUploadLabel__item" key={index}>
                        <button className="removeAttachmentBtn" onClick={(e) => { e.stopPropagation(); removeAttachment(index); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={fileIcon} alt={`file-${index}`} />
                    </div>
                })}
            </div>
        </label>

        {attachmentsError ? <span className="info info--error">
            {attachmentsError}
        </span> : ''}
    </div>

    <div className="formBottom flex">
        {loading ? <div className="center">
            <Loader />
        </div> : <>
            {error ? <span className="info info--error">
                {error}
            </span> : <>
                <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(2); }}>
                    Wstecz
                </button>
                <button className="btn btn--userForm" onClick={() => { submitUserData(userData); }}>
                    Zakończ
                </button>
            </>}
        </>}
    </div>
    </>
};

export default UserForm5D;
