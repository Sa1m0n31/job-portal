import axios from "axios";
import {getAuthHeader, getLoggedUserEmail} from "./others";
import settings from "../static/settings";

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

export { registerAgency, verifyAgency, loginAgency, getAgencyData, updateAgency, getAllApprovedAgencies,
    filterAgencies, sortAgencies
}
