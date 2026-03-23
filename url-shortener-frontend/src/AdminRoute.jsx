import { Navigate } from "react-router-dom";
import { useStoreContext } from "./contextApi/ContextApi";

export default function AdminRoute({ children }) {
    const { token, isAdmin } = useStoreContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" />; 
    }

    return children;
}