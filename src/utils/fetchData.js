import axios from 'axios';

export const getDataAPI = async (url, token) => {
    const res = await axios.get(`/${url}`, {
        headers: { Authorization: token }
    })
    return res;
};

export const postDataAPI = async (url, post, token) => {
    const res = await axios.post(`/${url}`, post, {
        headers: { Authorization: token }
    })
    return res;
};

export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`/${url}`, post, {
        headers: { Authorization: token }
    })
    return res;
};

export const patchDataAPI = async (url, post, token) => {
    const res = await axios.patch(`/${url}`, post, {
        headers: { Authorization: token }
    })
    return res;
};

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`/${url}`, {
        headers: { Authorization: token }
    })
    return res;
};