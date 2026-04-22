import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 

const ContextApi = createContext();

const checkTokenValidity = (tokenPayload) => {
    if (!tokenPayload) return { isValid: false, isAdmin: false };
    
    try {
        const decodedToken = jwtDecode(tokenPayload);
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("JWT_TOKEN");
            return { isValid: false, isAdmin: false };
        }
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
    const getToken = localStorage.getItem("JWT_TOKEN") ? JSON.parse(localStorage.getItem("JWT_TOKEN")) : null;
    const initialCheck = checkTokenValidity(getToken);
    
    const [token, setToken] = useState(initialCheck.isValid ? getToken : null);
    const [isAdmin, setIsAdmin] = useState(initialCheck.isAdmin);

    // --- Theme State ---
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };
    

    useEffect(() => {
        const check = checkTokenValidity(token);
        if (!check.isValid && token) {
            setToken(null);
        }
        setIsAdmin(check.isAdmin);
    }, [token]);

    const sendData = {
        token,
        setToken,
        isAdmin,
        theme,
        toggleTheme,
    };

    return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>
};

export const useStoreContext = () => {
    const context = useContext(ContextApi);
    return context;
}