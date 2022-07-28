import Cookies from "universal-cookie";

const isElementInArray = (el, arr) => {
    return arr.findIndex((item) => {
        return item === el;
    }) !== -1;
}

const isPasswordStrong = (pass) => {
    return pass?.length >= 8;
}

const isEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

const getAuthHeader = () => {
    const cookies = new Cookies();
    const jwt = cookies.get('access_token');
    return `Bearer ${jwt}`;
}

const numberRange = (start, end) => {
    return new Array(end - start).fill().map((d, i) => i + start);
}

export { isEmail, isElementInArray, isPasswordStrong, getAuthHeader, numberRange }
