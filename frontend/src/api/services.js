import api from './client';

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const standupApi = {
  submit: (data) => api.post('/api/standup', data),
  getHistory: () => api.get('/api/standup/history'),
  getById: (id) => api.get(`/api/standup/${id}`),
  update: (id, data) => api.put(`/api/standup/${id}`, data),
  delete: (id) => api.delete(`/api/standup/${id}`),
  getWeeklySummary: () => api.get('/api/standup/weekly'),
};

export const userApi = {
  generateConnectCode: () => api.post('/api/user/telegram/connect'),
};
