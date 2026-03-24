import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 

const ContextApi = createContext();

const checkIsAdmin = (tokenPayload) => {
    if (!tokenPayload) return false;
    try {
        const decodedToken = jwtDecode(tokenPayload);
        const authorities = decodedToken.authorities || decodedToken.roles || decodedToken.role || [];
        const roleString = Array.isArray(authorities) ? authorities.join(",") : String(authorities);
        return roleString.includes("ROLE_ADMIN");
    } catch (error) {
        console.error("Invalid token format", error);
        return false;
    }
};

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("JWT_TOKEN")
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null;

    const [token, setToken] = useState(getToken);
    
    const [isAdmin, setIsAdmin] = useState(() => checkIsAdmin(getToken));

    useEffect(() => {
        setIsAdmin(checkIsAdmin(token));
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