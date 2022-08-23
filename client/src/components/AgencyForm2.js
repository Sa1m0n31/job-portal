import React, {useContext, useState} from 'react';
import {attachmentsErrors} from "../static/content";
import {AgencyDataContext} from "../pages/AgencyEditData";
import plusIcon from "../static/img/plus-icon-opacity.svg";
import trashIcon from "../static/img/trash.svg";
import settings from "../static/settings";
import {LanguageContext} from "../App";

const AgencyForm2 = ({removeLogo, handleFileUpload, removeGalleryImage}) => {
    const { setStep, agencyData, handleChange } = useContext(AgencyDataContext);
    const { c } = useContext(LanguageContext);

    const [galleryError, setGalleryError] = useState('');

    const handleDescriptionChange = (e) => {
        setGalleryError('');
        if(e.target.value.length <= 1000) {
            handleChange('description', e.target.value);
        }
    }

    const handleGallery = (e) => {
        if(e.target.files.length + agencyData.gallery.length > 15) {
            e.preventDefault();
            setGalleryError(attachmentsErrors[0]);
        }
        else {
            setGalleryError('');
            handleChange('gallery', e.target.files);
        }
    }

    return <>
        <div className="userForm userForm--1 userForm--2--agency">
            <div className="label">
                {c.logo}
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    {c.logoDescription}
                </p>
                <div className={!agencyData?.logoUrl ? "filesUploadLabel center" : "filesUploadLabel filesUploadLabel--noBorder center"}>
                    {!agencyData.logoUrl ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : <div className="filesUploadLabel__profileImage">
                        <button className="removeProfileImageBtn" onClick={() => { removeLogo(); }}>
                            <img className="img" src={trashIcon} alt="usun" />
                        </button>
                        <img className="img" src={agencyData?.logoUrl} alt="zdjecie-profilowe" />
                    </div>}
                    <input className="input input--file"
                           type="file"
                           multiple={false}
                           onChange={(e) => { handleFileUpload(e); }} />
                </div>
            </div>

            <div className="label">
                {c.gallery}
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    {c.galleryDescription}
                </p>
                <div className="filesUploadLabel center">
                    {agencyData?.gallery?.length === 0 ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : ''}
                    <input className="input input--file"
                           type="file"
                           multiple={true}
                           maxLength={15}
                           onChange={(e) => { handleGallery(e); }} />

                    {Array.from(agencyData?.gallery)?.map((item, index) => {
                        return <div className="filesUploadLabel__item" key={index}>
                            <button className="removeAttachmentBtn" onClick={(e) => { e.stopPropagation();
                            removeGalleryImage(index); }}>
                                <img className="img" src={trashIcon} alt="usun" />
                            </button>
                            <img className="img" src={ item?.url ? (item.url.split(':')[0] === 'blob' ? item.url : `${settings.API_URL}/${item.url}`) : item} alt={`file-${index}`} />
                        </div>
                    })}
                </div>
            </div>

            <label className="label label--rel">
                {c.companyDescription}
                <span className="letterCounter">
                {agencyData?.description?.length} / 1000
            </span>
                <textarea className="input input--textarea input--situation"
                          value={agencyData.description}
                          onChange={(e) => { handleDescriptionChange(e); }}
                          placeholder={c.companyDescriptionPlaceholder} />
            </label>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(0); }}>
                {c.back}
            </button>
            <button className="btn btn--userForm" onClick={() => { setStep(2); }}>
                {c.next}
            </button>
        </div>
    </>
};

export default AgencyForm2;
