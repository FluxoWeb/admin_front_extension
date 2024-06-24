import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const Promo = () => {
    const [promosData, setPromosData] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false); // Para abrir el modal para cargar el promo
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Para abrir el modal de confirmacion para eliminar el promo
    const [openEditModal, setOpenEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición del promo

    const [selectedPromo, setSelectedPromo] = useState(null); // Estado para almacenar datos de la carrera para las funciones
    const [formData, setFormData] = useState({
        promo: "",
        abrev: "",
    });

    // Función para mostrar el modal de eliminación y almacenar el ID del promo seleccionado
    const showDeleteModal = (promoId) => {
        setSelectedPromo(promoId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID del promo seleccionado
    const hideDeleteModal = () => {
        setSelectedPromo(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos del promo seleccionado
    const showEditModal = (promo) => {
        setSelectedPromo(promo);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedPromo(null);
        setOpenEditModal(false);
    };


    // Función para obtener datos de los promo
    const fetchPromo = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/promo/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPromosData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${backAPI}/api/promo/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Aquí puedes mostrar un mensaje de éxito o realizar alguna otra acción si es necesario
            setOpenCreateModal(false);
            // Actualizar la lista del promo después de la creación exitosa
            fetchPromo();
        } catch (error) {
            console.error('Error creating promo:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para confirmar la eliminación del promo
    const handleDeletepromo = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/promo/delete/${selectedPromo}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de eliminación después de la eliminación exitosa
            hideDeleteModal();
            // Actualizar la lista de promos después de la eliminación
            fetchPromo();
        } catch (error) {
            console.error('Error deleting promo:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${backAPI}/api/promo/update/${selectedPromo._id}`, selectedPromo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de edición después de la edición exitosa
            hideEditModal();
            // Actualizar la lista de promos después de la edición
            fetchPromo();
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
        setSelectedPromo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    useEffect(() => {
        fetchPromo();
    }, []);

    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de gestion de promos</h1>
            {/* Navbar de funciones */}
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)}>Cargar Promo</Button>
                </nav>
            </div>
            <div className="min-h-full">
                {/* Tabla de datos */}
                <div className="overflow-x-auto text-left">
                    <Table>
                        <TableHead>
                            <TableHeadCell>Nombre de la promo</TableHeadCell>
                            <TableHeadCell>Abreviatura</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {promosData.map(promo => (
                                <TableRow key={promo._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{promo.promo}</TableCell>
                                    <TableCell>{promo.abrev}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showEditModal(promo)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showDeleteModal(promo._id)}>Eliminar</DropdownItem>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Modal para cargar promo */}
                <Modal
                    show={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    size='md'
                >
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="p-4">Agregar Promo</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="promo" className="block text-sm font-medium text-gray-700">Promo</label>
                                <input type="text" id="promo" name="promo" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
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
                        ¿Estás seguro de que quieres eliminar este promo?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDeleteModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleDeletepromo}>Eliminar</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    show={openEditModal}
                    onClose={hideEditModal}
                    size="md"
                >
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader className="p-4">Editar Promo</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="promo" className="block text-sm font-medium text-gray-700">promo</label>
                                <input type="text" id="promo" name="promo" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedPromo?.promo} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="abrev" className="block text-sm font-medium text-gray-700">Abreviatura</label>
                                <input type="text" id="abrev" name="abrev" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedPromo?.abrev} onChange={handleEditChange} />
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

export default Promo;