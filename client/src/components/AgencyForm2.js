import React, {useContext, useState} from 'react';
import {attachmentsErrors, countries, nipCountries, phoneNumbers} from "../static/content";
import dropdownArrow from "../static/img/dropdown-arrow.svg";
import {AgencyDataContext} from "../pages/AgencyEditData";
import plusIcon from "../static/img/plus-icon-opacity.svg";
import trashIcon from "../static/img/trash.svg";
import fileIcon from "../static/img/doc.svg";
import settings from "../static/settings";

const AgencyForm2 = ({removeLogo, handleFileUpload, removeGalleryImage}) => {
    const { setStep, agencyData, handleChange } = useContext(AgencyDataContext);

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
                Logo
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    Załącz logo lub znak firmowy. Zalecane wymiary to 250x 250px.
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
                Galeria zdjęć
                <p className="label--extraInfo label--extraInfo--marginBottom">
                    Możesz wgrać kilka zdjęć prezentujących Twoją firme: jej wnętrze, pracowników, sposób pracy itd. Maksymalna liczba zdjęć to 15.
                </p>
                <div className="filesUploadLabel center">
                    {agencyData?.gallery?.length === 0 ? <img className="img" src={plusIcon} alt="dodaj-pliki" /> : ''}
                    <input className="input input--file"
                           type="file"
                           multiple={true}
                           maxLength={10}
                           onChange={(e) => { handleGallery(e); }} />

                    {Array.from(agencyData?.gallery)?.map((item, index) => {
                        console.log(item);
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
                Opis firmy
                <span className="letterCounter">
                {agencyData.description.length} / 1000
            </span>
                <textarea className="input input--textarea input--situation"
                          value={agencyData.description}
                          onChange={(e) => { handleDescriptionChange(e); }}
                          placeholder="Tutaj zamieść opis firmy: historia, cele, przesłanie, charakterystyka, czym firma się wyróżnia etc." />
            </label>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setStep(0); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { setStep(2); }}>
                Dalej
            </button>
        </div>
    </>
};

export default AgencyForm2;
