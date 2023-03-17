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

            const mailContent = [c.mail1, c.mail2, c.mail3, c.mail4]; // TODO

            registerTestAccount(email, mailContent)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
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
                Podaj swój adres e-mail i uzyskaj jednodniowy dostęp do konta testowego! {/* TODO */}
            </h4>

            <label>
                <input className={error ? "input input--testAccount input--error" : "input input--testAccount"}
                       placeholder={c.email}
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }} />
            </label>

            {success ? <span className="info info--success">
                {c.notes3}
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
