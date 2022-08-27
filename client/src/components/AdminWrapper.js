import React, {useEffect, useState} from 'react';
import Loader from "./Loader";
import AdminPanel from "../pages/AdminPanel";
import {authAdmin} from "../helpers/admin";
import AdminAgencies from "../pages/AdminAgencies";
import AdminAgencyDetails from "../pages/AdminAgencyDetails";
import AdminUserDetails from "../pages/AdminUserDetails";
import AdminUsers from "../pages/AdminUsers";

const AdminWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    useEffect(() => {
        if(page) {
            authAdmin()
                .then((res) => {
                    if(res?.status === 201) {
                        switch(page) {
                            case 1:
                                setRender(<AdminPanel />);
                                break;
                            case 2:
                                setRender(<AdminAgencies />);
                                break;
                            case 3:
                                setRender(<AdminAgencyDetails />);
                                break;
                            case 4:
                                setRender(<AdminUsers />);
                                break;
                            case 5:
                                setRender(<AdminUserDetails />);
                                break;
                            default:
                                window.location = '/';
                        }
                    }
                    else {
                        window.location = '/';
                    }
                })
                .catch((err) => {
                    window.location = '/';
                });
        }
    }, [page]);

    return render ? <>
        {render}
    </> : <div className="container container--loader center">
        <Loader />
    </div>
};

export default AdminWrapper;
