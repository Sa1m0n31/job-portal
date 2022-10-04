import React, {useContext, useEffect, useState} from 'react';
import checkIcon from '../static/img/green-check.svg'
import {LanguageContext} from "../App";
import {isEmail} from "../helpers/others";
import {sendMailInvitation} from "../helpers/user";
import Loader from "./Loader";

const RecommendationModal = ({closeModal, firstAndLastName}) => {
    const { c } = useContext(LanguageContext);

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                closeModal();
            }
        });
    }, []);

    const copyLinkToClipboard = () => {
        const input = document.createElement('textarea');
        input.innerHTML = `https://jooob.eu`;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        setCopied(true);
        return result;
    }

    const sendInvitation = () => {
        if(isEmail(email)) {
            setLoading(true);
            sendMailInvitation(email, firstAndLastName, c.createAccount, c.recommendation6)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(c.recommendation7);
                    }
                    else {
                        setError(c.formErrors[1]);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError(c.formErrors[1]);
                    setLoading(false);
                });
        }
        else {
            setError(c.emailError);
        }
    }

    useEffect(() => {
        if(error) {
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    }, [error]);

    return <div className="modal center">
        <div className="modal__inner modal__inner--recommendation">
            <button className="modal__inner__closeBtn" onClick={() => { closeModal(); }}>
                &times;
            </button>
            <p className="modal__text">
                {c.recommendation2}
            </p>
            <div className="modal__buttons--recommendation">
                {copied ? <span className="copyInfo">
                    <img className="img" src={checkIcon} alt="check" />
                    {c.copied}
                </span> : <button className="btn btn--modal btn--modal--copyLink" onClick={() => { copyLinkToClipboard(); }}>
                    {c.recommendation4}
                </button>}

                <span className="or">
                    {c.or}
                </span>

                {!loading ? (!success ? <div className="recommendationModal__form">
                    <p>
                        {c.recommendation3}
                    </p>
                    <label>
                        <input className="input"
                               value={email}
                               onChange={(e) => { setEmail(e.target.value); }}
                               placeholder={c.email} />
                    </label>

                    {error ? <span className="info info--error">
                        {error}
                    </span> : <button className="btn btn--recommendationSend"
                                      onClick={() => { sendInvitation(); }}>
                        {c.recommendation5}
                    </button>}
                </div> : <span className="info info--success">
                    {success}
                </span>) : <div className="center">
                    <Loader />
                </div>}
            </div>
        </div>
    </div>
};

export default RecommendationModal;
