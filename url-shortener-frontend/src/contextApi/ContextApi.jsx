import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 

const ContextApi = createContext();

const checkTokenValidity = (tokenPayload) => {
    if (!tokenPayload) return { isValid: false, isAdmin: false };
    
    try {
        const decodedToken = jwtDecode(tokenPayload);
        
        // 1. Check if token is expired
        // decodedToken.exp is in seconds, Date.now() is in milliseconds
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("JWT_TOKEN"); // Wipe the dead token
            return { isValid: false, isAdmin: false };
        }

        // 2. Check for Admin role
        const authorities = decodedToken.authorities || decodedToken.roles || decodedToken.role || [];
        const roleString = Array.isArray(authorities) ? authorities.join(",") : String(authorities);
        
        return { isValid: true, isAdmin: roleString.includes("ROLE_ADMIN") };
    } catch (error) {
        console.error("Invalid token format", error);
        localStorage.removeItem("JWT_TOKEN");
        return { isValid: false, isAdmin: false };
    }
};

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("JWT_TOKEN")
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null;

    // Run the check instantly on load
    const initialCheck = checkTokenValidity(getToken);
    
    // If the token was expired on load, we don't put it in state
    const [token, setToken] = useState(initialCheck.isValid ? getToken : null);
    const [isAdmin, setIsAdmin] = useState(initialCheck.isAdmin);

    // Watch for token changes (like when a user logs in manually)
    useEffect(() => {
        const check = checkTokenValidity(token);
        if (!check.isValid && token) {
            setToken(null); // Clear state if invalid
        }
        setIsAdmin(check.isAdmin);
    }, [token]);

    const sendData = {
        token,
        setToken,
        isAdmin,
    };

    return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>
};

export const useStoreContext = () => {
    const context = useContext(ContextApi);
    return context;
}