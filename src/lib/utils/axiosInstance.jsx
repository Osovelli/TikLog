import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< HEAD
<<<<<<< HEAD
  baseURL: 'https://tiklog-ms.onrender.com/api/v1', // Replace with your API URL
=======
  baseURL: 'https://testpatience.onrender.com/api/v1', // Replace with your API URL
>>>>>>> 3d9654b (initialize axios and create authstore)
=======
  baseURL: 'https://testpatience.onrender.com/api/v1', // Replace with your API URL
>>>>>>> 3d9654b (initialize axios and create authstore)
  //timeout: 1000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
<<<<<<< HEAD
<<<<<<< HEAD
    const token = localStorage.getItem('accessToken'); // Get token from localStorage
=======
    const token = localStorage.getItem('token'); // Get token from localStorage
>>>>>>> 3d9654b (initialize axios and create authstore)
=======
    const token = localStorage.getItem('token'); // Get token from localStorage
>>>>>>> 3d9654b (initialize axios and create authstore)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://testpatience.onrender.com/api/v1', // Replace with your API URL
  //timeout: 1000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
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