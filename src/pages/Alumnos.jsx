import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const Alumnos = () => {
    const [AlumnosData, setAlumnosData] = useState([]);
    const [filteredAlumnosData, setFilteredAlumnosData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [CarrerasData, setCarrerasData] = useState([]);
    const [CursosData, setCursosData] = useState([]);
    const [promosData, setPromosData] = useState([]);

    const [openCreateModal, setOpenCreateModal] = useState(false); // Para abrir el modal para crear el alumno
    const [openDeleteModal, setOpenDeleteModal] = useState(false); // Para abrir el modal de confirmacion para eliminar el alumno
    const [openEditModal, setOpenEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición

    const [selectedAlumno, setSelectedAlumno] = useState(null); // Estado para almacenar datos del alumno para las funciones
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        ci: "",
        matricula: "",
        email: "",
        carrera: "",
        curso: "",
        promo: "",
    });

    // Función para mostrar el modal de eliminación y almacenar el ID del alumno seleccionado
    const showDeleteModal = (alumnoId) => {
        setSelectedAlumno(alumnoId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID del alumno seleccionado
    const hideDeleteModal = () => {
        setSelectedAlumno(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos del alumno seleccionado
    const showEditModal = (alumno) => {
        setSelectedAlumno(alumno);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedAlumno(null);
        setOpenEditModal(false);
    };


    // Función para obtener datos de los alumnos par la tabla
    const fetchAlumnos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/alumno/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAlumnosData(response.data);
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
            setCarrerasData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
            await axios.post(`${backAPI}/api/alumno/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Aquí puedes mostrar un mensaje de éxito o realizar alguna otra acción si es necesario
            setOpenCreateModal(false);
            // Actualizar la lista de alumnos después de la creación exitosa
            fetchAlumnos();
        } catch (error) {
            console.error('Error creating alumno:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para confirmar la eliminación del alumno
    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/alumno/delete/${selectedAlumno}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de eliminación después de la eliminación exitosa
            hideDeleteModal();
            // Actualizar la lista de alumnos después de la eliminación
            fetchAlumnos();
        } catch (error) {
            console.error('Error deleting alumno:', error);
            // Aquí puedes manejar el error mostrando un mensaje al usuario o realizando otra acción necesaria
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${backAPI}/api/alumno/update/${selectedAlumno._id}`, selectedAlumno, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Ocultar el modal de edición después de la edición exitosa
            hideEditModal();
            // Actualizar la lista de alumnos después de la edición
            fetchAlumnos();
        } catch (error) {
            console.error('Error editing alumno:', error);
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
        setSelectedAlumno(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchAlumnos();
        fetchCarrera();
        fetchCurso();
        fetchPromo();
    }, []);

    useEffect(() => {
        let filteredAlumnos = AlumnosData;
        if (searchTerm) {
            filteredAlumnos = filteredAlumnos.filter(alumno =>
                `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredAlumnosData(filteredAlumnos);
    }, [searchTerm, AlumnosData]);


    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de administración de alumnos</h1>
            {/* Navbar de funciones */}
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)}>Cargar Alumno</Button>
                    <input
                        type="text"
                        className="p-2 border rounded-md"
                        placeholder="Buscar por nombre o apellido"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                            <TableHeadCell>Horas de Extension</TableHeadCell>
                            <TableHeadCell>Matricula</TableHeadCell>
                            <TableHeadCell>Rol</TableHeadCell>
                            <TableHeadCell>Carrera</TableHeadCell>
                            <TableHeadCell>Curso</TableHeadCell>
                            <TableHeadCell>Promo</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {filteredAlumnosData.map(alumno => (
                                <TableRow key={alumno._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{alumno.nombre} {alumno.apellido}</TableCell>
                                    <TableCell>{alumno.ci}</TableCell>
                                    <TableCell>{alumno.email}</TableCell>
                                    <TableCell>{alumno.total_horas?.horas} hs.</TableCell>
                                    <TableCell>{alumno.matricula}</TableCell>
                                    <TableCell>{alumno.rol}</TableCell>
                                    <TableCell>{alumno.carrera?.abrev}</TableCell>
                                    <TableCell>{alumno.curso?.abrev}</TableCell>
                                    <TableCell>{alumno.promo?.abrev}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showEditModal(alumno)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showDeleteModal(alumno._id)}>Eliminar</DropdownItem>
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
                        <ModalHeader className="p-4">Agregar Alumno</ModalHeader>
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
                                <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">Matricula</label>
                                <input type="text" id="matricula" name="matricula" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                <select id="carrera" name="carrera" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange}>
                                    <option value="">Seleccionar carrera</option>
                                    {CarrerasData.map(carrera => (
                                        <option key={carrera._id} value={carrera._id}>{carrera.carrera}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="curso" className="block text-sm font-medium text-gray-700">Curso</label>
                                <select id="curso" name="curso" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange}>
                                    <option value="">Seleccionar curso</option>
                                    {CursosData.map(curso => (
                                        <option key={curso._id} value={curso._id}>{curso.curso}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="promo" className="block text-sm font-medium text-gray-700">Promo</label>
                                <select id="promo" name="promo" className="mt-1 p-2 border border-gray-300 rounded-md w-full" onChange={handleChange}>
                                    <option value="">Seleccionar promo</option>
                                    {promosData.map(promo => (
                                        <option key={promo._id} value={promo._id}>{promo.promo}</option>
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
                        ¿Estás seguro de que quieres eliminar este alumno?
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
                        <ModalHeader className="p-4">Editar Alumno</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" id="nombre" name="nombre" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.nombre} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input type="text" id="apellido" name="apellido" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.apellido} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="ci" className="block text-sm font-medium text-gray-700">C.I</label>
                                <input type="text" id="ci" name="ci" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.ci} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">Matricula</label>
                                <input type="matricula" id="matricula" name="matricula" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.matricula} onChange={handleEditChange} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.email} onChange={handleEditChange} />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                <select id="carrera" name="carrera" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.carrera} onChange={handleEditChange}>
                                    <option value="">Seleccionar carrera</option>
                                    {CarrerasData.map(carrera => (
                                        <option key={carrera._id} value={carrera._id}>{carrera.carrera}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="curso" className="block text-sm font-medium text-gray-700">Curso</label>
                                <select id="curso" name="curso" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.curso} onChange={handleEditChange}>
                                    <option value="">Seleccionar carrera</option>
                                    {CursosData.map(curso => (
                                        <option key={curso._id} value={curso._id}>{curso.curso}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="promo" className="block text-sm font-medium text-gray-700">Promo</label>
                                <select id="promo" name="promo" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={selectedAlumno?.promo} onChange={handleEditChange}>
                                    <option value="">Seleccionar carrera</option>
                                    {promosData.map(promo => (
                                        <option key={promo._id} value={promo._id}>{promo.promo}</option>
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
}

export default Alumnos;