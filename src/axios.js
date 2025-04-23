// src/services/api.js  (ili gdje već centralno inicijaliziraš axios)
import axios from 'axios';

/**
 *  baseURL = '/api'
 *  ➜  GET '/users'  postaje  http://HOST/api/users
 */
axios.defaults.baseURL = '/api';             // <— samo /api, bez IP-a

axios.defaults.headers.common['Accept'] = 'application/json';
// Content-Type postavi samo za POST/PUT, ne globalno za GET:
axios.defaults.headers.post['Content-Type']  = 'application/json';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axios;
