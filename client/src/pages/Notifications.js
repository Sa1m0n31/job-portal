import React, {useContext, useEffect, useState} from 'react';
import {authUser, getUserData, getUserNotifications} from "../helpers/user";
import LoggedUserHeader from "../components/LoggedUserHeader";
import LoggedUserFooter from "../components/LoggedUserFooter";
import {authAgency, getAgencyData, getAgencyNotifications} from "../helpers/agency";
import userPlaceholder from "../static/img/user-placeholder.svg";
import settings from "../static/settings";
import {LanguageContext} from "../App";
import Loader from "../components/Loader";

const Notifications = () => {
    const [data, setData] = useState(null);
    const [agency, setAgency] = useState(false);
    const [render, setRender] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const { c } = useContext(LanguageContext);

    useEffect(() => {
        authUser()
            .then((res) => {
                if(res?.status === 201) {
                    getUserData()
                        .then(async (res) => {
                            if(res?.status === 200) {
                                setData(JSON.parse(res?.data?.data));

                                const userNotifications = await getUserNotifications();

                                if(userNotifications?.data?.length) {
                                    setNotifications(userNotifications.data?.map((item) => {
                                        return {
                                            id: item.n_id,
                                            image: item.a_data ? `${settings.API_URL}/${JSON.parse(item.a_data)?.logo}` : userPlaceholder,
                                            type: item.n_type,
                                            read: item.n_checked,
                                            link: item.n_link,
                                            agency: item.a_data ? JSON.parse(item.a_data)?.name : null
                                        }
                                    }).sort((a, b) => {
                                        if(a.read && !b.read) return 1;
                                        else return -1;
                                    }));
                                }
                                else {
                                    setRender(true);
                                }
                            }
                            else {
                                setRender(true);
                            }
                        })
                        .catch(() => {
                            setRender(true);
                        })
                }
            })
            .catch(() => {
                authAgency()
                    .then((res) => {
                        if(res?.status === 201) {
                            getAgencyData()
                                .then(async (res) => {
                                    if(res?.status === 200) {
                                        setAgency(true);
                                        setData(JSON.parse(res?.data?.data));

                                        const agencyNotifications = await getAgencyNotifications();
                                        if(agencyNotifications?.data?.length) {
                                            setNotifications(agencyNotifications.data?.map((item) => {
                                                return {
                                                    id: item.n_id,
                                                    image: item.u_data ? `${settings.API_URL}/${JSON.parse(item.u_data)?.profileImage}` : userPlaceholder,
                                                    type: item.n_type,
                                                    read: item.n_checked,
                                                    link: item.n_link,
                                                    user: item.u_data ? (JSON.parse(item.u_data)?.firstName ? JSON.parse(item.u_data)?.firstName + ' ' + JSON.parse(item.u_data)?.lastName : 'Ktoś') : 'Ktoś'
                                                }
                                            }).sort((a, b) => {
                                                if(a.read && !b.read) return 1;
                                                else return -1;
                                            }));
                                        }
                                        else {
                                            setRender(true);
                                        }
                                    }
                                    else {
                                        setRender(true);
                                    }
                                })
                                .catch(() => {
                                    setRender(true);
                                });
                        }
                    })
                    .catch(() => {
                        window.location = '/';
                    });
            });
    }, []);

    useEffect(() => {
        if(notifications?.length) {
            setRender(true);
        }
    }, [notifications]);

    return render ? <div className="container">
        {data ? <LoggedUserHeader data={data} agency={agency} /> : ''}

        <main className="page page--100">
            <h1 className="page__header">
                {c.notifications}
            </h1>
            <div className="notificationWrapper flex">
                {notifications?.map((item, index) => {
                    return <a className="notification flex flex--start"
                              href={item.link}
                              key={index}>
                        <figure className="notification__figure">
                            <img className="img" src={item.image} alt="zdjęcie" />
                        </figure>
                        <div className="notification__content">
                            <h3 className="notification__header">
                                {item.type !== 3 ? JSON.parse(c.notificationTitles)[item.type-1] : `${item.user} ${JSON.parse(c.notificationTitles)[2]}`}
                            </h3>
                            <p className="notification__text">
                                {((item.type === 1 || item.type === 2) && item.agency) ? `${c.from} ${item.agency}` : c.checkCandidateProfile}
                            </p>
                        </div>
                    </a>
                })}
            </div>
        </main>

        <LoggedUserFooter />
    </div> : <div className="container container--height100 center">
        <Loader />
    </div>
};

export default Notifications;
