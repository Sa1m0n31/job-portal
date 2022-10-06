import React, {useContext, useEffect, useState} from 'react';
import {LanguageContext} from "../App";
import { updateNotes } from "../helpers/notes";
import Loader from "./Loader";

const NotesModal = ({closeModal, notes, agencyId, userId}) => {
    const { c } = useContext(LanguageContext);

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if(notes) {
            setContent(notes);
        }
    }, [notes]);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                closeModal();
            }
        });
    }, []);

    const updateNotesWrapper = () => {
        setLoading(true);

        updateNotes(userId, agencyId, content)
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

    return <div className="modal modal--notes center">
        <div className="modal__inner">
            <button className="modal__inner__closeBtn" onClick={() => { closeModal(); }}>
                &times;
            </button>
            <h4 className="modal__header">
                {c.notes2}
            </h4>

            <label className="modalNotes__label">
                <textarea className="input input--textarea scroll"
                          value={content}
                          onChange={(e) => { setContent(e.target.value); }}
                          placeholder={c.notes4} />
            </label>

            {success ? <span className="info info--success">
                {c.notes3}
            </span> : ''}

            {!loading ? <button className="btn btn--modal btn--modalNotes" onClick={() => { updateNotesWrapper(); }}>
                {c.save}
            </button> : <div className="center">
                <Loader />
            </div>}
        </div>
    </div>
};

export default NotesModal;
