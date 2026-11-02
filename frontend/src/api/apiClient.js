import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:5000/api',

  timeout: 15000,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      console.error(
        'Network error: Backend may be unavailable.',
        error.message
      );
    } else {
      console.error(
        `API Error ${error.response.status}:`,
        error.response.data?.message || error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;