import axios from 'axios';

// Vite usa import.meta.env
export const ApiUrl = import.meta.env.VITE_API_URL;
export const ApiStorage = import.meta.env.VITE_API_STORAGE;

const apiRest = axios.create({
    baseURL: ApiUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Usar apiRest en lugar de api
apiRest.interceptors.request.use(config => {
    const token = localStorage.getItem('token_liga');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiRest;