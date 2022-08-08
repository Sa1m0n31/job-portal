import React, {useEffect, useState} from 'react';
import UserHomepage from "../pages/UserHomepage";
import {authUser, getUserData} from "../helpers/user";
import Loader from "./Loader";
import UserEditData from "../pages/UserEditData";
import AgencyEditData from "../pages/AgencyEditData";
import {getAgencyData} from "../helpers/agency";
import AgencyHomepage from "../pages/AgencyHomepage";
import AddJobOffer from "../pages/AddJobOffer";
import MyJobOffers from "../pages/MyJobOffers";
import EditJobOffer from "../pages/EditJobOffer";

const AgencyWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    useEffect(() => {
        if(page) {
            authUser()
                .then((res) => {
                    if(res?.status === 201) {
                        getAgencyData()
                            .then((res) => {
                                if(res?.status === 200) {
                                    const data = JSON.parse(res.data.data);
                                    switch(page) {
                                        case 1:
                                            setRender(<AgencyEditData />);
                                            break;
                                        case 2:
                                            setRender(<AgencyHomepage data={data} />);
                                            break;
                                        case 3:
                                            setRender(<AddJobOffer />);
                                            break;
                                        case 4:
                                            setRender(<MyJobOffers data={data} />);
                                            break;
                                        case 5:
                                            setRender(<AddJobOffer updateMode={true} />);
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

export default AgencyWrapper;
