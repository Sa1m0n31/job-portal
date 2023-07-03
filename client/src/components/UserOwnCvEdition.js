import React, {useContext, useEffect} from 'react';
import {LanguageContext} from "../App";
import checkIcon from '../static/img/green-check.svg';
import {removeCv, updateCv} from "../helpers/user";

const UserOwnCvEdition = ({ownCv, setOwnCv, mobile}) => {
    const { c } = useContext(LanguageContext);

    useEffect(() => {
        if(ownCv) {
            updateCv(ownCv);
        }
    }, [ownCv]);

    const handleFileUpload = (e) => {
        const file = e?.target?.files[0];
        if(file) {
            setOwnCv(file);
        }
    }

    return <div className={mobile ? "ownCvEdition ownCvEdition--mobile" : "ownCvEdition"}>
        <h4 className="ownCvEdition__text">
            {c.add_cv_info}
        </h4>

        {ownCv ? <div className="ownCvEdition__addInfo flex flex--start">
            <img className="img--fileIcon" src={checkIcon} alt="check" />

            {c.added_cv_info}

            <button className="btn btn--remove"
                    onClick={() => { setOwnCv(null); removeCv(); }}>
                {c.delete_cv_info}
            </button>
        </div> : <div className="ownCvEdition__button">
            {c.add_cv_button}

            <input type="file"
                   multiple={false}
                   accept=".pdf"
                   value={ownCv}
                   onChange={handleFileUpload} />
        </div>}
    </div>
};

export default UserOwnCvEdition;
