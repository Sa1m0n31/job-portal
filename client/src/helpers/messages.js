import axios from "axios";
import {getAuthHeader} from "./others";

const getChat = (id) => {
    return axios.get(`/messages/getChat/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const sendMessage = (id, user, agency, title, chat) => {
    return axios.post(`/messages/sendMessage`, {
        id, user, agency, title, chat
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getUserMessages = (user) => {
    return axios.get(`/messages/getUserMessages/${user}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getAgencyMessages = (agency) => {
    return axios.get(`/messages/getAgencyMessages/${agency}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const archiveMessagesByIds = (ids, byAgency) => {
    return axios.patch(`/messages/archiveMessages`, {
        ids, byAgency
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const restoreMessagesByIds = (ids, byAgency) => {
    return axios.patch(`/messages/restoreMessages`, {
        ids, byAgency
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { getChat, sendMessage, getUserMessages, getAgencyMessages,
    archiveMessagesByIds, restoreMessagesByIds }
