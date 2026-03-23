import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // <-- Make sure to install this!

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("JWT_TOKEN")
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null;

    const [token, setToken] = useState(getToken);
    const [isAdmin, setIsAdmin] = useState(false);

    // NEW: Decode the token to check for the Admin role
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Spring Security stores roles differently depending on JwtUtils config. 
                // We check the most common claim names: 'authorities', 'roles', or 'role'.
                const authorities = decodedToken.authorities || decodedToken.roles || decodedToken.role || [];
                const roleString = Array.isArray(authorities) ? authorities.join(",") : String(authorities);
                
                setIsAdmin(roleString.includes("ROLE_ADMIN"));
            } catch (error) {
                console.error("Invalid token format", error);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    }, [token]);

    const sendData = {
        token,
        setToken,
        isAdmin, // <-- Export isAdmin so the Navbar and Router can use it
    };

    return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>
};

export const useStoreContext = () => {
    const context = useContext(ContextApi);
    return context;
}