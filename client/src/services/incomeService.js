import api from './api';

export const incomeService = {
  async getAll(userId) {
    const response = await api.get(`/income/${userId}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/income/add', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/income/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/income/${id}`);
    return response.data;
  },
};

export default incomeService;
