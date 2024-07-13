import axios from 'axios';
import { ACCESS_TOKEN_KEY, getItem, removeItem, setItem } from './localStorage';

export const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {

    const accessToken = getItem(ACCESS_TOKEN_KEY);
    request.headers['Authorization'] = `Bearer ${accessToken}`;

    return request;

});

axiosClient.interceptors.response.use(async (response) => {

    const originalRequest = response.config;
    const responseStatus = response.data.status;
    const responseCode = response.data.statusCode;
    const responseError = response.data.result.error;

    console.log(response);

    if (responseStatus === 'success') {
        return response;
    }

    if (responseCode === 401 && !originalRequest.url_retry) {

        originalRequest.url_retry = true;

        const response = axios.create({
            withCredentials: true,
        }).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

        const accessToken = response.data.result.data.accessToken;
        const responseStatus = response.data.status;

        if (responseStatus === 'success') {

            setItem(ACCESS_TOKEN_KEY, accessToken);
            originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
            return axios(originalRequest);

        } else {

            removeItem(ACCESS_TOKEN_KEY);
            window.location.replace('/login', '_self');
            return Promise.reject();

        }

    }

});