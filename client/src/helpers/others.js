import Cookies from "universal-cookie";

const isElementInArray = (el, arr) => {
    if(Array.isArray(arr)) {
        return arr.findIndex((item) => {
            return item === el;
        }) !== -1;
    }
    else {
        return false;
    }
}

const isEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

const getLang = () => {
    const cookies = new Cookies();

    if(cookies.get('role') === 'admin') {
        return 'pl';
    }
    else {
        return localStorage.getItem('lang') ? localStorage.getItem('lang').toLowerCase() : 'pl';
    }
}

const isHomepage = () => {
    return window.location.pathname === '/';
}

const getAuthHeader = () => {
    const cookies = new Cookies();
    const jwt = cookies.get('access_token');
    return `Bearer ${jwt}`;
}

const getAdminAuthHeader = () => {
    const cookies = new Cookies();
    const jwt = cookies.get('access_token_admin');
    return `Bearer ${jwt}`;
}

const numberRange = (start, end) => {
    return new Array(end - start).fill().map((d, i) => i + start);
}

const getLoggedUserEmail = () => {
    const cookies = new Cookies();
    return `${cookies.get('email_jooob')}@${cookies.get('email_jooob_domain')}`;
}

const getDate = (day, month, year) => {
    return `${day+1 >= 10 ? day+1 : `0${day+1}`}.${month+1 >= 10 ? month+1 : `0${month+1}`}.${year}`;
}

const addLeadingZero = (n) => {
    if(n < 10) {
        return `0${n}`;
    }
    else {
        return n;
    }
}

const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
)

const isPasswordStrength = (password) => {
    if(!password) return false;
    if(password.length < 8) return false; // min. 8 characters
    if(!(/\d/.test(password))) return false; // number
    if(password.toLowerCase() === password) return false; // uppercase

    return true;
}

export { isEmail, isElementInArray, getAuthHeader, numberRange, isHomepage,
    getLoggedUserEmail, getDate, addLeadingZero, groupBy, isPasswordStrength, getLang, getAdminAuthHeader }
