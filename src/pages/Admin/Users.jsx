import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const Users = () => {
    const [UsersData, setUsersData] = useState([]);
    const [CarreraData, setCarreraData] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false); // Para abrir el modal para crear el usuario
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Para abrir el modal de confirmacion para eliminar el usuario
    const [openEditModal, setOpenEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición
    
    const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar datos del usuario para las funciones
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        ci: "",
        email: "",
        password: "",
        rol: "User", // Por defecto, puedes cambiar esto según necesites
        carrera: ""
    });

    // Función para mostrar el modal de eliminación y almacenar el ID del usuario seleccionado
    const showDeleteModal = (userId) => {
        setSelectedUser(userId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID del usuario seleccionado
    const hideDeleteModal = () => {
        setSelectedUser(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos del usuario seleccionado
    const showEditModal = (user) => {
        setSelectedUser(user);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedUser(null);
        setOpenEditModal(false);
    };


    // Función para obtener datos de los usuarios par la tabla
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/user/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsersData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para obtener datos de las carreras
    const fetchCarrera = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/carrera/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCarreraData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backAPI}/api/user/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Aquí puedes mostrar un mensaje de éxito o realizar alguna otra acción si es necesario
            setOpenCreateModal(false);
            // Actualizar la lista de usuarios después de la creación exitosa
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para confirmar la eliminación del usuario
    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/user/delete/${selectedUser}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de eliminación después de la eliminación exitosa
            hideDeleteModal();
            // Actualizar la lista de usuarios después de la eliminación
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${backAPI}/api/user/update/${selectedUser._id}`, selectedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de edición después de la edición exitosa
            hideEditModal();
            // Actualizar la lista de usuarios después de la edición
            fetchUsers();
        } catch (error) {
            console.error('Error editing user:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Función para manejar cambios en el formulario de edición
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
        fetchUsers();
        fetchCarrera();
    }, []);

    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de administración de usuarios</h1>
            {/* Navbar de funciones */}
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)} >Cargar Usuario</Button>
                </nav>
            </div>
            <div className="min-h-full">
                {/* Tabla de datos */}
                <div className="overflow-x-auto text-left">
                    <Table>
                        <TableHead>
                            <TableHeadCell>Nombre y Apellido</TableHeadCell>
                            <TableHeadCell>C.I</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Rol</TableHeadCell>
                            <TableHeadCell>Carrera</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {UsersData.map(user => (
                                <TableRow key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{user.nombre} {user.apellido}</TableCell>
                                    <TableCell>{user.ci}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.rol}</TableCell>
                                    <TableCell>{user.carrera?.abrev}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showEditModal(user)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showDeleteModal(user._id)}>Eliminar</DropdownItem>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Modal para cargar usuario */}
                <Modal
                    show={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    size='md'
                >
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="p-4">Agregar Usuario</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" id="nombre" name="nombre" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input type="text" id="apellido" name="apellido" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="ci" className="block text-sm font-medium text-gray-700">C.I</label>
                                <input type="text" id="ci" name="ci" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input type="password" id="password" name="password" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                                <select id="rol" name="rol" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange}>
                                    <option value="Admin">Admin</option>
                                    <option value="User">Usuario</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                <select id="carrera" name="carrera" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange}>
                                    <option value="">Seleccionar carrera</option>
                                    {CarreraData.map(carrera => (
                                        <option key={carrera._id} value={carrera._id}>{carrera.carrera}</option>
                                    ))}
                                </select>
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex justify-between">
                            <Button className="bg-red-400 hover:bg-red-600" onClick={() => setOpenCreateModal(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-green-400 hover:bg-green-600">Crear</Button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal
                    show={openDeleteModal}
                    onClose={hideDeleteModal}
                    size="sm"
                >
                    <ModalHeader className="p-4">Confirmar Eliminación</ModalHeader>
                    <ModalBody>
                        ¿Estás seguro de que quieres eliminar este usuario?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDeleteModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleDeleteUser}>Eliminar</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    show={openEditModal}
                    onClose={hideEditModal}
                    size="md"
                >
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader className="p-4">Editar Usuario</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" id="nombre" name="nombre" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedUser?.nombre} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input type="text" id="apellido" name="apellido" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedUser?.apellido} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="ci" className="block text-sm font-medium text-gray-700">C.I</label>
                                <input type="text" id="ci" name="ci" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedUser?.ci} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedUser?.email} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                                <select id="rol" name="rol" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedUser?.rol} onChange={handleEditChange}>
                                    <option value="Admin">Admin</option>
                                    <option value="User">Usuario</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                <select id="carrera" name="carrera" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedUser?.carrera} onChange={handleEditChange}>
                                    <option value="">Seleccionar carrera</option>
                                    {CarreraData.map(carrera => (
                                        <option key={carrera._id} value={carrera._id}>{carrera.carrera}</option>
                                    ))}
                                </select>
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex justify-between">
                            <Button className="bg-red-400 hover:bg-red-600" onClick={hideEditModal}>Cancelar</Button>
                            <Button type="submit" className="bg-green-400 hover:bg-green-600">Guardar Cambios</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Users;
