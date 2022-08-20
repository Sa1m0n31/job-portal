import React, {useEffect, useRef, useState} from 'react';
import {getAllUsers, getUserById, getUserData} from "../helpers/user";
import {getChat, sendMessage} from "../helpers/messages";
import {getAgencyById, getAgencyData, getAllApprovedAgencies} from "../helpers/agency";
import Select from 'react-select'
import LoggedUserHeader from "../components/LoggedUserHeader";
import backArrow from "../static/img/back-arrow-grey.svg";
import whiteArrow from '../static/img/small-white-arrow.svg'
import {formErrors} from "../static/content";
import checkIcon from "../static/img/green-check.svg";

const SendMessage = ({isAgency, data}) => {
    const [recipient, setRecipient] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [chat, setChat] = useState([]);
    const [error, setError] = useState('');
    const [recipientChoices, setRecipientChoices] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState(null);
    const [agency, setAgency] = useState(null);

    const messageForm = useRef(null);
    const messageSuccess = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const agencyParam = params.get('agencja');
        const userParam = params.get('kandydat');
        const idParam = params.get('id');

        async function setupMessage() {
            if(isAgency) {
                // Agency account
                const agencyResponse = await getAgencyData();
                const agencyId = agencyResponse?.data?.id;
                setAgency(agencyId);

                if(userParam) {
                    // Set default recipient
                    const userResponse = await getUserById(userParam);
                    const userData = JSON.parse(userResponse.data.data);
                    setRecipient({
                        label: userData?.firstName ? `${userData?.firstName} ${userData?.lastName}` : userResponse?.data?.email,
                        value: userResponse?.data?.id
                    });
                    setUser(userResponse?.data?.id);
                }
                else if(idParam) {
                    // Get current chat
                    setChatId(parseInt(idParam));
                    const chatResponse = await getChat(parseInt(idParam));
                    const chatData = chatResponse?.data;
                    setChat(JSON.parse(chatData?.chat));
                    setTitle(chatData.title);

                    const userResponse = await getUserById(chatData.user);
                    const userData = JSON.parse(userResponse.data.data);
                    setRecipient({
                        label: userData?.firstName ? `${userData?.firstName} ${userData?.lastName}` : userResponse?.data?.email,
                        value: userResponse?.data?.id
                    });
                }

                // Get list of users
                const allUsersResponse = await getAllUsers(null)
                setRecipientChoices(allUsersResponse?.data?.map((item) => ({
                    label: JSON.parse(item.data)?.firstName ? JSON.parse(item.data)?.firstName + ' ' + JSON.parse(item.data)?.lastName : item.email,
                    value: item.id
                })));
            }
            else {
                // User account
                const userResponse = await getUserData();
                const userId = userResponse?.data?.id;
                setUser(userId);

                if(agencyParam) {
                    // Set default recipient
                    const agencyResponse = await getAgencyById(agencyParam)
                    const agencyData = JSON.parse(agencyResponse.data.data);
                    setRecipient({
                        label: agencyData?.name ? agencyData?.name : agencyResponse?.data?.email,
                        value: agencyResponse?.data?.id
                    });
                    setAgency(agencyResponse?.data?.id);
                }
                else if(idParam) {
                    // Get current chat
                    setChatId(parseInt(idParam));
                    const chatResponse = await getChat(parseInt(idParam));
                    const chatData = chatResponse?.data;
                    setChat(JSON.parse(chatData?.chat));
                    setTitle(chatData.title);

                    const agencyResponse = await getAgencyById(chatData.agency);
                    const agencyData = JSON.parse(agencyResponse.data.data);
                    setRecipient({
                        label: agencyData?.name ? agencyData?.name : agencyResponse?.data?.email,
                        value: agencyResponse?.data?.id
                    });
                }

                // Get list of agencies
                const allAgenciesResponse = await getAllApprovedAgencies(null);
                setRecipientChoices(allAgenciesResponse?.data?.map((item) => ({
                    label: JSON.parse(item.data)?.name ? JSON.parse(item.data)?.name : item.email,
                    value: item.id
                })));
            }
        }

        setupMessage();
    }, [agency]);

    const handleSelect = (data) => {
        setRecipient(data);
    }

    const handleSubmit = async () => {
        if(!title) {
            setError('Uzupełnij tytuł wiadomości');
            return 0;
        }
        if((!user && !recipient) || (!agency && !recipient)) {
            setError('Wpisz nadawcę wiadomości');
            return 0;
        }

        // Append new message to chat column
        let newChat;
        if(chat?.length) {
            newChat = [
                ...chat,
                {
                    fromAgency: !!isAgency,
                    content: content,
                    created_at: new Date(),
                    read: false
                }
            ];
        }
        else {
            if(content) {
                newChat = [{
                    fromAgency: !!isAgency,
                    content: content,
                    created_at: new Date(),
                    read: false
                }];
            }
            else {
                setError('Wiadomość nie może być pusta');
                return 0;
            }
        }

        // Send request
        const sendResult = await sendMessage(chatId, user ? user : recipient?.value, agency ? agency : recipient?.value, title, newChat);
        if(sendResult.status === 201) {
            setSuccess(true);
        }
        else {
            setError(formErrors[1]);
        }
    }

    useEffect(() => {
        if(success) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            messageForm.current.style.opacity = '0';
            setTimeout(() => {
                messageSuccess.current.style.opacity = '1';
                messageSuccess.current.style.height = 'auto';
                messageSuccess.current.style.visibility = 'visible';
            }, 300);
        }
    }, [success]);

    return <div className="container container--agencyJobOffers container--agenciesList container--offer container--sendMessage">
        <LoggedUserHeader data={data} agency={isAgency} />

        <aside className="userAccount__top flex">
            <span className="userAccount__top__loginInfo">
                Zalogowany w: <span className="bold">{agency ? 'Strefa pracodawcy' : 'Strefa pracownika'}</span>
            </span>
            <a href={!agency ? '/moje-wiadomosci' : "/wiadomosci"} className="userAccount__top__btn">
                <img className="img" src={backArrow} alt="powrót" />
                Wróć do wiadomości
            </a>
        </aside>

        <div className="addOfferSuccess" ref={messageSuccess}>
            <img className="img" src={checkIcon} alt="check" />
            <h3 className="addOfferSuccess__header">
                Twoja wiadomość została wysłana
            </h3>
            <div className="flex">
                <a className="btn" href="/">
                    Strona główna
                </a>
                <a className="btn btn--white" href={isAgency ? "/wiadomosci" : "/moje-wiadomosci"}>
                    Moje wiadomości
                </a>
            </div>
        </div>

        <main className="writeMessage" ref={messageForm}>
            <label className="label">
                Adresat
                <Select
                    options={recipientChoices}
                    placeholder="Adresat wiadomości"
                    value={recipient}
                    onChange={handleSelect}
                    isSearchable={true}
                />
            </label>
            <label className="label">
                Temat wiadomości
                <input className="input input--messageTitle"
                       value={title}
                       disabled={chatId}
                       onChange={(e) => { setTitle(e.target.value); }} />
            </label>
            <label className="contentLabel">
                <textarea className="textarea--content"
                          value={content}
                          onChange={(e) => { setContent(e.target.value); }}
                          placeholder="Twoja wiadomość..." />
            </label>

            {error ? <span className="info info--error">
                {error}
            </span> : ''}

            <button className="btn btn--sendMessage center"
                    onClick={() => { handleSubmit(); }}>
                Wyślij
                <img className="img" src={whiteArrow} alt="dalej" />
            </button>
        </main>
    </div>
};

export default SendMessage;