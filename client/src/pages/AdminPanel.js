import React from 'react';
import PanelMenu from "../components/PanelMenu";
import LoggedAdminHeader from "../components/LoggedAdminHeader";

const AdminPanel = () => {
    return <div className="container">
        <LoggedAdminHeader />
        <main className="adminMain">
            <PanelMenu menuOpen={0} />
            <div className="adminMain__main">
                <h1 className="adminMain__header">
                    Witaj w panelu administratora jooob.eu!
                </h1>
            </div>
        </main>
    </div>
};

export default AdminPanel;
