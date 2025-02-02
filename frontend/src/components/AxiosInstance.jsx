import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/';

const AxiosInstance = axios.create({
   baseURL: baseUrl,
   timeout: 5000, 
   headers: {
      "Content-Type": "application/json",
      accept: "application/json",
   }
});

AxiosInstance.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('Token');
      if (token) {
         console.log('Adding token to headers:', token);
         config.headers.Authorization = `Token ${token}`;
      } else {
         console.log('No token found');
         config.headers.Authorization = null;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

AxiosInstance.interceptors.response.use(
   (response) => {
      return response;
   }, 
   (error) => {
      if (error.code === 'ECONNABORTED') {
         console.error('Request timeout');
         // Display a user-friendly message or redirect
         alert('Request timed out. Please try again later.');
      } else if (error.response && error.response.status === 401) {
         console.log('Unauthorized, removing token...');
         localStorage.removeItem('Token');
         window.location.href = '/login'; 
      } else {
         // Handle other errors
         console.error(error.message || 'Something went wrong');
      }
      return Promise.reject(error);
   }
);


export default AxiosInstance;
