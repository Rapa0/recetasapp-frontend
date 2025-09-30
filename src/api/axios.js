import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://recetasapp-backend-production.up.railway.app/api',
});

export default apiClient;