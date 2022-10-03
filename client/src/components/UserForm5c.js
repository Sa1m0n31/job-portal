import React, {useContext} from 'react';
import {UserDataContext} from "../pages/UserEditData";
import {LanguageContext} from "../App";

const UserForm5C = () => {
    const { userData, setSubstep, handleChange } = useContext(UserDataContext);
    const { c } = useContext(LanguageContext);

    return <>
    <div className="userForm">
        {/*<label className="label label--friendLink">*/}
        {/*    {c.partner}*/}
        {/*    <p className="label--extraInfo">*/}
        {/*        {c.partnerDescription}*/}
        {/*    </p>*/}
        {/*    <input className="input"*/}
        {/*           value={userData.friendLink}*/}
        {/*           onChange={(e) => { handleChange('friendLink', e.target.value); }} />*/}
        {/*</label>*/}
        <label className="label label--friendLink">
            <p className="label--extraInfo">
                {c.whereYouFindOurApp}
            </p>
            <input className="input"
                   value={userData.whereYouFindOurApp}
                   onChange={(e) => { handleChange('whereYouFindOurApp', e.target.value); }} />
        </label>
    </div>
    <div className="formBottom flex">
        <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(1); }}>
            {c.back}
        </button>
        <button className="btn btn--userForm" onClick={() => { setSubstep(3); }}>
            {c.next}
        </button>
    </div>
    </>
};

export default UserForm5C;
