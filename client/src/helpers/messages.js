import axios from "axios";

const getChat = (id) => {
    return axios.get(`/messages/getChat/${id}`);
}

const sendMessage = (id, user, agency, title, chat) => {
    return axios.post(`/messages/sendMessage`, {
        id, user, agency, title, chat
    });
}

const getUserMessages = (user) => {
    return axios.get(`/messages/getUserMessages/${user}`);
}

const getAgencyMessages = (agency) => {
    return axios.get(`/messages/getAgencyMessages/${agency}`);
}

export { getChat, sendMessage, getUserMessages, getAgencyMessages }
