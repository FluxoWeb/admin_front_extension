import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const Curso = () => {
    const [CursosData, setCursosData] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false); // Para abrir el modal para cargar el curso
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Para abrir el modal de confirmacion para eliminar el curso
    const [openEditModal, setOpenEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición del curso

    const [selectedCurso, setSelectedCurso] = useState(null); // Estado para almacenar datos de la carrera para las funciones
    const [formData, setFormData] = useState({
        curso: "",
        abrev: "",
    });

    // Función para mostrar el modal de eliminación y almacenar el ID del curso seleccionado
    const showDeleteModal = (cursoId) => {
        setSelectedCurso(cursoId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID del curso seleccionado
    const hideDeleteModal = () => {
        setSelectedCurso(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos del curso seleccionado
    const showEditModal = (curso) => {
        setSelectedCurso(curso);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedCurso(null);
        setOpenEditModal(false);
    };


    // Función para obtener datos de los curso
    const fetchCurso = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/curso/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCursosData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backAPI}/api/curso/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Aquí puedes mostrar un mensaje de éxito o realizar alguna otra acción si es necesario
            setOpenCreateModal(false);
            // Actualizar la lista del curso después de la creación exitosa
            fetchCurso();
        } catch (error) {
            console.error('Error creating curso:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para confirmar la eliminación del curso
    const handleDeleteCurso = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/curso/delete/${selectedCurso}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de eliminación después de la eliminación exitosa
            hideDeleteModal();
            // Actualizar la lista de cursos después de la eliminación
            fetchCurso();
        } catch (error) {
            console.error('Error deleting curso:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${backAPI}/api/curso/update/${selectedCurso._id}`, selectedCurso, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de edición después de la edición exitosa
            hideEditModal();
            // Actualizar la lista de cursos después de la edición
            fetchCurso();
        } catch (error) {
            console.error('Error editing curso:', error);
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
        setSelectedCurso(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
        fetchCurso();
    }, []);

    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de gestion de cursos</h1>
            {/* Navbar de funciones */}
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)}>Cargar Curso</Button>
                </nav>
            </div>
            <div className="min-h-full">
                {/* Tabla de datos */}
                <div className="overflow-x-auto text-left">
                    <Table>
                        <TableHead>
                            <TableHeadCell>Nombre de la curso</TableHeadCell>
                            <TableHeadCell>Abreviatura</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {CursosData.map(curso => (
                                <TableRow key={curso._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{curso.curso}</TableCell>
                                    <TableCell>{curso.abrev}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showEditModal(curso)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showDeleteModal(curso._id)}>Eliminar</DropdownItem>
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
                        <ModalHeader className="p-4">Agregar Curso</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="curso" className="block text-sm font-medium text-gray-700">Curso</label>
                                <input type="text" id="curso" name="curso" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
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
                        ¿Estás seguro de que quieres eliminar este curso?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDeleteModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleDeleteCurso}>Eliminar</Button>
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
                                <label htmlFor="curso" className="block text-sm font-medium text-gray-700">Curso</label>
                                <input type="text" id="curso" name="curso" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedCurso?.curso} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="abrev" className="block text-sm font-medium text-gray-700">Abreviatura</label>
                                <input type="text" id="abrev" name="abrev" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedCurso?.abrev} onChange={handleEditChange} />
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

export default Curso;