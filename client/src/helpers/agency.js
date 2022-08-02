import axios from "axios";
import {getAuthHeader, getLoggedUserEmail} from "./others";

const loginAgency = (email, password) => {
    return axios.post('/agency/login', {
        email, password
    });
}

const registerAgency = (email, password) => {
    return axios.post('/agency/register', {
        email, password
    });
}

const verifyAgency = (token) => {
    return axios.post('/agency/verify', {
        token
    });
}

const getAgencyData = () => {
    return axios.get(`/agency/getAgencyData/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { registerAgency, verifyAgency, loginAgency, getAgencyData }
