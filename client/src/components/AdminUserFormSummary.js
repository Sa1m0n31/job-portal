import React from 'react';

const AdminUserFormSummary = () => {
    return <div className="userForm userForm--summary userForm--summary--admin">
        <h3 className="userForm--summary__header">
            Profil kandydata został zaktualizowany
        </h3>
        <div className="userForm--summary__buttons flex">
            <a className="btn btn--userForm btn--widthAuto" href="/panel/pracownicy">
                Wróć do listy kandydatów
            </a>
        </div>
    </div>
};

export default AdminUserFormSummary;
