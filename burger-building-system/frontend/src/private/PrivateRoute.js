import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const UserPrivateRoute = ({ redirectPath = '/login', children }) => {
    const state = useSelector(state => state.auth);
    if (state.user && state.user.isVerified && state.user.is_superuser === false) {
        return children;
    }
    return <Navigate to={redirectPath} replace />;
};
export const AdminPrivateRoute = ({ redirectPath = '/login', children }) => {
    const state = useSelector(state => state.auth);
    if (state.user && state.user.isVerified && state.user.is_superuser) {
        return children;
    }
    return <Navigate to={redirectPath} replace />;
};