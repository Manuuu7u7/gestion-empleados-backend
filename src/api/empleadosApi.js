import axios from 'axios';

// ⭐ USA LA URL DE NGROK
const API_URL = 'https://phonebook-stubborn-fable.ngrok-free.dev/api/empleados';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const empleadosApi = {
    getAll: async () => {
        const response = await api.get('/');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/${id}`);
        return response.data;
    },
};
export const empleadosApi = {
    getAll: async () => {
        const response = await api.get('');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/${id}`);
        return response.data;
    },
};

export default api;