const API_URL = 'http://localhost:8000/api';

export const authAPI = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data);

      // Sprawdź nową strukturę odpowiedzi
      if (!data.tokens || !data.tokens.access || !data.tokens.refresh) {
        throw new Error('Invalid token data received');
      }
      
      // Zapisz tokeny z nowej struktury
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('token');

      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server');
      }
      throw error;
    }
  },

  async register(email, password, username) {
    try {
      console.log('Register payload:', { email, password, username }); // Debugging

      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
          password2: password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error('Received non-JSON response:', await response.text());
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const error = await response.json();
        console.log('Register error response:', error);
        
        if (typeof error === 'object') {
          const errorMessage = Object.entries(error)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          throw new Error(errorMessage);
        }
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Register success:', data);

      // Po udanej rejestracji, zaloguj użytkownika
      return await this.login(email, password);
    } catch (error) {
      console.error('Register error:', error);
      if (error.message.includes('Server returned non-JSON response')) {
        throw new Error('Server error - please try again later');
      }
      throw error;
    }
  },

  async refreshToken() {
    try {
      const refresh = this.getRefreshToken();
      console.log('Refresh token:', refresh); // Debugging

      if (!refresh) {
        console.log('No refresh token found'); // Debugging
        return false;
      }

      const response = await fetch(`${API_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        console.log('Token refresh failed'); // Debugging
        this.logout();
        return false;
      }

      const data = await response.json();
      console.log('Refresh response:', data); // Debugging

      if (data.access) {
        localStorage.setItem('access_token', data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Refresh error:', error); // Debugging
      this.logout();
      return false;
    }
  },

  logout() {
    console.log('Logging out...'); // Debugging
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const user = this.getCurrentUser();
    console.log('Auth check:', { accessToken, refreshToken, user }); // Debugging
    return !!(accessToken && refreshToken && user);
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAccessToken() {
    const token = localStorage.getItem('access_token');
    console.log('Access token:', token); // Debugging
    return token;
  },

  getRefreshToken() {
    const token = localStorage.getItem('refresh_token');
    console.log('Refresh token:', token); // Debugging
    return token;
  },

  getAuthHeaders() {
    const token = this.getAccessToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Auth headers:', headers); // Debugging
    return headers;
  },

  async getMe() {
    try {
      const token = this.getAccessToken();
      console.log('GetMe token:', token); // Debugging

      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_URL}/users/me/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('GetMe response:', response); // Debugging

      if (!response.ok) {
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return await this.getMe();
          }
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      console.log('GetMe data:', data); // Debugging
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('GetMe error:', error); // Debugging
      throw error;
    }
  }
};