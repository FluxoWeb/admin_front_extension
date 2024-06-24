import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Card, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "flowbite-react";

const backAPI = process.env.BACK_URL;

import perfil from '../../assets/perfil.png';

const Detalles = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [openUpdatePasswordModal, setOpenUpdatePasswordModal] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const { id } = decodedToken;

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${backAPI}/api/user/get/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handlePasswordChange = async () => {
        try {
            const response = await axios.put(
                `${backAPI}/api/user/updatePassword`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Password updated:", response.data);
            setOpenUpdatePasswordModal(false);
            setError(null); // Limpiar errores si la solicitud es exitosa
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error('Error updating password:', error);
            setError("Ha ocurrido un error al actualizar la contraseña. Por favor, inténtelo de nuevo.");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="m-8 flex justify-center">
            <Card className="max-w-sm">
                <div className="flex justify-end px-4 pt-4">
                    <Dropdown inline>
                        <DropdownItem className="font-bold" onClick={() => setOpenUpdatePasswordModal(true)}>Cambiar Contraseña</DropdownItem>
                    </Dropdown>
                </div>
                <div className="flex flex-col items-center pb-10">
                    <img
                        alt="Bonnie image"
                        height="96"
                        src={perfil}
                        width="96"
                        className="mb-3 rounded-full shadow-lg"
                    />
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{userData.nombre} {userData.apellido}</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Rol: {userData.rol}</span>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Creado el: {new Date(userData.createdAt).toLocaleDateString()}</span>
                    <h5 className="mb-1 text-xl font-mono text-gray-900 dark:text-white">{userData.email}</h5>

                </div>
            </Card>

            <Modal
                show={openUpdatePasswordModal}
                onClose={() => setOpenUpdatePasswordModal(false)}
                size="sm"
            >
                <ModalHeader className="p-4">Cambiar Contraseña</ModalHeader>
                <ModalBody>
                    {error && <Alert type="error">{error}</Alert>}
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Contraseña actual"
                        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        onChange={handleChange}
                        value={formData.currentPassword}
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Nueva Contraseña"
                        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        onChange={handleChange}
                        value={formData.newPassword}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar Nueva Contraseña"
                        className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                    />
                </ModalBody>
                <ModalFooter className="flex justify-between">
                    <Button className="bg-red-400 hover:bg-red-600" onClick={() => setOpenUpdatePasswordModal(false)}>Cancelar</Button>
                    <Button className="bg-green-400 hover:bg-green-600" onClick={handlePasswordChange}>Cambiar Contraseña</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Detalles;
