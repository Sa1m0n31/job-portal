import axios from "axios";
import {getAuthHeader, getLoggedUserEmail} from "./others";
import settings from "../static/settings";
import Cookies from "universal-cookie";

const authAgency = () => {
    const cookies = new Cookies();

    return axios.post('/user/authAgency', {
        email: getLoggedUserEmail(),
        role: cookies.get('jooob_account_type')
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

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

const getAgencyById = (id) => {
    return axios.get(`/agency/getAgencyById/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const updateAgency = (data) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    data = {
        ...data,
        logoUrl: data?.logoUrl?.replaceAll(settings.API_URL, '')
    }

    formData.append('agencyData', JSON.stringify(data));
    formData.append('email', getLoggedUserEmail());
    formData.append('logo', data.logo);
    for(const img of data.gallery) {
        formData.append('gallery', img.file);
    }

    return axios.post('/agency/update', formData, config);
}

const getAllApprovedAgencies = (page) => {
    return axios.get(`/agency/getAllApproved/${page}`);
}

const filterAgencies = (country, city, distance, page) => {
    return axios.post(`/agency/filter`, {
        country, city, distance, page
    });
}

const sortAgencies = (type, page) => {
    return axios.get(`/agency/sort/${type}/${page}`);
}

const getAgencyNotifications = () => {
    return axios.get(`/agency/getNotifications/${getLoggedUserEmail()}`);
}

const remindAgencyPassword = (email) => {
    return axios.post('/agency/remindPassword', {
        email
    });
}

const resetAgencyPassword = (password, email) => {
    return axios.patch('/agency/resetPassword', {
        password, email
    });
}

const changeAgencyPassword = (oldPassword, newPassword, email) => {
    return axios.post('/agency/changePassword', {
        oldPassword, newPassword, email
    });
}

const verifyPasswordToken = (token) => {
    return axios.get(`/agency/verifyPasswordToken/${token}`);
}

export { registerAgency, verifyAgency, loginAgency, getAgencyData, updateAgency, getAllApprovedAgencies,
    filterAgencies, sortAgencies, getAgencyById, authAgency, getAgencyNotifications, remindAgencyPassword,
    changeAgencyPassword, verifyPasswordToken, resetAgencyPassword
}
