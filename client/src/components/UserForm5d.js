import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import plusIcon from '../static/img/plus-icon-opacity.svg'

const UserForm5D = ({submitUserData}) => {
    const { userData, setStep, setSubstep, handleChange } = useContext(UserDataContext);

    return <div className="userForm">
        <label className="label">
            Opis aktualnej sytuacji
            <textarea className="input input--textarea input--situation"
                      value={userData.situationDescription}
                      onChange={(e) => { handleChange('situationDescription', e.target.value); }}
                      placeholder="Tutaj zamieść opis aktualnej sytuacji: miejsce pobytu, plany na przyszłość, preferowane stanowisko etc." />
        </label>

        <label className="label">
            Załączniki
            <p className="label--extraInfo label--extraInfo--marginBottom">
                Tutaj możesz dodać załączniki do swojego profilu i CV, np. skany certyfikatów czy zdjęcia portfolio.
            </p>
            <label className="filesUploadLabel center">
                <img className="img" src={plusIcon} alt="dodaj-pliki" />
                <input className="input input--file"
                       type="file"
                       multiple={true}
                       value={userData.attachments}
                       onChange={(e) => { handleChange('attachments', e.target.files); }} />
            </label>
        </label>

        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(2); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { submitUserData(); }}>
                Zakończ
            </button>
        </div>
    </div>
};

export default UserForm5D;
