import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Tworzymy instancję axiosa z domyślną konfiguracją
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor do dodawania tokenu do każdego requestu
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let refreshSubscribers = [];

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await axiosInstance.post('/token/refresh/', {
            refresh: refreshToken
        });

        const data = response.data;
        localStorage.setItem('access_token', data.access);
        return data.access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.clear();
        window.location.href = '/login';
        throw error;
    }
};

export const authenticatedFetch = async (url, options = {}) => {
    const accessToken = localStorage.getItem('access_token');
    
    const config = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axiosInstance(url, config);
        return response;
    } catch (error) {
        if (error.response?.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const newToken = await refreshAccessToken();
                    isRefreshing = false;
                    onRefreshed(newToken);
                    
                    config.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(url, config);
                } catch (refreshError) {
                    isRefreshing = false;
                    throw refreshError;
                }
            } else {
                return new Promise(resolve => {
                    addRefreshSubscriber(token => {
                        config.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(url, config));
                    });
                });
            }
        }
        throw error;
    }
};

export const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        return Date.now() < expirationTime;
    } catch (error) {
        return false;
    }
};

export const authAPI = {
    async login(email, password) {
        try {
            console.log('Attempting login with:', { email });
            
            const response = await axiosInstance.post('/login/', {
                email,
                password
            });

            if (response.data) {
                const { tokens, user } = response.data;
                
                if (!tokens || !tokens.access) {
                    console.error('Invalid token structure in response:', response.data);
                    throw new Error('Invalid token structure received');
                }

                const { access, refresh } = tokens;

                // Najpierw zapisz tokeny i dane użytkownika
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user', JSON.stringify(user));

                // Ustaw token w axiosInstance
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
            
                
                
                
                return {
                    user,
                    token: access,
                    refresh_token: refresh
                };
            }
            
            throw new Error('Login failed - no data received');
        } catch (error) {
            console.error('Login error details:', error.response?.data);
            throw error;
        }
    },

    async logout() {
        try {
            console.log('Starting logout process...');
            const refreshToken = localStorage.getItem('refresh_token');

            // Funkcja czyszcząca wszystkie dane
            const clearLocalData = () => {
                console.log('Clearing all local data...');
                
                // Czyszczenie localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                localStorage.clear(); // dla pewności czyścimy wszystko
                // Czyszczenie headers w axiosInstance
                delete axiosInstance.defaults.headers.common['Authorization'];
                axiosInstance.defaults.headers.common = {
                    'Content-Type': 'application/json'
                };
                
                console.log('Local data cleared successfully');
            };

            try {
                if (refreshToken) {
                    // Próba wylogowania na serwerze
                    await axiosInstance.post('/logout/', {
                        refresh_token: refreshToken
                    });
                    console.log('Server logout successful');
                }
            } catch (serverError) {
                console.error('Server logout error:', serverError);
                // Kontynuujemy proces nawet przy błędzie serwera
            }

            // Czyścimy dane i przekierowujemy
            clearLocalData();
            
            // Używamy window.location.href zamiast navigate
            window.location.href = '/login';

        } catch (error) {
            console.error('Logout process error:', error);
            // W przypadku błędu i tak czyścimy wszystko
            localStorage.clear();
            delete axiosInstance.defaults.headers.common['Authorization'];
            window.location.href = '/login';
        }
    },

    isAuthenticated() {
        const token = localStorage.getItem('access_token');
        return !!token;
    }
};

export default authAPI;