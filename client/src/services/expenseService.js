import api from './api';

export const expenseService = {
  // Route is /:userId but controller uses req.userId from JWT
  // We pass userId in URL to match route, but actual auth is from token
  async getAll(userId) {
    const response = await api.get(`/expenses/${userId}`);
    // Backend returns array directly, not { expenses: [] }
    return { expenses: response.data };
  },

  async create(data) {
    const response = await api.post('/expenses/add', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/expenses/edit/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/expenses/delete/${id}`);
    return response.data;
  },
};

export default expenseService;
