import axios from "axios";

const getSiteContent = (lang) => {
    return axios.get(`/translation/getSiteContent/${lang?.toLowerCase()}`);
}

export { getSiteContent }
