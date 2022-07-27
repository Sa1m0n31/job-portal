import React, {useEffect, useState} from 'react';
import UserHomepage from "../pages/UserHomepage";
import {authUser} from "../helpers/user";
import Loader from "./Loader";

const UserWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    useEffect(() => {
        if(page) {
            authUser()
                .then((res) => {
                    if(res?.status === 201) {
                        switch(page) {
                            case 1:
                                setRender(<UserHomepage />);
                                break;
                            default:
                                window.location = '/';
                        }
                    }
                    else {
                        window.location = '/';
                    }
                })
                .catch(() => {
                    window.location = '/';
                });
        }
    }, [page]);

    return render ? render : <div className="container container--loader center">
        <Loader />
    </div>
};

export default UserWrapper;
