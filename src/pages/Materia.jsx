import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const Materia = () => {
    const [MateriaData, setMateriaData] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false); // Para abrir el modal para cargar el curso
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Para abrir el modal de confirmacion para eliminar el curso
    const [openEditModal, setOpenEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición del curso

    const [selectedMateria, setSelectedMateria] = useState(null); // Estado para almacenar datos de la carrera para las funciones
    const [formData, setFormData] = useState({
        materia: "",
        abrev: "",
    });

    // Función para mostrar el modal de eliminación y almacenar el ID del curso seleccionado
    const showDeleteModal = (materiaId) => {
        setSelectedMateria(materiaId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID del curso seleccionado
    const hideDeleteModal = () => {
        setSelectedMateria(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos del curso seleccionado
    const showEditModal = (materia) => {
        setSelectedMateria(materia);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedMateria(null);
        setOpenEditModal(false);
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
            await axios.post(`${backAPI}/api/materia/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Aquí puedes mostrar un mensaje de éxito o realizar alguna otra acción si es necesario
            setOpenCreateModal(false);
            // Actualizar la lista de las materias después de la creación exitosa
            fetchMateria();
        } catch (error) {
            console.error('Error creating materia:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para confirmar la eliminación de la materia
    const handleDeleteMateria = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/materia/delete/${selectedMateria}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de eliminación después de la eliminación exitosa
            hideDeleteModal();
            // Actualizar la lista de la materia después de la eliminación
            fetchMateria();
        } catch (error) {
            console.error('Error deleting materia:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${backAPI}/api/materia/update/${selectedMateria._id}`, selectedMateria, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de edición después de la edición exitosa
            hideEditModal();
            // Actualizar la lista de las materia después de la edición
            fetchMateria();
        } catch (error) {
            console.error('Error editing materia:', error);
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
        setSelectedMateria(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchMateria();
    }, []);

    return(
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de gestion de materias</h1>
            {/* Navbar de funciones */}
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)}>Cargar Materia</Button>
                </nav>
            </div>

            <div className="min-h-full">

                {/* Tabla de datos */}
                <div className="overflow-x-auto text-left">
                    <Table>
                        <TableHead>
                            <TableHeadCell>Nombre de la materia</TableHeadCell>
                            <TableHeadCell>Abreviatura</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {MateriaData.map(materia => (
                                <TableRow key={materia._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{materia.materia}</TableCell>
                                    <TableCell>{materia.abrev}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showEditModal(materia)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showDeleteModal(materia._id)}>Eliminar</DropdownItem>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Modal para cargar curso */}
                <Modal
                    show={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    size='md'
                >
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="p-4">Agregar Materia</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="materia" className="block text-sm font-medium text-gray-700">Materia</label>
                                <input type="text" id="materia" name="materia" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
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
                        ¿Estás seguro de que quieres eliminar esta materia?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDeleteModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleDeleteMateria}>Eliminar</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    show={openEditModal}
                    onClose={hideEditModal}
                    size="md"
                >
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader className="p-4">Editar Curso</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="materia" className="block text-sm font-medium text-gray-700">Curso</label>
                                <input type="text" id="materia" name="materia" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedMateria?.materia} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="abrev" className="block text-sm font-medium text-gray-700">Abreviatura</label>
                                <input type="text" id="abrev" name="abrev" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedMateria?.abrev} onChange={handleEditChange} />
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

export default Materia;