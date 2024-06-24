import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

const backAPI = process.env.BACK_URL;


const Docentes = () => {
    const [DocentesData, setDocentesData] = useState([]);
    const [MateriaData, setMateriaData] = useState([]);

    const [openCreateModal, setOpenCreateModal] = useState(false); // Para abrir el modal para crear el docente
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Para abrir el modal de confirmacion para eliminar el docente
    const [openEditModal, setOpenEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición

    const [selectedDocente, setSelectedDocente] = useState(null); // Estado para almacenar datos del docente para las funciones
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        ci: "",
        email: "",
        materia: "",
    });

    // Función para mostrar el modal de eliminación y almacenar el ID del docente seleccionado
    const showDeleteModal = (docenteId) => {
        setSelectedDocente(docenteId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID del docente seleccionado
    const hideDeleteModal = () => {
        setSelectedDocente(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos del docente seleccionado
    const showEditModal = (docente) => {
        setSelectedDocente(docente);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedDocente(null);
        setOpenEditModal(false);
    };

    // Función para obtener datos de los docentes par la tabla
    const fetchDocentes = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/docente/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDocentesData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para obtener datos de los curso
    const fetchMateria = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/materia/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMateriaData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backAPI}/api/docente/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Aquí puedes mostrar un mensaje de éxito o realizar alguna otra acción si es necesario
            setOpenCreateModal(false);
            // Actualizar la lista de docente después de la creación exitosa
            fetchDocentes();
        } catch (error) {
            console.error('Error creating docente:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para confirmar la eliminación del docente
    const handleDeleteDocente = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/docente/delete/${selectedDocente}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de eliminación después de la eliminación exitosa
            hideDeleteModal();
            // Actualizar la lista de docente después de la eliminación
            fetchDocentes();
        } catch (error) {
            console.error('Error deleting docente:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${backAPI}/api/docente/update/${selectedDocente._id}`, selectedDocente, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de edición después de la edición exitosa
            hideEditModal();
            // Actualizar la lista de docentes después de la edición
            fetchDocentes();
        } catch (error) {
            console.error('Error editing docente:', error);
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
        setSelectedDocente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchDocentes();
        fetchMateria();
    }, []);

    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de administración de docentes</h1>
            {/* Navbar de funciones */}
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)}>Cargar Docente</Button>
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
                            <TableHeadCell>Materia</TableHeadCell>

                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {DocentesData.map(docente => (
                                <TableRow key={docente._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{docente.nombre} {docente.apellido}</TableCell>
                                    <TableCell>{docente.ci}</TableCell>
                                    <TableCell>{docente.email}</TableCell>
                                    <TableCell>{docente.materia?.materia}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showEditModal(docente)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showDeleteModal(docente._id)}>Eliminar</DropdownItem>
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
                        <ModalHeader className="p-4">Agregar Docente</ModalHeader>
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
                                <label htmlFor="materia" className="block text-sm font-medium text-gray-700">Materia</label>
                                <select id="materia" name="materia" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange}>
                                    <option value="">Seleccionar materia</option>
                                    {MateriaData.map(materia => (
                                        <option key={materia._id} value={materia._id}>{materia.materia}</option>
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
                        ¿Estás seguro de que quieres eliminar este docente?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDeleteModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleDeleteDocente}>Eliminar</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    show={openEditModal}
                    onClose={hideEditModal}
                    size="md"
                >
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader className="p-4">Editar Docente</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" id="nombre" name="nombre" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedDocente?.nombre} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input type="text" id="apellido" name="apellido" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedDocente?.apellido} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="ci" className="block text-sm font-medium text-gray-700">C.I</label>
                                <input type="text" id="ci" name="ci" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedDocente?.ci} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedDocente?.email} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="materia" className="block text-sm font-medium text-gray-700">Materia</label>
                                <select id="materia" name="materia" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedDocente?.materia} onChange={handleEditChange}>
                                    <option value="">Seleccionar materia</option>
                                    {MateriaData.map(materia => (
                                        <option key={materia._id} value={materia._id}>{materia.materia}</option>
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

export default Docentes;