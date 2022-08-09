import React, {useEffect, useState} from 'react';
import UserHomepage from "../pages/UserHomepage";
import {authUser, getUserData} from "../helpers/user";
import Loader from "./Loader";
import UserEditData from "../pages/UserEditData";
import JobOfferList from "../pages/JobOffersList";

const UserWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    useEffect(() => {
        if(page) {
            authUser()
                .then((res) => {
                    if(res?.status === 201) {
                        getUserData()
                            .then((res) => {
                                console.log(res);
                                if(res?.status === 200) {
                                    let data;
                                    if(res?.data?.data) {
                                        data = JSON.parse(res.data.data);
                                    }
                                    switch(page) {
                                        case 1:
                                            setRender(<UserEditData />);
                                            break;
                                        case 2:
                                            setRender(<UserHomepage data={data}
                                                                    visible={res.data.profileVisible}
                                                                    working={res.data.working}
                                            />);
                                            break;
                                        case 3:
                                            setRender(<JobOfferList data={data} />);
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
