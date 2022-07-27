import axios from 'axios'
import {getAuthHeader} from "./others";

const authUser = () => {
    console.log(getAuthHeader());
    return axios.post('/user/auth', {}, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const loginUser = (email, password) => {
    return axios.post('/user/login', {
        email, password
    });
}

const registerUser = (email, password) => {
    return axios.post('/user/register', {
        email, password
    });
}

const verifyUser = (token) => {
    return axios.post('/user/verify', {
        token
    });
}

export { registerUser, verifyUser, loginUser, authUser }
