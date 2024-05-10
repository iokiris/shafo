import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const csrfToken = Cookies.get('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
