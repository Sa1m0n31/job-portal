import axios from 'axios'
import {getAuthHeader} from "./others";

const authUser = () => {
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

const updateUser = (data) => {
    console.log(data);
    // return axios.post('/user/update', {
    //
    // });
}

export { registerUser, verifyUser, loginUser, authUser, updateUser }
