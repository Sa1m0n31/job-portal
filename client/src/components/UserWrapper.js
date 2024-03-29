import React, {useEffect, useState} from 'react';
import UserHomepage from "../pages/UserHomepage";
import {authUser, getUserData} from "../helpers/user";
import Loader from "./Loader";
import UserEditData from "../pages/UserEditData";
import JobOfferList from "../pages/JobOffersList";
import ApplicationForJobPage from "../pages/ApplicationForJobPage";
import AgenciesList from "../pages/AgenciesList";
import AgencyProfile from "../pages/AgencyProfile";
import MessageList from "../pages/MessageList";
import SendMessage from "../pages/SendMessage";
import FastJobOfferList from "../pages/FastJobOffersList";
import SingleFastOffer from "../pages/SingleFastOffer";
import LoggedUserFooter from "./LoggedUserFooter";
import {parseUserData} from "../helpers/others";
import UserNotCompleteAccountModal from "./UserNotCompleteAccountModal";

const UserAccountContext = React.createContext({});

const UserWrapper = ({page}) => {
    const [render, setRender] = useState(null);
    const [realAccount, setRealAccount] = useState(false);
    const [userNotComplete, setUserNotComplete] = useState(false);

    useEffect(() => {
        if(page) {
            authUser()
                .then((res) => {
                    if(res?.status === 201) {
                        getUserData()
                            .then((res) => {
                                if(res?.status === 200) {
                                    if(res?.data?.id !== 94) {
                                        setRealAccount(true);

                                        if(res?.data?.data === '{}') {
                                            setUserNotComplete(true);
                                        }
                                        else {
                                            let data = JSON.parse(res.data.data);

                                            if(!data.profileImage || !data.profileImageUrl) {
                                                setUserNotComplete(true);
                                            }
                                        }
                                    }

                                    let data;
                                    let ownCv = res?.data?.own_cv;
                                    if(res?.data?.data) {
                                        data = JSON.parse(res.data.data);
                                        data = parseUserData(data);
                                    }
                                    switch(page) {
                                        case 1:
                                            setRender(<UserEditData />);
                                            break;
                                        case 2:
                                            setRender(<UserHomepage data={data}
                                                                    ownCv={ownCv}
                                                                    userId={res?.data?.id}
                                                                    visible={res.data.profileVisible}
                                                                    working={res.data.working} />);
                                            break;
                                        case 3:
                                            setRender(<JobOfferList data={data} />);
                                            break;
                                        case 5:
                                            setRender(<ApplicationForJobPage data={data} />);
                                            break;
                                        case 6:
                                            setRender(<AgenciesList data={data} />);
                                            break;
                                        case 7:
                                            setRender(<FastJobOfferList data={data} />);
                                            break;
                                        case 8:
                                            setRender(<MessageList data={data}
                                                                   id={res?.data?.id}
                                                                   agency={false} />);
                                            break;
                                        case 9:
                                            setRender(<SendMessage data={data} agency={false} />);
                                            break;
                                        case 10:
                                            setRender(<AgencyProfile data={data} user={true} />);
                                            break;
                                        case 11:
                                            setRender(<SingleFastOffer data={data} />);
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
                .catch((err) => {
                    window.location = '/';
                });
        }
    }, [page]);

    return render ? <UserAccountContext.Provider value={{
        realAccount
    }}>

        {page !== 1 && userNotComplete ? <UserNotCompleteAccountModal /> : ''}

        {render}
        {page !== 1 ? <LoggedUserFooter /> : ''}
    </UserAccountContext.Provider> : <div className="container container--loader center">
        <Loader />
    </div>
};

export default UserWrapper;
export { UserAccountContext }
