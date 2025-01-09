const API_URL = 'http://127.0.0.1:8000/api';

export const authAPI = {
  async register(email, password, username) {
    try {
      // Przygotuj dane zgodnie z dokumentacją API
      const registerPayload = {
        email: email,
        username: username,
        password: password,
        password2: password  // Wymagane przez API
      };

      console.log('Register payload:', registerPayload);

      const registerResponse = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerPayload),
      });

      // Logowanie surowej odpowiedzi dla debugowania
      const responseText = await registerResponse.text();
      console.log('Raw register response:', responseText);

      let registerData;
      try {
        registerData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing register response:', e);
        throw new Error('Invalid server response');
      }

      console.log('Parsed register response:', registerData);

      if (!registerResponse.ok) {
        if (registerData.username || registerData.email || registerData.password) {
          const errors = [];
          if (registerData.username) errors.push(`Username: ${registerData.username[0]}`);
          if (registerData.email) errors.push(`Email: ${registerData.email[0]}`);
          if (registerData.password) errors.push(`Password: ${registerData.password[0]}`);
          throw new Error(errors.join('\n'));
        }
        throw new Error(registerData.message || 'Registration failed');
      }

      // Czekamy chwilę przed próbą logowania
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Attempting login after registration with:', {
        email: email,
        password: password
      });

      const loginData = await this.login(email, password);
      console.log('Login after registration successful:', loginData);

      return loginData;
    } catch (error) {
      console.error('Register/Login error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const loginPayload = {
        email: email,
        password: password
      };

      console.log('Login payload:', { ...loginPayload, password: '***' });

      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginPayload),
      });

      // Logowanie surowej odpowiedzi dla debugowania
      const responseText = await response.text();
      console.log('Raw login response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing login response:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Login failed');
      }

      console.log('Login response:', data);

      // Zapisz tokeny
      if (data.tokens) {
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
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