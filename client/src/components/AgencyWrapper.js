import React, {useEffect, useState} from 'react';
import UserHomepage from "../pages/UserHomepage";
import {authUser, getUserData} from "../helpers/user";
import Loader from "./Loader";
import UserEditData from "../pages/UserEditData";
import AgencyEditData from "../pages/AgencyEditData";

const AgencyWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    useEffect(() => {
        if(page) {
            // authUser()
            //     .then((res) => {
            //         if(res?.status === 201) {
            //             getUserData()
            //                 .then((res) => {
            //                     if(res?.status === 200) {
            //                         const data = JSON.parse(res.data.data);
                                    switch(page) {
                                        case 1:
                                            setRender(<AgencyEditData />);
                                            break;
                                        default:
                                            window.location = '/';
                                    }
                //                 }
                //                 else {
                //                     window.location = '/';
                //                 }
                //             })
                //             .catch(() => {
                //                window.location = '/';
                //             });
                //     }
                //     else {
                //         window.location = '/';
                //     }
                // })
                // .catch(() => {
                //     window.location = '/';
                // });
        }
    }, [page]);

    return render ? render : <div className="container container--loader center">
        <Loader />
    </div>
};

export default AgencyWrapper;
