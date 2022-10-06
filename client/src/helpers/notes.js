import axios from "axios";
import {getAuthHeader} from "./others";

const updateNotes = (user, agency, content) => {
    return axios.post('/notes/updateNotes', {
        user, agency, content
    }, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

const getNotes = (user, agency) => {
    return axios.get(`/notes/getNotes/${user}/${agency}`, {
        headers: {
            Authorization: getAuthHeader()
        }
    });
}

export { updateNotes, getNotes }
