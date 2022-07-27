import axios from "axios";

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

export { registerAgency, verifyAgency, loginAgency }
