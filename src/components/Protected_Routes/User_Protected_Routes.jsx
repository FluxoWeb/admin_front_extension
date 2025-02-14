import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const User_Protected_Routes = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 <= Date.now()) {
                    // El token ha expirado, elimínalo
                    localStorage.removeItem("token");
                    navigate("/");
                }
            } catch (error) {
                // Error al decodificar el token
                console.error("Error al decodificar el token:", error);
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, [navigate]);

    return children;
};

export default User_Protected_Routes;