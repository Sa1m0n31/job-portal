import React, {useEffect, useState} from 'react';
import UserHomepage from "../pages/UserHomepage";
import {authUser, getUserData} from "../helpers/user";
import Loader from "./Loader";
import UserEditData from "../pages/UserEditData";
import AgencyEditData from "../pages/AgencyEditData";
import {authAgency, getAgencyData} from "../helpers/agency";
import AgencyHomepage from "../pages/AgencyHomepage";
import AddJobOffer from "../pages/AddJobOffer";
import MyJobOffers from "../pages/MyJobOffers";
import CandidatesList from "../pages/CandidatesList";
import CandidateProfile from "../pages/CandidateProfile";
import MessageList from "../pages/MessageList";
import SendMessage from "../pages/SendMessage";
import AddFastJobOffer from "../pages/AddFastJobOffer";
import MyFastJobOffers from "../pages/MyFastJobOffers";
import AgencyApplications from "../pages/AgencyApplications";
import LoggedUserFooter from "./LoggedUserFooter";

const AgencyWrapper = ({page}) => {
    const [render, setRender] = useState(null);

    useEffect(() => {
        if(page) {
            authAgency()
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
                                            setRender(<AgencyHomepage email={res?.data?.email} data={data} />);
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
                                        case 6:
                                            setRender(<AddFastJobOffer />);
                                            break;
                                        case 7:
                                            setRender(<MyFastJobOffers data={data} />);
                                            break;
                                        case 8:
                                            setRender(<AddFastJobOffer updateMode={true} />);
                                            break;
                                        case 9:
                                            setRender(<CandidatesList data={data} />);
                                            break;
                                        case 10:
                                            setRender(<CandidateProfile data={data} />);
                                            break;
                                        case 11:
                                            setRender(<MessageList data={data} agency={true} id={res?.data?.id} />);
                                            break;
                                        case 12:
                                            setRender(<SendMessage data={data} isAgency={true} />);
                                            break;
                                        case 13:
                                            setRender(<AgencyApplications data={data} />);
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

    return render ? <>
        {render}
        {page !== 1 ? <LoggedUserFooter /> : ''}
    </> : <div className="container container--loader center">
        <Loader />
    </div>
};

export default AgencyWrapper;
