export const ACCESS_TOKEN_KEY = 'access_token';

export function getItem(key) {

    return localStorage.getItem(key);

}

export function removeItem(key) {

    return localStorage.removeItem(key);

}

export function setItem(key, value) {

    return localStorage.setItem(key, value);

}