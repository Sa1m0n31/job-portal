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

const getActiveJobOffers = (page) => {
    return axios.get(`/offer/getActive/${page}`);
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

const submitApplication = (id, message, contactForms, attachments) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('id', id);
    formData.append('attachmentsNames', JSON.stringify(attachments.map((item) => (item.name))));
    formData.append('email', getLoggedUserEmail());
    formData.append('contactForms', JSON.stringify(contactForms));
    formData.append('message', message)
    for(const att of attachments) {
        console.log(att);
        formData.append('attachments', att.file);
    }

    return axios.post('/offer/addApplication', formData, config);
}

const filterOffers = (page, title, category, country, city, distance, salaryType, salaryFrom, salaryTo, salaryCurrency) => {
    return axios.post(`/offer/filter`, {
        page, title, category, country, city, distance, salaryType, salaryFrom, salaryTo, salaryCurrency
    });
}

const getActiveFastOffers = () => {
    return axios.get(`/offer/getActiveFastOffers`);
}

const addFastOffer = (data) => {
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

    return axios.post('/offer/addFastOffer', formData, config);
}

const updateFastOffer = (data) => {
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

    return axios.patch('/offer/updateFastOffer', formData, config);
}

const getFastJobOffersByAgency = () => {
    return axios.get(`/offer/getFastOffersByAgency/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const deleteFastOffer = (id) => {
    return axios.delete(`/offer/deleteFastOffer/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getFastOfferById = (id) => {
    return axios.get(`/offer/getFastOffer/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const submitFastApplication = (id, message, contactForms, attachments) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('id', id);
    formData.append('attachmentsNames', JSON.stringify(attachments.map((item) => (item.name))));
    formData.append('email', getLoggedUserEmail());
    formData.append('contactForms', JSON.stringify(contactForms));
    formData.append('message', message)
    for(const att of attachments) {
        console.log(att);
        formData.append('attachments', att.file);
    }

    return axios.post('/offer/addFastApplication', formData, config);
}

export { addOffer, getJobOffersByAgency, getActiveJobOffers, deleteOffer,
    getOfferById, updateOffer, submitApplication, filterOffers, getActiveFastOffers,
    addFastOffer, updateFastOffer, getFastJobOffersByAgency, deleteFastOffer,
    getFastOfferById, submitFastApplication }
