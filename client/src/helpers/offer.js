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
    formData.append('agencyData', JSON.stringify(data));
    formData.append('image', data.image);
    for(const img of data.attachments) {
        console.log(img);
        formData.append('attachments', img.file);
    }

    return axios.post('/offer/add', formData, config);
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

export { addOffer, getJobOffersByAgency, getActiveJobOffers }
