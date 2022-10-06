import axios from "axios";
import {getAdminAuthHeader, getAuthHeader, getLang, getLoggedUserEmail} from "./others";
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

const registerAgency = (email, password, newsletter) => {
    return axios.post('/agency/register', {
        email, password, newsletter
    });
}

const verifyAgency = (token) => {
    return axios.post('/agency/verify', {
        token
    });
}

const getAgencyData = () => {
    return axios.get(`/agency/getAgencyData/${getLoggedUserEmail()}/${getLang()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getAgencyById = (id) => {
    return axios.get(`/agency/getAgencyById/${id}/${getLang()}`, {
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
        if(img.file) {
            // Add only new images
            formData.append('gallery', img.file);
        }
        else {
            formData.append('oldGallery', img.url);
        }
    }

    return axios.post('/agency/update', formData, config);
}

const getAllApprovedAgencies = (page) => {
    return axios.get(`/agency/getAllApproved/${page}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const filterAgencies = (country, city, distance, sorting, page) => {
    return axios.post(`/agency/filter`, {
        country, city, distance, page, sorting
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const sortAgencies = (type, page) => {
    return axios.get(`/agency/sort/${type}/${page}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getAgencyNotifications = () => {
    return axios.get(`/agency/getNotifications/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const remindAgencyPassword = (email) => {
    return axios.post('/agency/remindPassword', {
        email
    });
}

const resetAgencyPassword = (password, email) => {
    return axios.patch('/agency/resetPassword', {
        password, email
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const changeAgencyPassword = (oldPassword, newPassword, email) => {
    return axios.patch('/agency/changePassword', {
        oldPassword, newPassword, email
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const verifyPasswordToken = (token) => {
    return axios.get(`/agency/verifyPasswordToken/${token}`);
}

const getAllAgencies = (page) => {
    return axios.get(`/agency/getAllAgencies/${page}`, {
        headers: {
            Authorization: getAdminAuthHeader()
        }
    });
}

export { registerAgency, verifyAgency, loginAgency, getAgencyData, updateAgency, getAllApprovedAgencies,
    filterAgencies, sortAgencies, getAgencyById, authAgency, getAgencyNotifications, remindAgencyPassword,
    changeAgencyPassword, verifyPasswordToken, resetAgencyPassword, getAllAgencies
}
