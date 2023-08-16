import axios from 'axios';
import apiUrl from './store/apiUrl/apiUrl';

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;