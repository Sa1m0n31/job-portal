import React, {useContext, useEffect} from 'react';
import xIcon from '../static/img/x-button.svg'
import {LanguageContext} from "../App";

const Modal = ({header, closeModal, modalAction, message}) => {
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
            <img className="img img--x" src={xIcon} alt="usuń" />
            {!message ? <>
                <h4 className="modal__header">
                    {header}
                </h4>
                <div className="modal__buttons flex">
                    <button className="btn btn--modal btn--modal--delete" onClick={() => { modalAction(); }}>
                        {c.delete}
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
