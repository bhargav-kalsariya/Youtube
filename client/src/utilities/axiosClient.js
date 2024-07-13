import axios from 'axios';
import { ACCESS_TOKEN_KEY, getItem } from './localStorage';

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {

    const accessToken = getItem(ACCESS_TOKEN_KEY);
    request.headers['Authorization'] = `Bearer ${accessToken}`;

    return request;

});