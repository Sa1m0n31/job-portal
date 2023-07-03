import axios from 'axios'
import {getAdminAuthHeader, getAuthHeader, getLang, getLoggedUserEmail} from "./others";
import settings from "../static/settings";
import Cookies from "universal-cookie";

const authUser = () => {
    const cookies = new Cookies();

    return axios.post('/user/auth', {
        email: getLoggedUserEmail(),
        role: cookies.get('jooob_account_type')
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const loginUser = (email, password, mailContent) => {
    return axios.post('/user/login', {
        email, password, mailContent
    });
}

const registerUser = (email, password, newsletter, mailContent) => {
    return axios.post('/user/register', {
        email, password, newsletter, mailContent
    });
}

const registerTestAccount = (email, mailContent) => {
    return axios.post('/user/registerTestAccount', {
        email, mailContent
    });
}

const verifyUser = (token) => {
    return axios.post('/user/verify', {
        token
    });
}

const removeCv = () => {
    return axios.post(`/user/removeCv`, {
        email: getLoggedUserEmail()
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const updateCv = (file) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: getAuthHeader()
        }
    }

    formData.append('email', getLoggedUserEmail());
    formData.append('cv', file);

    return axios.post('/user/updateCv', formData, config);
}

const updateUser = (data, admin = false, userId = null) => {
    const formData = new FormData();
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: admin ? getAdminAuthHeader() : getAuthHeader()
        }
    }

    data = {
        ...data,
        profileImageUrl: data?.profileImageUrl?.replaceAll(settings.API_URL, '')
    }

    if(userId) {
        formData.append('id', userId.toString());
    }

    formData.append('userData', JSON.stringify(data));
    formData.append('email', admin ? '' : getLoggedUserEmail());
    formData.append('profileImage', data.profileImage);
    formData.append('bsnNumber', data.bsnNumberDocument);
    for(const att of data.attachments) {
        formData.append('attachments', att.file);
    }

    return axios.post('/user/update', formData, config);
}

const getUserData = (email = false) => {
    return axios.get(`/user/getUserData/${email ? email : getLoggedUserEmail()}/${getLang()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getUserById = (id) => {
    return axios.get(`/user/getUserById/${id}/${getLang()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const toggleUserVisibility = () => {
    return axios.patch(`/user/toggleUserVisibility/${getLoggedUserEmail()}`, {}, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const toggleUserWorking = () => {
    return axios.patch(`/user/toggleUserWorking/${getLoggedUserEmail()}`, {}, {
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

const getUserFastApplications = () => {
    return axios.get(`/user/getUserFastApplications/${getLoggedUserEmail()}`, {
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

const getAllUsers = (page, admin = false) => {
    return axios.get(`/user/getAll/${page}`, {
        headers: {
            Authorization: admin ? getAdminAuthHeader() : getAuthHeader()
        }
    });
}

const getAllVisibleUsers = (page) => {
    return axios.get(`/user/getAllVisible/${page}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const filterUsers = (fullName, category, country, city, distance, salaryType, salaryFrom, salaryTo,
                     salaryCurrency, ownTransport, bsnNumber, languages, drivingLicences, page) => {
    return axios.post(`/user/filter`, {
        fullName, category, country, city, distance, salaryType, salaryFrom, salaryTo,
        salaryCurrency, ownTransport, bsnNumber, languages, drivingLicences, page
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getUserNotifications = () => {
    return axios.get(`/user/getNotifications/${getLoggedUserEmail()}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const readNotification = (id) => {
    return axios.patch(`/user/readNotification`, {
        id
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const sendContactForm = (name, email, msg, deliveryMail) => {
    return axios.post('/user/sendContactForm', {
        name, email, msg, deliveryMail
    });
}

const remindUserPassword = (email, mailContent) => {
    return axios.post('/user/remindPassword', {
        email, mailContent
    });
}

const resetUserPassword = (password, email, mailContent) => {
    return axios.patch('/user/resetPassword', {
        password, email, mailContent
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const changeUserPassword = (oldPassword, newPassword, mailContent) => {
    return axios.patch('/user/changePassword', {
        oldPassword, newPassword, mailContent
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const sendMailInvitation = (email, name, createAccount, content, mailContent) => {
    return axios.post('/user/sendInvitation', {
        email, name, createAccount, content, mailContent
    });
}

export { registerUser, registerTestAccount, verifyUser, loginUser, authUser, updateUser, getUserData, logout,
    toggleUserVisibility, toggleUserWorking, getUserApplications, getAllUsers, getAllVisibleUsers,
    filterUsers, getUserById, getUserFastApplications, getUserNotifications, readNotification,
    sendContactForm, remindUserPassword, changeUserPassword, resetUserPassword, sendMailInvitation,
    removeCv, updateCv
}
