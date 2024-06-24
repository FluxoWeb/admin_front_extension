import React, { useState, useEffect } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const backAPI = process.env.BACK_URL;

const StatusNavbar = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Función para obtener los datos del usuario activo
        const fetchUserData = async () => {
            try {
                // Obtener el token del almacenamiento local
                const token = localStorage.getItem("token");
                // Decodificar el token para obtener los datos
                const decodedToken = jwtDecode(token);
                const { id } = decodedToken;
                // Hacer una solicitud para obtener los datos del usuario utilizando el ID
                const response = await axios.get(`${backAPI}/api/user/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Establecer los datos del usuario en el estado
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Manejar errores, por ejemplo, redirigir al usuario a la página de inicio de sesión si el token es inválido o ha expirado
            }
        };

        fetchUserData();
    }, []);

    return (
        <nav className="p-4 flex justify-between items-center shadow-md ">
            <div className="flex flex-row">
                <h1 className="mr-4 text-gray-500">
                    <span className="font-bold">Usuario Conectado:</span>
                    <span> {userData?.nombre} {userData?.apellido}</span>
                </h1>
                <h1 className="text-gray-500">
                    <span className="font-bold">Rol:</span>
                    <span> {userData?.rol}</span>
                </h1>
            </div>
        </nav>

    );
};

export default StatusNavbar;
