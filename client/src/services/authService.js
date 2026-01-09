import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  async register(username, email, password) {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },
};

export default authService;
