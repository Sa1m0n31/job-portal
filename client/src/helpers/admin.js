import axios from "axios";
import {getAdminAuthHeader} from "./others";
import Cookies from "universal-cookie";

const authAdmin = () => {
    const cookies = new Cookies();

    return axios.post('/admin/auth', {
        username: cookies.get('username'),
        role: cookies.get('role')
    }, {
        headers: {
            Authorization: getAdminAuthHeader()
        }
    });
}

const loginAdmin = (username, password) => {
    return axios.post('/admin/login', {
        username, password
    });
}

const logoutAdmin = () => {
    const cookies = new Cookies();
    cookies.remove('access_token_admin', { path: '/' });
    cookies.remove('jwt', { path: '/' });
    cookies.remove('role', { path: '/' });
    cookies.remove('username', { path: '/' });
    window.location = '/admin';
}

const blockAgency = (id) => {
    return axios.post('/admin/blockAgency', {
        id
    });
}

const blockUser = (id) => {
    return axios.post('/admin/blockUser', {
        id
    });
}

const unblockAgency = (id) => {
    return axios.post('/admin/unblockAgency', {
        id
    });
}

const unblockUser = (id) => {
    return axios.post('/admin/unblockUser', {
        id
    });
}

const acceptAgency = (id) => {
    return axios.post('/admin/acceptAgency', {
        id
    });
}

export { authAdmin, loginAdmin, logoutAdmin, blockAgency, blockUser,
    unblockAgency, unblockUser, acceptAgency }
