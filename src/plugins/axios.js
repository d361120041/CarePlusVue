import axios from 'axios';

const myAxios = axios.create({ 
    baseURL: import.meta.env.VITE_API_BASE_URL
});

myAxios.interceptors.response.use(function(response) {
    return response;
}, function(error) {
    console.log("interceptors error", error);
    if(error.response && error.response.status && error.response.status === 403) {
        window.location.href = "/403";
    }
    return Promise.reject(error);
});

export default myAxios;