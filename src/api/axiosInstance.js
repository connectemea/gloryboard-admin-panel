import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add the Authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);



// Response interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
    
    (response) => response, // Pass through the response for successful requests
    (error) => {
        if (error.response && error.response.status === 401) {
            toast.error("Session Expired")
            console.log('User is unauthorized. Please check your token or login again.');
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
