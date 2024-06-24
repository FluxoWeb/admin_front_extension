import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const Carrera = () => {
    const [CarrerasData, setCarrerasData] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false); // Para abrir el modal para cargar la carrera
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Para abrir el modal de confirmacion para eliminar la carrera
    const [openEditModal, setOpenEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición de la carrera

    const [selectedCarrera, setSelectedCarrera] = useState(null); // Estado para almacenar datos de la carrera para las funciones
    const [formData, setFormData] = useState({
        carrera: "",
        abrev: "",
    });

    // Función para mostrar el modal de eliminación y almacenar el ID de la carrera seleccionada
    const showDeleteModal = (carreraId) => {
        setSelectedCarrera(carreraId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID de la carrera seleccionada
    const hideDeleteModal = () => {
        setSelectedCarrera(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos de la carrera seleccionada
    const showEditModal = (carrera) => {
        setSelectedCarrera(carrera);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedCarrera(null);
        setOpenEditModal(false);
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
            setCarrerasData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backAPI}/api/carrera/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Aquí puedes mostrar un mensaje de éxito o realizar alguna otra acción si es necesario
            setOpenCreateModal(false);
            // Actualizar la lista de carreras después de la creación exitosa
            fetchCarrera();
        } catch (error) {
            console.error('Error creating carrera:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para confirmar la eliminación de la carrera
    const handleDeleteCarrera = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/carrera/delete/${selectedCarrera}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de eliminación después de la eliminación exitosa
            hideDeleteModal();
            // Actualizar la lista de carreras después de la eliminación
            fetchCarrera();
        } catch (error) {
            console.error('Error deleting carrera:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${backAPI}/api/carrera/update/${selectedCarrera._id}`, selectedCarrera, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de edición después de la edición exitosa
            hideEditModal();
            // Actualizar la lista de carreras después de la edición
            fetchCarrera();
        } catch (error) {
            console.error('Error editing carrera:', error);
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
        setSelectedCarrera(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
        fetchCarrera();
    }, []);

    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de gestion de carreras</h1>
            {/* Navbar de funciones */}
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)}>Cargar Carrera</Button>
                </nav>
            </div>
            <div className="min-h-full">
                {/* Tabla de datos */}
                <div className="overflow-x-auto text-left">
                    <Table>
                        <TableHead>
                            <TableHeadCell>Nombre de la carrera</TableHeadCell>
                            <TableHeadCell>Abreviatura</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {CarrerasData.map(carrera => (
                                <TableRow key={carrera._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{carrera.carrera}</TableCell>
                                    <TableCell>{carrera.abrev}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showEditModal(carrera)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showDeleteModal(carrera._id)}>Eliminar</DropdownItem>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Modal para cargar carrera */}
                <Modal
                    show={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    size='md'
                >
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="p-4">Agregar Carrera</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                <input type="text" id="carrera" name="carrera" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="abrev" className="block text-sm font-medium text-gray-700">Abreviatura</label>
                                <input type="text" id="abrev" name="abrev" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
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
                        ¿Estás seguro de que quieres eliminar esta carrera?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDeleteModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleDeleteCarrera}>Eliminar</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    show={openEditModal}
                    onClose={hideEditModal}
                    size="md"
                >
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader className="p-4">Editar Carrera</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                <input type="text" id="carrera" name="carrera" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedCarrera?.carrera} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="abrev" className="block text-sm font-medium text-gray-700">Abreviatura</label>
                                <input type="text" id="abrev" name="abrev" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedCarrera?.abrev} onChange={handleEditChange} />
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
}

export default Carrera;