import axios from "axios";
import {getAuthHeader, getLang, getLoggedUserEmail} from "./others";

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
    return axios.get(`/offer/getOffersByAgency/${getLoggedUserEmail()}/${getLang()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getActiveJobOffers = (page) => {
    return axios.get(`/offer/getActive/${page}/${getLang()}`);
}

const deleteOffer = (id) => {
    return axios.delete(`/offer/delete/${id}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getOfferById = (id) => {
    return axios.get(`/offer/get/${id}/${getLang()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const submitApplication = (id, message, friendLink, contactForms, attachments, agencyId) => {
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
    formData.append('message', message);
    formData.append('agencyId', agencyId);
    formData.append('friendLink', friendLink);
    for(const att of attachments) {
        console.log(att);
        formData.append('attachments', att.file);
    }

    return axios.post('/offer/addApplication', formData, config);
}

const filterOffers = (page, title, category, country, city, distance, salaryType, salaryFrom, salaryTo, salaryCurrency) => {
    return axios.post(`/offer/filter`, {
        page, title, category, country, city, distance, salaryType, salaryFrom, salaryTo, salaryCurrency,
        lang: getLang()
    });
}

const getActiveFastOffers = () => {
    return axios.get(`/offer/getActiveFastOffers/${getLang()}`);
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
    return axios.get(`/offer/getFastOffersByAgency/${getLoggedUserEmail()}/${getLang()}`, {
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
    return axios.get(`/offer/getFastOffer/${id}/${getLang()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const submitFastApplication = (id, message, friendLink, contactForms, attachments, agencyId) => {
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
    formData.append('message', message);
    formData.append('agencyId', agencyId);
    formData.append('friendLink', friendLink);
    for(const att of attachments) {
        console.log(att);
        formData.append('attachments', att.file);
    }

    return axios.post('/offer/addFastApplication', formData, config);
}

const getApplicationsByAgency = () => {
    return axios.get(`/offer/getApplicationsByAgency/${getLoggedUserEmail()}/${getLang()}`);
}

const getFastApplicationsByAgency = () => {
    return axios.get(`/offer/getFastApplicationsByAgency/${getLoggedUserEmail()}/${getLang()}`);
}

export { addOffer, getJobOffersByAgency, getActiveJobOffers, deleteOffer,
    getOfferById, updateOffer, submitApplication, filterOffers, getActiveFastOffers,
    addFastOffer, updateFastOffer, getFastJobOffersByAgency, deleteFastOffer,
    getFastOfferById, submitFastApplication, getApplicationsByAgency, getFastApplicationsByAgency }
