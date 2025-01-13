import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',  // upewnij się, że to jest poprawny URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Dodaj interceptor do logowania requestów (możesz usunąć później)
axiosInstance.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
    });
    return request;
});

// Dodaj interceptor do logowania odpowiedzi (możesz usunąć później)
axiosInstance.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    error => {
        console.error('Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;