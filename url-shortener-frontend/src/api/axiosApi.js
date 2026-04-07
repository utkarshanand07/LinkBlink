import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL || "http://localhost:8080",
});

// NEW: Global Error Interceptor
api.interceptors.response.use(
    (response) => {
        // If the request succeeds, just pass the response through
        return response;
    },
    (error) => {
        // If the backend rejects the token (Expired, Invalid, or Forbidden)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // 1. Wipe the token from local storage
            localStorage.removeItem("JWT_TOKEN");
            
            // 2. Force a hard reload to the login page. 
            // (This instantly resets the Context API state and kicks them out of protected routes)
            window.location.href = "/login";
        }
        
        return Promise.reject(error);
    }
);

export default api;