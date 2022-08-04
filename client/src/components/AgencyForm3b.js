import React, {useContext} from 'react';
import {AgencyDataContext} from "../pages/AgencyEditData";
import wwwIcon from '../static/img/www-icon.svg'
import fbIcon from '../static/img/facebook-icon.svg'
import instagramIcon from '../static/img/instagram-icon.svg'
import ytIcon from '../static/img/youtube-icon.svg'
import linkedinIcon from '../static/img/linedin-icon.svg'

const AgencyForm3b = () => {
    const { setStep, setSubstep, agencyData, handleChange } = useContext(AgencyDataContext);


    return <>
        <div className="userForm userForm--3a userForm--3b--agency">
            <label className="label">
                <figure className="socialMediaIconWrapper">
                    <img className="socialMediaIcon" src={wwwIcon} alt="www" />
                </figure>
                Strona www
                <input className="input"
                       value={agencyData.website}
                       onChange={(e) => { handleChange('website', e.target.value); }} />
            </label>
            <label className="label">
                <figure className="socialMediaIconWrapper">
                    <img className="socialMediaIcon" src={fbIcon} alt="facebook" />
                </figure>
                Facebook
                <input className="input"
                       value={agencyData.facebook}
                       onChange={(e) => { handleChange('facebook', e.target.value); }} />
            </label>
            <label className="label">
                <figure className="socialMediaIconWrapper">
                    <img className="socialMediaIcon" src={instagramIcon} alt="instagram" />
                </figure>
                Instagram
                <input className="input"
                       value={agencyData.instagram}
                       onChange={(e) => { handleChange('instagram', e.target.value); }} />
            </label>
            <label className="label label--yt">
                <figure className="socialMediaIconWrapper">
                    <img className="socialMediaIcon" src={ytIcon} alt="youtube" />
                </figure>
                Youtube
                <input className="input"
                       value={agencyData.youtube}
                       onChange={(e) => { handleChange('youtube', e.target.value); }} />
            </label>
            <label className="label">
                <figure className="socialMediaIconWrapper">
                    <img className="socialMediaIcon" src={linkedinIcon} alt="linkedin" />
                </figure>
                LinkedIn
                <input className="input"
                       value={agencyData.linkedin}
                       onChange={(e) => { handleChange('linkedin', e.target.value); }} />
            </label>
        </div>
        <div className="formBottom flex">
            <button className="btn btn--userForm btn--userFormBack" onClick={() => { setSubstep(0); }}>
                Wstecz
            </button>
            <button className="btn btn--userForm" onClick={() => { setSubstep(0); setStep(3); }}>
                Dalej
            </button>
        </div>
    </>
};

export default AgencyForm3b;
