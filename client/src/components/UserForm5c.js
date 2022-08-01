import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";

const UserForm5C = () => {
    const { userData, setSubstep, handleChange } = useContext(UserDataContext);

    return <>
        <div className="userForm">
        <label className="label label--friendLink">
            Współpracownik
            <p className="label--extraInfo">
                Jeśli masz współpracownika i chcecie otrzymywać razem oferty, wklej link do jego istniejącego profilu na Jooob.eu.
            </p>
            <input className="input"
                   value={userData.friendLink}
                   onChange={(e) => { handleChange('friendLink', e.target.value); }} />
        </label>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(1); }}>
            Wstecz
        </button>
        <button className="btn btn--userForm" onClick={() => { setSubstep(3); }}>
            Dalej
        </button>
    </div>
    </>
};

export default UserForm5C;
