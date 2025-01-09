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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd logowania');
      }

      // Zapisz tokeny w localStorage
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Nie można połączyć się z serwerem');
      }
      throw error;
    }
  },

  async register(email, password) {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          password2: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.error === 'object' 
            ? Object.values(data.error).flat().join(', ') 
            : data.error || 'Błąd rejestracji'
        );
      }

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Nie można połączyć się z serwerem');
      }
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async getMe() {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Brak tokenu autoryzacji');
      }

      const response = await fetch(`${API_URL}/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się pobrać danych użytkownika');
      }

      // Aktualizujemy dane użytkownika w localStorage
      localStorage.setItem('user', JSON.stringify(data));

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Nie można połączyć się z serwerem');
      }
      throw error;
    }
  },
};