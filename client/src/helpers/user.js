import axios from 'axios'
import {getAuthHeader, getLoggedUserEmail} from "./others";
import settings from "../static/settings";
import Cookies from "universal-cookie";

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

const toggleUserVisibility = () => {
    return axios.patch(`/user/toggleUserVisibility/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const toggleUserWorking = () => {
    return axios.patch(`/user/toggleUserWorking/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getUserApplications = () => {
    return axios.get(`/user/getUserApplications/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const logout = () => {
    const cookies = new Cookies();
    cookies.remove('access_token', { path: '/' });
    cookies.remove('jwt', { path: '/' });
    cookies.remove('email_jooob_domain', { path: '/' });
    cookies.remove('email_jooob', { path: '/' });
    window.location = '/';
}

export { registerUser, verifyUser, loginUser, authUser, updateUser, getUserData, logout,
    toggleUserVisibility, toggleUserWorking, getUserApplications
}
