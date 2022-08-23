import axios from "axios";

const getSiteContent = () => {
    return axios.get(`/translation/getSiteContent/${localStorage.getItem('lang').toLowerCase()}`);
}

export { getSiteContent }
