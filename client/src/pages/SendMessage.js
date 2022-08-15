import React, {useEffect, useState} from 'react';
import {getAllUsers, getUserById, getUserData} from "../helpers/user";
import {getChat, sendMessage} from "../helpers/messages";
import {getAgencyById, getAgencyData, getAllApprovedAgencies} from "../helpers/agency";
import Select from 'react-select'
import LoggedUserHeader from "../components/LoggedUserHeader";
import backArrow from "../static/img/back-arrow-grey.svg";
import whiteArrow from '../static/img/small-white-arrow.svg'
import {formErrors} from "../static/content";

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
                        label: userData?.name ? userData?.name : userResponse?.data?.email,
                        value: userResponse?.data?.id
                    });
                    setUser(userResponse?.data?.id);
                }
                else if(idParam) {
                    // Get current chat
                    setChatId(parseInt(idParam));
                    const chatResponse = await getChat(userParam, agencyId);
                    const chatData = chatResponse?.data;
                    setChat(JSON.parse(chatData?.chat));
                    setTitle(chatData.title);

                    const userResponse = await getUserById(chatData.user);
                    const userData = JSON.parse(userResponse.data.data);
                    setRecipient({
                        label: userData?.name ? userData?.name : userResponse?.data?.email,
                        value: userResponse?.data?.id
                    });
                }
                else {
                    window.location = '/';
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
                    const chatResponse = await getChat(userId, agencyParam);
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
                else {
                    window.location = '/';
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
            newChat = [{
                fromAgency: !!isAgency,
                content: content,
                created_at: new Date(),
                read: false
            }];
        }

        // Send request
        console.log(title);
        const sendResult = await sendMessage(chatId, user, agency, title, newChat);
        console.log(sendResult);
        if(sendResult.status === 201) {
            setSuccess(true);
            console.log('success');
        }
        else {
            setError(formErrors[1]);
        }
    }

    return <div className="container container--agencyJobOffers container--agenciesList container--offer">
        <LoggedUserHeader data={data} agency={isAgency} />

        <aside className="userAccount__top flex">
            <span className="userAccount__top__loginInfo">
                Zalogowany w: <span className="bold">{agency ? 'Strefa pracodawcy' : 'Strefa pracownika'}</span>
            </span>
            <a href="/wiadomosci" className="userAccount__top__btn">
                <img className="img" src={backArrow} alt="powrót" />
                Wróć do wiadomości
            </a>
        </aside>

        <main className="writeMessage">
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
            <button className="btn btn--sendMessage center"
                    onClick={() => { handleSubmit(); }}>
                Wyślij
                <img className="img" src={whiteArrow} alt="dalej" />
            </button>
        </main>
    </div>
};

export default SendMessage;
