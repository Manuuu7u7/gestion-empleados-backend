import axios from 'axios';

// ⭐ URL FIJA DE RAILWAY
const API_URL = 'https://gestion-empleados-backend-production.up.railway.app/api/empleados';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const empleadosApi = {
  // Obtener todos
  getAll: async () => {
    const response = await api.get('');
    return response.data;
  },

  // Obtener uno por ID
  getById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Crear nuevo
  create: async (data) => {
    const response = await api.post('', data);
    return response.data;
  },

  // ⭐ Actualizar (ESTE ERA EL QUE FALTABA)
  update: async (id, data) => {
    const response = await api.put(`/${id}`, data);
    return response.data;
  },

  // Eliminar
  delete: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};

export default api;