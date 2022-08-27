import React, {useContext, useEffect} from 'react';
import xIcon from '../static/img/x-button.svg'
import checkIcon from '../static/img/green-check.svg'
import {LanguageContext} from "../App";

const Modal = ({header, closeModal, modalAction, message, block, success}) => {
    const { c } = useContext(LanguageContext);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                closeModal();
            }
        });
    }, []);

    return <div className="modal center">
        <div className="modal__inner">
            <button className="modal__inner__closeBtn" onClick={() => { closeModal(); }}>
                &times;
            </button>
            {block === 'Odblokuj' || block === 'Akceptuj' || success ? <img className="img img--x" src={checkIcon} alt="usuń" />
            : <img className="img img--x" src={xIcon} alt="usuń" />}
            {!message ? <>
                <h4 className="modal__header">
                    {header}
                </h4>
                <div className="modal__buttons flex">
                    <button className={block === 'Odblokuj' || block === 'Akceptuj' ? "btn btn--modal btn--modal--unblock" : "btn btn--modal btn--modal--delete"} onClick={() => { modalAction(); }}>
                        {block ? block : c.delete}
                    </button>
                    <button className="btn btn--modal btn--modal--cancel" onClick={() => { closeModal(); }}>
                        {c.cancel}
                    </button>
                </div>
            </> : <h4 className="modal__header">
                {message}
            </h4>}
        </div>
    </div>
};

export default Modal;
