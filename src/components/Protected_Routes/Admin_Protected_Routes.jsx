import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Admin_Protected_Routes = ({ children }) => {
    const [userRole, setUserRole] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem("token");

        if (token) {
            // Decodificar el token para obtener el ID del usuario
            const decodedToken = jwtDecode(token);
            const { rol } = decodedToken;

            setUserRole(rol);
            setIsAuthenticated(true);
        }
    }, []);

    if (!isAuthenticated || userRole !== "Admin") {
        return (

            <div className="flex justify-center items-center h-screen">
                <div className="text-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <i className="text-5xl text-red-500  fa-solid fa-circle-exclamation"></i>
                    <h5 className="text-center mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">No tienes acceso a esta página</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Por favor, inicia sesión como administrador.</p>
                    <Link to="/home" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Volver al dashboard
                    </Link>
                </div>
            </div>

        );
    }

    return children;
};

export default Admin_Protected_Routes;
