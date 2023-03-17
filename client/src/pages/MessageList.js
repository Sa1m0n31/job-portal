import React, {useContext, useEffect, useState} from 'react';
import LoggedUserHeader from "../components/LoggedUserHeader";
import {
    archiveMessagesByIds,
    getAgencyMessages,
    getUserMessages,
    restoreMessagesByIds,
    sendMessage
} from "../helpers/messages";
import trashIcon from '../static/img/trash.svg'
import dropdownArrow from '../static/img/dropdown-arrow.svg'
import {addLeadingZero, isElementInArray} from "../helpers/others";
import replayIcon from '../static/img/reply-icon.svg'
import {LanguageContext} from "../App";
import backArrow from '../static/img/back-arrow-grey.svg'
import {UserAccountContext} from "../components/UserWrapper";

const MessageList = ({agency, data, accepted, id}) => {
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [selectedMessagesFromArchive, setSelectedMessagesFromArchive] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [section, setSection] = useState(0);
    const [messages, setMessages] = useState([]);
    const [sendMessages, setSendMessages] = useState([]);
    const [update, setUpdate] = useState(false);
    const [currentChat, setCurrentChat] = useState(-1);
    const [currentChatMessages, setCurrentChatMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [placeholderChatSettled, setPlaceholderChatSettled] = useState(false);
    const [currentSendMessage, setCurrentSendMessage] = useState(null);

    const { c } = useContext(LanguageContext);
    const { realAccount } = useContext(UserAccountContext);

    useEffect(() => {
        async function setupMessages() {
            if(id) {
                if(agency) {
                    const agencyMessages = await getAgencyMessages(id);
                    setMessages(agencyMessages?.data?.map((item) => {
                        return {
                            ...item,
                            m_archived: item.m_archivedByAgency
                        }
                    }));
                }
                else {
                    const userMessages = await getUserMessages(id);
                    setMessages(userMessages?.data?.map((item) => {
                        return {
                            ...item,
                            m_archived: item.m_archivedByUser
                        }
                    }));
                }
            }
        }

        setupMessages();
    }, [agency, id, update]);

    useEffect(() => {
        if(messages?.length) {
            setReceivedMessages(messages?.filter((item) => {
                const chat = JSON.parse(item.m_chat);
                const archived = agency ? item.m_archivedByAgency : item.m_archivedByUser;
                return chat.findIndex((item) => {
                    return item.fromAgency !== agency;
                }) !== -1 && !archived;
            }));

            let tmpSendMessages = [];
            for(const topic of messages) {
                const receiver = agency ? (JSON.parse(topic.u_data)?.firstName ? `${JSON.parse(topic.u_data).firstName} ${JSON.parse(topic.u_data).lastName}` : 'Anonimowy') : JSON.parse(topic.a_data)?.name;
                const chat = JSON.parse(topic.m_chat);
                for(const msg of chat) {
                    if(agency === msg.fromAgency) {
                        tmpSendMessages.push({
                            ...msg,
                            title: topic.m_title,
                            receiver: receiver
                        });
                    }
                }
            }
            setSendMessages(tmpSendMessages?.sort((a, b) => {
                const aDate = new Date(a.created_at);
                const bDate = new Date(b.created_at);

                if(aDate > bDate) return -1;
                else return 1;
            }));
        }
    }, [messages]);

    useEffect(() => {
        if(receivedMessages?.length && !placeholderChatSettled) {
            setPlaceholderChatSettled(true);
            showChat(receivedMessages[0]?.m_id, true);
        }
    }, [receivedMessages]);

    const archiveMessages = async (id = null) => {
        await archiveMessagesByIds(id ? [id] : selectedMessages, agency);
        setUpdate(prevState => (!prevState));
    }

    const restoreMessages = async () => {
        await restoreMessagesByIds(selectedMessagesFromArchive, agency);
        setUpdate(prevState => (!prevState));
    }

    const showChat = (id, first = false) => {
        markAsRead(id);
        setCurrentSendMessage(null);
        const chat = messages.find((item) => (item.m_id === id));
        setCurrentChat(chat);
        setCurrentChatMessages(JSON.parse(chat.m_chat).reverse());

        if(window.innerWidth <= 1200 && !first) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

    const showSendMessage = (i) => {
        setCurrentSendMessage(sendMessages[i]);
    }

    const markAsRead = async (id = null) => {
        if(id) {
            let chat = JSON.parse(messages.find((item) => {
                return item.m_id === id;
            }).m_chat)?.map((item) => {
                if(item.fromAgency !== agency) {
                    return {
                        ...item,
                        read: true
                    }
                }
                else {
                    return item;
                }
            });

            await sendMessage(id, 0, 0, 0, chat);
        }
        else {
            for(const msg of selectedMessages) {
                let chat = JSON.parse(messages.find((item) => {
                    return item.m_id === msg;
                }).m_chat)?.map((item) => {
                    if(item.fromAgency !== agency) {
                        return {
                            ...item,
                            read: true
                        }
                    }
                    else {
                        return item;
                    }
                });

                await sendMessage(msg, 0, 0, 0, chat);
            }
            setSelectedMessages([]);
        }

        setUpdate(prevState => (!prevState));
    }

    const markAsUnread = async (id = null) => {
        if(id) {
            let chat = JSON.parse(messages.find((item) => {
                return item.m_id === id;
            }).m_chat)?.map((item) => {
                if(item.fromAgency !== agency) {
                    return {
                        ...item,
                        read: false
                    }
                }
                else {
                    return item;
                }
            });

            await sendMessage(id, 0, 0, 0, chat);
        }
        else {
            for(const msg of selectedMessages) {
                let chat = JSON.parse(messages.find((item) => {
                    return item.m_id === msg;
                }).m_chat)?.map((item) => {
                    if(item.fromAgency !== agency) {
                        return {
                            ...item,
                            read: false
                        }
                    }
                    else {
                        return item;
                    }
                });

                await sendMessage(msg, 0, 0, 0, chat);
            }
        }

        setSelectedMessages([]);
        setUpdate(prevState => (!prevState));
    }

    const selectChat = (id) => {
        if(isElementInArray(id, selectedMessages)) {
            setSelectedMessages(prevState => (prevState?.filter((item) => (item !== id))));
        }
        else {
            setSelectedMessages(prevState => ([...prevState, id]));
        }
    }

    const selectChatFromArchive = (id) => {
        if(isElementInArray(id, selectedMessagesFromArchive)) {
            setSelectedMessagesFromArchive(prevState => (prevState?.filter((item) => (item !== id))));
        }
        else {
            setSelectedMessagesFromArchive(prevState => ([...prevState, id]));
        }
    }

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

    const getLastMessageDatetime = (chat) => {
        return new Date(chat?.slice(-1)[0].created_at);
    }

    return <div className="container container--agencyJobOffers container--jobOffers container--offer container--messages"
                onClick={() => { setDropdownVisible(false); }}>
        <LoggedUserHeader data={data}
                          agency={agency}
                          messageUpdate={update} />

        <aside className="userAccount__top flex">
            <span className="userAccount__top__loginInfo">
                {c.loggedIn}: <span className="bold">{agency ? c.agencyZone : c.userZone}</span>
            </span>
            <a href="javascript: history.back()" className="userAccount__top__btn">
                <img className="img" src={backArrow} alt="powrót" />
                {c.comeback}
            </a>
        </aside>

        <main className="messages flex">
            <div className="messages__section">
                <div className="messages__section__top flex">
                    <h1 className="messages__header">
                        {c.messagesList}
                    </h1>
                    {accepted !== false && realAccount ? <a className="btn btn--newMessage center" href={agency ? "/nowa-wiadomosc" : "/napisz-wiadomosc"}>
                        <span className="d-mobile">{c.write}</span>
                        <span className="d-desktop">{c.newMessage}</span>
                    </a> : ''}
                </div>

                <div className="messages__buttons flex flex--start">
                    <button className={section === 0 ? "btn btn--selected" : "btn"}
                            onClick={() => { setSection(0); }}>
                        {c.received}
                    </button>
                    <button className={section === 1 ? "btn btn--selected" : "btn"}
                            onClick={() => { setSection(1); }}>
                        {c.send}
                    </button>
                    <button className={section === 2 ? "btn btn--selected" : "btn"}
                            onClick={() => { setSection(2); }}>
                        {c.archive}
                        <img className="img" src={trashIcon} alt="kosz" />
                    </button>
                </div>

                <div className="messages__dropdownSection flex flex--start">
                    <button className="btn center" onClick={(e) => { e.stopPropagation(); setDropdownVisible(!dropdownVisible); }}>
                        {c.signAs}
                        <img className="img" src={dropdownArrow} alt="rozwiń" />
                    </button>
                    {section !== 2 ? <button className="btn center" onClick={() => { archiveMessages(); }}>
                        {c.toArchive}
                        <img className="img" src={trashIcon} alt="kosz" />
                    </button> : <button className="btn center" onClick={() => { restoreMessages(); }}>
                        {c.restore}
                    </button>}

                    {dropdownVisible ? <div className="messages__dropdown">
                        <button className="btn" onClick={() => { markAsRead(); }}>
                            {c.read}
                        </button>
                        <button className="btn" onClick={() => { markAsUnread(); }}>
                            {c.notRead}
                        </button>
                    </div> : ''}
                </div>

                <div className="messages__previews">
                    {section === 0 ? <div className="newMessages">
                        {receivedMessages?.filter((item) => (!item.m_archived))?.map((item, index) => {
                            const receiverData = agency ? JSON.parse(item.u_data) : JSON.parse(item.a_data);
                            const lastMessageDatetime = getLastMessageDatetime(JSON.parse(item.m_chat));
                            return <div className={isNew(JSON.parse(item.m_chat)) ? (item.m_id === currentChat.m_id ? "messagePreview messagePreview--new messagePreview--selected flex" : "messagePreview messagePreview--new flex") : (item.m_id === currentChat.m_id ? "messagePreview messagePreview--selected flex" : "messagePreview flex")} key={index}>
                                <div className="messagePreview__left flex flex--start">
                                    <button className={isElementInArray(item.m_id, selectedMessages) ? "messagePreview__checkbox messagePreview__checkbox--selected" : "messagePreview__checkbox"}
                                            onClick={() => { selectChat(item.m_id); }}>
                                        <span></span>
                                    </button>
                                    <button className="messagePreview__content" onClick={() => { showChat(item.m_id); }}>
                                        <h3 className="messagePreview__recipient">
                                            {!agency ? (receiverData?.name ? receiverData.name : c.anonim) : (receiverData?.firstName ? `${receiverData.firstName} ${receiverData.lastName}` : c.anonim)}
                                        </h3>
                                        <h4 className="messagePreview__title">
                                            {item.m_title}
                                        </h4>
                                    </button>
                                </div>
                                <h5 className="messagePreview__time">
                                    {lastMessageDatetime.getDate()}/{lastMessageDatetime.getMonth()+1}/{lastMessageDatetime.getFullYear()}, {addLeadingZero(lastMessageDatetime.getHours())}:{addLeadingZero(lastMessageDatetime.getMinutes())}
                                </h5>
                            </div>
                        })}
                    </div> : (section === 1 ? <>
                        {sendMessages?.map((item, index) => {
                            const lastMessageDatetime = new Date(item.created_at);
                            return <div className="messagePreview flex" key={index}>
                                <div className="messagePreview__left flex flex--start">
                                    <button className="messagePreview__content" onClick={() => { showSendMessage(index); }}>
                                        <h3 className="messagePreview__recipient">
                                            {item.receiver}
                                        </h3>
                                        <h4 className="messagePreview__title">
                                            {item.title}
                                        </h4>
                                    </button>
                                </div>
                                <h5 className="messagePreview__time">
                                    {lastMessageDatetime.getDate()}/{lastMessageDatetime.getMonth()+1}/{lastMessageDatetime.getFullYear()}, {addLeadingZero(lastMessageDatetime.getHours())}:{addLeadingZero(lastMessageDatetime.getMinutes())}
                                </h5>
                            </div>
                        })}
                    </> : <>
                        {messages?.filter((item) => (item.m_archived))?.map((item, index) => {
                            const receiverData = agency ? JSON.parse(item.u_data) : JSON.parse(item.a_data);
                            const lastMessageDatetime = getLastMessageDatetime(JSON.parse(item.m_chat));
                            return <div className="messagePreview flex" key={index}>
                                <div className="messagePreview__left flex flex--start">
                                    <button className={isElementInArray(item.m_id, selectedMessagesFromArchive) ? "messagePreview__checkbox messagePreview__checkbox--selected" : "messagePreview__checkbox"}
                                            onClick={() => { selectChatFromArchive(item.m_id); }}>
                                        <span></span>
                                    </button>
                                    <div className="messagePreview__content">
                                        <h3 className="messagePreview__recipient">
                                            {!agency ? (receiverData?.name ? receiverData.name : c.anonim) : (receiverData?.firstName ? `${receiverData.firstName} ${receiverData.lastName}` : c.anonim)}
                                        </h3>
                                        <h4 className="messagePreview__title">
                                            {item.m_title}
                                        </h4>
                                    </div>
                                </div>
                                <h5 className="messagePreview__time">
                                    {lastMessageDatetime.getDate()}/{lastMessageDatetime.getMonth()+1}/{lastMessageDatetime.getFullYear()}, {addLeadingZero(lastMessageDatetime.getHours())}:{addLeadingZero(lastMessageDatetime.getMinutes())}
                                </h5>
                            </div>
                        })?.reverse()}
                    </>)}
                </div>
            </div>

            <div className="messages__section messages__previews messages__section--content">
                {!currentSendMessage ? currentChatMessages?.map((item, index) => {
                    const messageDatetime = new Date(item.created_at);
                    const agencyRecipientName = JSON.parse(currentChat.a_data)?.name ? JSON.parse(currentChat.a_data).name : c.anonim;
                    const agencyName = data.name ? data.name : c.anonim;
                    const userRecipientName = JSON.parse(currentChat.u_data)?.firstName ? `${JSON.parse(currentChat.u_data).firstName} ${JSON.parse(currentChat.u_data).lastName}` : c.anonim;
                    const userName = data.firstName ? `${data.firstName} ${data.lastName}` : c.anonim;

                    return <div className="currentMessage__item" key={index}>
                        {index === 0 ? <>
                            <div className="messages__chatHeader">
                                <span className="messages__chatHeader__date d-desktop">
                                    {addLeadingZero(messageDatetime.getDate())}/{addLeadingZero(messageDatetime.getMonth()+1)}/{messageDatetime.getFullYear()}, {addLeadingZero(messageDatetime.getHours())}:{addLeadingZero(messageDatetime.getMinutes())}
                                </span>
                                <h4 className="messages__chatHeader__header">
                                    <span className="bold">{c.from}</span> {item.fromAgency ? (agency ? `${c.me} (${agencyName})` : agencyRecipientName) : (agency ? userRecipientName : `${c.me} (${userName})`)}
                                </h4>
                                <h4 className="messages__chatHeader__header">
                                    <span className="bold">{c.to}</span> {!item.fromAgency ? (agency ? `${c.me} (${agencyName})` : agencyRecipientName) : (agency ? `${userRecipientName}` : `${c.me} (${userName})`)}
                                </h4>
                                <h4 className="messages__chatHeader__header">
                                    <span className="bold">{c.topic}:</span> {currentChat?.m_title}
                                </h4>
                                <h4 className="messages__chatHeader__header d-mobile">
                                    <span className="bold">{c.messageDate}:</span> {addLeadingZero(messageDatetime.getDate())}/{addLeadingZero(messageDatetime.getMonth()+1)}/{messageDatetime.getFullYear()}, {addLeadingZero(messageDatetime.getHours())}:{addLeadingZero(messageDatetime.getMinutes())}
                                </h4>
                            </div>
                            <div className="messages__currentChatButtons flex flex--start">
                                <a className="btn" href={agency ? `/nowa-wiadomosc?id=${currentChat.m_id}` : `/napisz-wiadomosc?id=${currentChat.m_id}`}>
                                    <img className="img" src={replayIcon} alt="odpowiedz" />
                                    {c.respond}
                                </a>
                                <button className="btn" onClick={() => { markAsUnread(currentChat.m_id); }}>
                                    {c.markAsNotRead}
                                </button>
                                <button className="btn" onClick={() => { archiveMessages(currentChat.m_id); }}>
                                    <img className="img" src={trashIcon} alt="odpowiedz" />
                                    {c.delete}
                                </button>
                            </div>
                            <div className="messages__currentChatContent" dangerouslySetInnerHTML={{
                                __html: item.content
                            }}>

                            </div>
                        </> : <>
                            <div className="messages__chatHeader">
                                <span className="messages__chatHeader__date d-desktop">
                                    {addLeadingZero(messageDatetime.getDate())}/{addLeadingZero(messageDatetime.getMonth()+1)}/{messageDatetime.getFullYear()}, {addLeadingZero(messageDatetime.getHours())}:{addLeadingZero(messageDatetime.getMinutes())}
                                </span>
                                <h4 className="messages__chatHeader__header">
                                    <span className="bold">{c.from}</span> {item.fromAgency ? (agency ? `${c.me} (${agencyName})` : agencyRecipientName) : (agency ? `${userRecipientName}` : `${c.me} (${userName})`)}
                                </h4>
                                <h4 className="messages__chatHeader__header">
                                    <span className="bold">{c.to}</span> {!item.fromAgency ? (agency ? `${c.me} (${agencyName})` : agencyRecipientName) : (agency ? `${userRecipientName}` : `${c.me} (${userName})`)}
                                </h4>
                                <h4 className="messages__chatHeader__header">
                                    <span className="bold">{c.messageDate}:</span> {addLeadingZero(messageDatetime.getDate())}/{addLeadingZero(messageDatetime.getMonth()+1)}/{messageDatetime.getFullYear()}, {addLeadingZero(messageDatetime.getHours())}:{addLeadingZero(messageDatetime.getMinutes())}
                                </h4>
                            </div>
                            <div className="messages__currentChatContent" dangerouslySetInnerHTML={{
                                __html: item.content
                            }}>

                            </div>
                        </>}
                    </div>
                }) : <>
                    <div className="messages__chatHeader">
                        <span className="messages__chatHeader__date">
                            {new Date(currentSendMessage.created_at).getDate()}/{new Date(currentSendMessage.created_at).getMonth()+1}/{new Date(currentSendMessage.created_at).getFullYear()}, {addLeadingZero(new Date(currentSendMessage.created_at).getHours())}:{addLeadingZero(new Date(currentSendMessage.created_at).getMinutes())}
                        </span>
                        <h4 className="messages__chatHeader__header">
                            <span className="bold">{c.from}</span> {agency ? `${c.me} (${data.name ? data.name : c.anonim})` : (data.firstName ? `${c.me} (${data.firstName} ${data.lastName})` : c.anonim)}
                        </h4>
                        <h4 className="messages__chatHeader__header">
                            <span className="bold">{c.to}</span> {currentSendMessage.receiver}
                        </h4>
                    </div>
                    <div className="messages__currentChatContent" dangerouslySetInnerHTML={{
                        __html: currentSendMessage.content
                    }}>

                    </div>
                </>}
            </div>
        </main>
    </div>
};

export default MessageList;
