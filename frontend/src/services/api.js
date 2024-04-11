import Cookies from 'js-cookie';
import axios from 'axios';
const api = axios.create({
    baseURL: '/api/',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken')
    }
  });

export default api;