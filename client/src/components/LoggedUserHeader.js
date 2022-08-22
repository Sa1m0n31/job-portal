import React, {useEffect, useState} from 'react';
import MobileHeader from "./MobileHeader";
import logo from '../static/img/logo-czarne.png'
import messageIcon from '../static/img/message-blue.svg'
import bellIcon from '../static/img/bell-ring.svg'
import arrowDown from '../static/img/arrow-down.svg'
import settings from "../static/settings";
import {getUserData, getUserNotifications, logout, readNotification} from "../helpers/user";
import logoutIcon from '../static/img/logout.svg'
import userPlaceholder from '../static/img/user-placeholder.svg'
import {getAgencyMessages, getUserMessages} from "../helpers/messages";
import {getAgencyData, getAgencyNotifications} from "../helpers/agency";
import messagesIcon from '../static/img/messages-arrow.svg'
import {notificationTitles} from "../static/content";

const LoggedUserHeader = ({data, agency, messageUpdate}) => {
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [userMenuVisible, setUserMenuVisible] = useState(false);
    const [messagesDropdown, setMessagesDropdown] = useState(false);
    const [notificationsDropdown, setNotificationsDropdown] = useState(false);
    const [newMessages, setNewMessages] = useState(0);
    const [newNotifications, setNewNotifications] = useState(false);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
            if(e.key === 'Escape') {
                setMessagesDropdown(false);
                setNotificationsDropdown(false);
            }
        });
    }, []);

    useEffect(() => {
        async function setupMessagesAndNotifications() {
            if(agency !== null) {
                if(agency) {
                    const agencyData = await getAgencyData();

                    const agencyMessages = await getAgencyMessages(agencyData?.data?.id);
                    const agencyNotifications = await getAgencyNotifications();

                    setMessages(agencyMessages?.data?.filter((item) => {
                        const chat = JSON.parse(item.m_chat);
                        return chat.findIndex((item) => {
                            return item.fromAgency !== agency;
                        }) !== -1 && !item.m_archivedByAgency;
                    }));
                    if(agencyNotifications?.data) {
                        setNotifications(agencyNotifications.data?.map((item) => {
                            return {
                                id: item.n_id,
                                image: item.u_data ? JSON.parse(item.u_data)?.profileImage : userPlaceholder,
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
                }
                else {
                    const userData = await getUserData();

                    const userMessages = await getUserMessages(userData?.data?.id);
                    const userNotifications = await getUserNotifications();

                    setMessages(userMessages?.data?.filter((item) => {
                        const chat = JSON.parse(item.m_chat);
                        return chat.findIndex((item) => {
                            return item.fromAgency !== agency;
                        }) !== -1 && !item.m_archivedByUser;
                    }));
                    if(userNotifications?.data) {
                        setNotifications(userNotifications.data?.map((item) => {
                            return {
                                id: item.n_id,
                                image: item.a_data ? JSON.parse(item.a_data)?.logo : userPlaceholder,
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
                }
            }
        }

        setupMessagesAndNotifications();
    }, [agency, messageUpdate]);

    useEffect(() => {
        if(messages?.length) {
            setNewMessages(messages.filter((item) => {
                return isNew(JSON.parse(item.m_chat));
            })?.length);
        }
    }, [messages]);

    useEffect(() => {
        if(notifications?.length) {
            setNewNotifications(notifications.filter((item) => {
                return !item.read;
            })?.length);
        }
    }, [notifications]);

    const isNew = (chat) => {
        let lastMessage;
        if(agency) {
            lastMessage = chat?.filter((item) => (!item.fromAgency));
        }
        else {
            lastMessage = chat?.filter((item) => (item.fromAgency));
        }

        if(lastMessage?.length) {
            return !lastMessage.slice(-1)[0]?.read;
        }
        else {
            return false;
        }
    }

    const readNotificationAndRedirect = async (read, link, notificationId) => {
        if(!read) await readNotification(notificationId);
        window.location = link;
    }

    return <header className="loggedUserHeader" onClick={() => { setMessagesDropdown(false); setNotificationsDropdown(false); }}>
        <MobileHeader loggedUser={!agency}
                      loggedAgency={agency}
                      newMessages={newMessages}
                      newNotifications={newNotifications} />

        <div className="loggedUserHeader__desktop flex">
            <a href="/" className="logo">
                <img className="img" src={logo} alt="portal-pracy" />
            </a>

            <div className="loggedUserHeader__menu flex">
                {!agency ? <>
                    <a className="loggedUserHeader__menu__item loggedUserHeader__menu__item--blue"
                       href="/oferty-pracy">
                        Aktywne oferty pracy
                    </a>
                    <a className="loggedUserHeader__menu__item loggedUserHeader__menu__item--red"
                       href="/oferty-blyskawiczne">
                        Oferty błyskawiczne
                    </a>
                </> : <>
                    <a className="loggedUserHeader__menu__item loggedUserHeader__menu__item--blue"
                       href="/zgloszenia">
                        Zgłoszenia
                    </a>
                </>}
                {agency ? <>
                    <a className="loggedUserHeader__menu__item"
                       href="/moje-blyskawiczne-oferty-pracy">
                        Moje błyskawiczne oferty
                    </a>
                    <a className="loggedUserHeader__menu__item"
                       href="/moje-oferty-pracy">
                        Moje oferty
                    </a>
                    <a className="loggedUserHeader__menu__item"
                       href="/kandydaci">
                        Kandydaci
                    </a>
                </> : <>
                    <a className="loggedUserHeader__menu__item"
                       href="/pracodawcy">
                        Pracodawcy
                    </a>
                    <a className="loggedUserHeader__menu__item"
                       href="/kontakt">
                        Kontakt
                    </a>
                </>
                }
            </div>

            <div className="loggedUserHeader__notificationsContainer">
                <div className="rel">
                    <button className={!newMessages ? "loggedUserHeader__notificationBtn" : "loggedUserHeader__notificationBtn loggedUserHeader__notificationBtn--new"}
                            onClick={(e) => { e.stopPropagation(); setMessagesDropdown(!messagesDropdown); setNotificationsDropdown(false); }}>
                        <img className="img" src={messageIcon} alt="wiadomosci" />
                    </button>

                    {messagesDropdown ? <div className="notifications__dropdown">
                        <a className="notifications__dropdown__item notifications__dropdown__item--bottom"
                           href={agency ? '/wiadomosci' : '/moje-wiadomosci'}>
                            {newMessages?.length ? `Nowe wiadomości: ${newMessages}` : 'Nie masz nowych wiadomości'}
                        </a>
                        {messages?.map((item, index) => {
                            if(index < 2) {
                                const receiverData = agency ? JSON.parse(item.u_data) : JSON.parse(item.a_data);
                                const receiver = !agency ? (receiverData.name ? receiverData.name : 'Anonimowy') : (receiverData.firstName ? `${receiverData.firstName} ${receiverData.lastName}` : 'Anonimowy');
                                return <a className="notifications__dropdown__item"
                                          key={index}
                                          href={agency ? '/wiadomosci' : '/moje-wiadomosci'}>
                                    <span className={isNew(JSON.parse(item.m_chat)) ? "notifications__dropdown__item__recipient bold" : "notifications__dropdown__item__recipient"}>
                                        {receiver}
                                    </span>
                                    <span className="notifications__dropdown__item__title">
                                        {item.m_title}
                                    </span>
                                </a>
                            }
                        })}
                        {messages?.length ? <a className="notifications__dropdown__item notifications__dropdown__item--bottom"
                                               href={agency ? '/wiadomosci' : '/moje-wiadomosci'}>
                            Wszystkie wiadomości
                            <img className="img" src={messagesIcon} alt="wiadomosci" />
                        </a>: ''}
                    </div> : ''}
                </div>
                <div className="rel">
                    <button className={!newNotifications ? "loggedUserHeader__notificationBtn" : "loggedUserHeader__notificationBtn loggedUserHeader__notificationBtn--new"}
                            onClick={(e) => { e.stopPropagation(); setNotificationsDropdown(!notificationsDropdown); setMessagesDropdown(false); }}>
                        <img className="img" src={bellIcon} alt="wiadomosci" />
                    </button>

                    {notificationsDropdown ? <div className="notifications__dropdown">
                        <a className="notifications__dropdown__item notifications__dropdown__item--bottom"
                           href="/powiadomienia">
                            {newNotifications ? `Nowe powiadomienia: ${newNotifications}` : 'Nie masz nowych powiadomień'}
                        </a>
                        {notifications?.map((item, index) => {
                            if(index < 2) {
                                return <button className="notifications__dropdown__item"
                                          key={index}
                                         onClick={() => { readNotificationAndRedirect(item.read, item.link, item.id); }}>
                                    <span className={!item.read ? "notifications__dropdown__item__recipient bold" : "notifications__dropdown__item__recipient"}>
                                        {item.type !== 3 ? notificationTitles[item.type-1] : `${item.user} ${notificationTitles[2]}`}
                                    </span>
                                    <span className="notifications__dropdown__item__title">
                                        {((item.type === 1 || item.type === 2) && item.agency) ? `Od ${item.agency}` : 'Sprawdź profil kandydata'}
                                    </span>
                                </button>
                            }
                        })}
                        {notifications?.length ? <a className="notifications__dropdown__item notifications__dropdown__item--bottom"
                                               href="/powiadomienia">
                            Wszystkie powiadomienia
                            <img className="img" src={messagesIcon} alt="wiadomosci" />
                        </a>: ''}
                    </div> : ''}
                </div>
            </div>

            <div className="rel">
                <button className="loggedUserHeader__userBtn flex" onClick={() => { setUserMenuVisible(!userMenuVisible); }}>
                    <figure>
                        <img className="img"
                             src={data?.logo || data?.profileImage ? (!agency ? `${settings.API_URL}/${data?.profileImage}` : `${settings.API_URL}/${data?.logo}`) : userPlaceholder}
                             alt="zdjecie-profilowe" />
                    </figure>
                    <span className="loggedUserHeader__fullName">
                        {!agency ? (data?.firstName ? `${data?.firstName} ${data?.lastName}` : 'Menu') : (data?.name ? data?.name : 'Menu')}
                    </span>
                    <img className="arrowImg" src={arrowDown} alt="rowiń" />
                </button>

                {userMenuVisible ? <div className="loggedUserHeader__userDropdownMenu">
                    {agency ? <>
                        <a href="/dodaj-oferte-pracy"
                           className="loggedUserHeader__userDropdownMenu__item">
                            Dodaj ofertę pracy
                        </a>
                        <a href="/dodaj-blyskawiczna-oferte-pracy"
                           className="loggedUserHeader__userDropdownMenu__item">
                            Dodaj błyskawiczną ofertę pracy
                        </a>
                    </> : ''}
                    <a href={agency ? "/konto-agencji" : "/konto-pracownika"}
                       className="loggedUserHeader__userDropdownMenu__item">
                        Mój profil
                    </a>
                    <a href="/zmiana-hasla"
                       className="loggedUserHeader__userDropdownMenu__item">
                        Zmień hasło
                    </a>
                    <button onClick={() => { logout(); }}
                        className="loggedUserHeader__userDropdownMenu__item">
                        Wyloguj się
                        <img className="img" src={logoutIcon} alt="wyloguj-sie" />
                    </button>
                </div> : ''}
            </div>
        </div>
    </header>
};

export default LoggedUserHeader;
