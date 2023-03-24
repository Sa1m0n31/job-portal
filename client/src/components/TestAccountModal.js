import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from "../App";
import Loader from "./Loader";
import {registerTestAccount} from "../helpers/user";
import {isEmail} from "../helpers/others";

const TestAccountModal = ({closeModal}) => {
    const { c } = useContext(LanguageContext);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                closeModal();
            }
        });
    }, []);

    const registerTestAccountWrapper = () => {
        if(isEmail(email)) {
            setLoading(true);

            const mailContent = [c.first_email_title, c.first_email_1, c.first_email_2, c.first_email_3, c.first_email_4, c.first_email_5,
                c.first_email_6, c.first_email_7, c.first_email_8, c.first_email_9, c.second_email_title, c.second_email_1,
                c.third_email_title, c.third_mail_1, c.third_mail_2, c.third_mail_3, c.login, c.password];

            registerTestAccount(email, mailContent)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                        setEmail('');
                    }
                    else {
                        setError(JSON.parse(c.formErrors[1]));
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setError(JSON.parse(c.formErrors[1]));
                });
        }
        else {
            setError(c.emailError);
        }
    }

    return <div className="modal modal--notes center">
        <div className="modal__inner">
            <button className="modal__inner__closeBtn" onClick={() => { closeModal(); }}>
                &times;
            </button>
            <h4 className="modal__header">
                {c.test_account_modal_1}
            </h4>

            <label>
                <input className={error ? "input input--testAccount input--error" : "input input--testAccount"}
                       placeholder={c.email}
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }} />
            </label>

            {success ? <span className="info info--success">
                {c.test_account_modal_2}
            </span> : ''}

            {!loading ? <button className="btn btn--modal btn--modalNotes" onClick={() => { registerTestAccountWrapper(); }}>
                {c.save}
            </button> : <div className="center">
                <Loader />
            </div>}
        </div>
    </div>
};

export default TestAccountModal;
