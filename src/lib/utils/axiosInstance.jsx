import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< Updated upstream
  baseURL: 'https://tiklog-ms.onrender.com/api/v1', // Replace with your API URL
=======
<<<<<<< Updated upstream
  baseURL: 'https://testpatience.onrender.com/api/v1', // Replace with your API URL
>>>>>>> Stashed changes
  //timeout: 1000,
=======
  baseURL: 'https://tiklog-ms.onrender.com/api/v1', 
>>>>>>> Stashed changes
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;