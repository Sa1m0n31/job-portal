import axios from 'axios'
import {getAuthHeader, getLoggedUserEmail} from "./others";
import settings from "../static/settings";

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
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    data = {
        ...data,
        profileImageUrl: data?.profileImageUrl?.replaceAll(settings.API_URL, '')
    }

    formData.append('userData', JSON.stringify(data));
    formData.append('email', getLoggedUserEmail());
    formData.append('profileImage', data.profileImage);
    formData.append('bsnNumber', data.bsnNumberDocument);
    for(const att of data.attachments) {
        formData.append('attachments', att);
    }

    return axios.post('/user/update', formData, config);
}

const getUserData = () => {
    return axios.get(`/user/getUserData/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { registerUser, verifyUser, loginUser, authUser, updateUser, getUserData }
