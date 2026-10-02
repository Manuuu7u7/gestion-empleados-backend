import axios from 'axios';

// ⭐ USA LA URL DE NGROK
const API_URL = 'https://phonebook-stubborn-fable.ngrok-free.dev/api/empleados';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const empleadosApi = {
  // GET /api/empleados
  getAll: async () => {
    const response = await api.get('');
    return response.data;
  },

  // POST /api/empleados
  create: async (data) => {
    const response = await api.post('', data);
    return response.data;
  },

  // DELETE /api/empleados/{id}
  delete: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};

export default api;