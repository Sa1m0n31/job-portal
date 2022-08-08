import axios from "axios";
import {getAuthHeader, getLoggedUserEmail} from "./others";

const addOffer = (data) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('email', getLoggedUserEmail());
    formData.append('offerData', JSON.stringify(data));
    formData.append('image', data.image);
    for(const att of data.attachments) {
        formData.append('attachments', att.file);
    }

    return axios.post('/offer/add', formData, config);
}

const updateOffer = (data) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('email', getLoggedUserEmail());
    formData.append('offerData', JSON.stringify(data));
    formData.append('image', data.image);
    for(const att of data.attachments) {
        formData.append('attachments', att.file);
    }

    return axios.patch('/offer/update', formData, config);
}

const getJobOffersByAgency = () => {
    return axios.get(`/offer/getOffersByAgency/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getActiveJobOffers = () => {
    return axios.get('/offer/getActive');
}

const deleteOffer = (id) => {
    return axios.delete(`/offer/delete/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getOfferById = (id) => {
    return axios.get(`/offer/get/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { addOffer, getJobOffersByAgency, getActiveJobOffers, deleteOffer,
    getOfferById, updateOffer }
