import React, { useState, useEffect } from "react";
import axios from 'axios';
import Select from 'react-select';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Dropdown, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Badge } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const ManageProjecto = () => {
    const [ProjectosData, setProjectosData] = useState([]);
    const [AlumnosData, setAlumnosData] = useState([]);
    const [CarrerasData, setCarrerasData] = useState([]);
    const [DocentesData, setDocentesData] = useState([]);
    const [MateriaData, setMateriaData] = useState([]);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

    const [openAddActividadModal, setOpenAddActividadModal] = useState(false);
    const [openDropActividadModal, setOpenDropActividadModal] = useState(false);
    const [openEditActividadModal, setOpenEditActividadModal] = useState(false);

    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedProjectoData, setSelectedProjectoData] = useState([]);
    const [selectedActividad, setSelectedActividad] = useState(null);

    const [openFinalizeModal, setOpenFinalizeModal] = useState(false);

    const [selectedProjecto, setSelectedProjecto] = useState(null);

    const [formData, setFormData] = useState({
        titulo: "",
        resumen: "",
        carrera: "",
        materias: [],
        docentes: [],
        alumnos_responsables: [],
        alumnos_colaboradores: [],
        duracion: {
            inicio: "",
            fin: "",
        },
        presupuesto: {
            total: 0,
        },
        objetivos: "",
    });

    const [actividadData, setActividadData] = useState({
        titulo: "",
        dia: "",
        hora_extension: "",
    });
    const [editActividadData, setEditActividadData] = useState({
        titulo: "",
        dia: "",
        hora_extension: "",
    });

    const [projectAlumnos, setProjectAlumnos] = useState({
        alumnos_responsables: [],
        alumnos_colaboradores: [],
        actividades: []
    });
    const [finalizeResponsables, setFinalizeResponsables] = useState([]);
    const [finalizeColaboradores, setFinalizeColaboradores] = useState([]);


    // Función para limpiar el formulario
    const handleFormReset = () => {
        setFormData({
            titulo: "",
            resumen: "",
            carrera: "",
            materias: [],
            docentes: [],
            alumnos_responsables: [],
            alumnos_colaboradores: [],
            duracion: {
                inicio: "",
                fin: "",
            },
            presupuesto: {
                total: 0,
            },
            objetivos: "",
        });
    };

    // Función para mostrar el modal de eliminación y almacenar el ID del projecto seleccionado
    const showDeleteModal = (projectoId) => {
        setSelectedProjecto(projectoId);
        setOpenDeleteModal(true);
    };

    // Función para ocultar el modal de eliminación y limpiar el ID del projecto seleccionado
    const hideDeleteModal = () => {
        setSelectedProjecto(null);
        setOpenDeleteModal(false);
    };

    // Función para mostrar el modal de edición y cargar los datos del projecto seleccionado
    const showEditModal = (projecto) => {
        setSelectedProjecto(projecto);
        setOpenEditModal(true);
    };

    // Función para ocultar el modal de edición
    const hideEditModal = () => {
        setSelectedProjecto(null);
        setOpenEditModal(false);
    };


    // Función para mostrar el modal de agregar actividad y almacenar el ID del proyecto seleccionado
    const showAddActividadModal = (projectId) => {
        setSelectedProjecto(projectId);
        setOpenAddActividadModal(true);
    };

    // Función para ocultar el modal de agregar actividad y limpiar el ID del proyecto seleccionado
    const hideAddActividadModal = () => {
        setSelectedProjecto(null);
        setOpenAddActividadModal(false);
    };

    // Función para mostrar el modal de eliminar actividad y almacenar el ID del proyecto seleccionado
    const showDropActividadModal = (projectId, actividadId) => {
        setSelectedProjecto(projectId);
        setSelectedActividad(actividadId);
        setOpenDropActividadModal(true);
    };


    // Función para ocultar el modal de eliminar actividad y limpiar el ID del proyecto seleccionado
    const hideDropActividadModal = () => {
        setSelectedProjecto(null);
        setSelectedActividad(null);
        setOpenDropActividadModal(false);
    };

    const showEditActividadModal = (projectId, actividad) => {
        setSelectedProjecto(projectId);
        setSelectedActividad(actividad._id);
        setEditActividadData({
            titulo: actividad.titulo,
            dia: actividad.dia,
            hora_extension: actividad.hora_extension,
        });
        setOpenEditActividadModal(true);
    };

    const hideEditActividadModal = () => {
        setSelectedProjecto(null);
        setSelectedActividad(null);
        setEditActividadData({
            titulo: "",
            dia: "",
            hora_extension: "",
        });
        setOpenEditActividadModal(false);
    };



    // Función para poder mostrar lo detalles de un projecto
    const showViewModal = async (projectId) => {
        setOpenViewModal(true);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/projecto/get/${projectId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedProjectoData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const hideViewModal = () => {
        setOpenViewModal(false);
    };


    // Función para mostrar el modal de finalizar proyecto
    const showFinalizeModal = async (projectId) => {
        setSelectedProjecto(projectId);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/projecto/get/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { alumnos_responsables, alumnos_colaboradores, actividades } = response.data;
            setProjectAlumnos({ alumnos_responsables, alumnos_colaboradores, actividades });
            setFinalizeResponsables(alumnos_responsables.map(alumno => ({
                id: alumno._id,
                hora_extra: '',
                actividades: []
            })));
            setFinalizeColaboradores(alumnos_colaboradores.map(alumno => ({
                id: alumno._id,
                actividades: []
            })));
            setOpenFinalizeModal(true);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    // Función para ocultar el modal de finalizar proyecto
    const hideFinalizeModal = () => {
        setSelectedProjecto(null);
        setOpenFinalizeModal(false);
    };

    // Función para obtener datos de los proyectos para la tabla
    const fetchProjectos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/projecto/get-all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const newProjectos = response.data.filter(projecto => projecto.estado === 'Nuevo');
            setProjectosData(newProjectos);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Función para obtener datos de los alumnos para la tabla
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

    // Función para obtener datos de los docentes para la tabla
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

    // Función para obtener datos de las materias
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

            // Ajustar las fechas antes de enviar al backend
            const adjustedFormData = adjustProjectDates(formData);

            await axios.post(`${backAPI}/api/projecto/create`, adjustedFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOpenCreateModal(false);
            fetchProjectos();
            handleFormReset();
        } catch (error) {
            console.error('Error creating projecto:', error);
        }
    };

    // Función para confirmar la eliminación del projecto
    const handleDeleteProjecto = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/projecto/delete/${selectedProjecto}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            hideDeleteModal();
            fetchProjectos();
        } catch (error) {
            console.error('Error deleting alumno:', error);
        }
    };

    // Función para enviar el formulario de edición
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            // Ajustar las fechas antes de enviar al backend
            const adjustedProject = adjustProjectDates(selectedProjecto);

            await axios.put(`${backAPI}/api/projecto/update/${selectedProjecto._id}`, adjustedProject, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            hideEditModal();
            fetchProjectos();
        } catch (error) {
            console.error('Error editing alumno:', error);
        }
    };

    const handleAddActividadSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            // Ajustar la fecha antes de enviar al backend
            const adjustedActividadData = { ...actividadData, dia: addOneDay(actividadData.dia) };

            // Enviar la solicitud POST al backend con los datos de la actividad
            await axios.post(
                `${backAPI}/api/projecto/${selectedProjecto}/actividades/add`, adjustedActividadData, // Enviar un array con el objeto de actividad
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Ocultar el modal después de agregar la actividad
            hideAddActividadModal();
            fetchProjectos();
        } catch (error) {
            console.error('Error adding actividad:', error);
        }
    };

    const handleRemoveActividad = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${backAPI}/api/projecto/${selectedProjecto}/actividades/remove/${selectedActividad}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // Actualizar el estado del proyecto después de eliminar la actividad
            setSelectedProjectoData(prevData => ({
                ...prevData,
                actividades: prevData.actividades.filter(actividad => actividad._id !== selectedActividad)
            }));
            hideDropActividadModal();
            fetchProjectos();
            showViewModal(selectedProjecto);
        } catch (error) {
            console.error('Error removing actividad:', error);
        }
    };

    const handleEditActividadSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            // Ajustar la fecha antes de enviar al backend
            const adjustedEditActividadData = { ...editActividadData, dia: addOneDay(editActividadData.dia) };

            await axios.put(
                `${backAPI}/api/projecto/${selectedProjecto}/actividades/update/${selectedActividad}`,
                adjustedEditActividadData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Actualizar el estado del proyecto después de editar la actividad
            setSelectedProjectoData(prevData => ({
                ...prevData,
                actividades: prevData.actividades.map(actividad =>
                    actividad._id === selectedActividad ? adjustedEditActividadData : actividad
                )
            }));

            hideEditActividadModal();
            fetchProjectos();
            showViewModal(selectedProjecto);
        } catch (error) {
            console.error('Error editing actividad:', error);
        }
    };

    // Función para enviar el formulario
    const handleFinalizeSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const finalizeData = {
                alumnos_responsables: finalizeResponsables,
                alumnos_colaboradores: finalizeColaboradores
            };
            await axios.post(`${backAPI}/api/projecto/finalize/${selectedProjecto}`, finalizeData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            hideFinalizeModal();
            fetchProjectos();
        } catch (error) {
            console.error('Error finalizing project:', error);
        }
    };

    const addOneDay = (date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return newDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };

    const adjustProjectDates = (project) => {
        return {
            ...project,
            duracion: {
                inicio: addOneDay(project.duracion.inicio),
                fin: addOneDay(project.duracion.fin)
            }
        };
    };


    // Función para manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === "checkbox" && (name === "docentes" || name === "alumnos_responsables" || name === "alumnos_colaboradores" || name === "materias")) {
            // Si es un checkbox, maneja el cambio del array de IDs
            const selectedId = value; // El valor del checkbox es el ID
            setFormData(prevState => ({
                ...prevState,
                [name]: checked ? [...prevState[name], selectedId] : prevState[name].filter(id => id !== selectedId)
            }));
        } else if (name === "inicio" || name === "fin") {
            // Si es un campo de fecha dentro de duracion, actualiza la estructura anidada
            setFormData(prevState => ({
                ...prevState,
                duracion: {
                    ...prevState.duracion,
                    [name]: value
                }
            }));
        } else {
            // De lo contrario, maneja el cambio normalmente
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };



    // Función para manejar cambios en el formulario de edición
    const handleEditChange = (e) => {
        const { name, value } = e.target;
    
        setSelectedProjecto(prevState => {
            if (name === 'inicio' || name === 'fin') {
                // Si el campo que cambió es 'inicio' o 'fin', actualizamos duracion
                return {
                    ...prevState,
                    duracion: {
                        ...prevState.duracion,
                        [name]: value
                    }
                };
            } else {
                // Para cualquier otro campo, actualizamos directamente en prevState
                return {
                    ...prevState,
                    [name]: value
                };
            }
        });
    };
    


    // Función para manejar los cambios en el formulario de actividad
    const handleActividadFormChange = (e) => {
        const { name, value } = e.target;
        setActividadData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Función para manejar los cambios en el formulario de edición de actividad
    const handleEditActividadFormChange = (e) => {
        const { name, value } = e.target;
        setEditActividadData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Función para manejar los cambios en los inputs del formulario
    const handleFinalizeChange = (e, index, field, type) => {
        const { value } = e.target;
        if (type === 'responsables') {
            setFinalizeResponsables(prevState => {
                const updatedData = [...prevState];
                updatedData[index][field] = value;
                return updatedData;
            });
        } else {
            setFinalizeColaboradores(prevState => {
                const updatedData = [...prevState];
                updatedData[index][field] = value;
                return updatedData;
            });
        }
    };

    // Función para manejar los cambios en los selects del formulario
    const handleSelectChange = (selectedOptions, index, field, type) => {
        const selectedIds = selectedOptions.map(option => option.value);
        if (type === 'responsables') {
            setFinalizeResponsables(prevState => {
                const updatedData = [...prevState];
                updatedData[index][field] = selectedIds;
                return updatedData;
            });
        } else {
            setFinalizeColaboradores(prevState => {
                const updatedData = [...prevState];
                updatedData[index][field] = selectedIds;
                return updatedData;
            });
        }
    };


    useEffect(() => {
        fetchProjectos();
        fetchAlumnos();
        fetchCarrera();
        fetchDocentes();
        fetchMateria();
    }, []);

    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de administración de proyectos</h1>
            <div className="py-2">
                <nav className="flex justify-start space-x-4">
                    <Button className="bg-green-600" onClick={() => setOpenCreateModal(true)}>Cargar Proyecto</Button>
                </nav>
            </div>
            <div className="min-h-full">
                <div className="overflow-x-auto text-left">
                    <Table>
                        <TableHead>
                            <TableHeadCell>Titulo</TableHeadCell>
                            <TableHeadCell>Carrera</TableHeadCell>
                            <TableHeadCell>Total de horas</TableHeadCell>
                            <TableHeadCell>Estado</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                            <TableHeadCell><span className="sr-only">Actividades</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {ProjectosData.map(projecto => (
                                <TableRow key={projecto._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{projecto.titulo}</TableCell>
                                    <TableCell>{projecto.carrera?.carrera}</TableCell>
                                    <TableCell>{projecto.total_horas} hs.</TableCell>
                                    <TableCell>{projecto.estado === 'Nuevo' ? (
                                        <Badge color="success">Nuevo</Badge>
                                    ) : projecto.estado === 'Finalizado' ? (
                                        <Badge color="success">Finalizado</Badge>
                                    ) : (
                                        <Badge color="failure">Cancelado</Badge>
                                    )}</TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showViewModal(projecto._id)}>Ver detalles</DropdownItem>
                                            <DropdownItem onClick={() => showEditModal(projecto)}>Editar</DropdownItem>
                                            <DropdownItem onClick={() => showFinalizeModal(projecto._id)}>Finalizar</DropdownItem>
                                            <DropdownItem className="text-red-500 font-bold" onClick={() => showDeleteModal(projecto._id)}>Eliminar</DropdownItem>
                                        </Dropdown>
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown label="Actividades" inline>
                                            <DropdownItem onClick={() => showAddActividadModal(projecto._id)}>Agregar Actividad</DropdownItem>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Modal
                    show={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    size='xl'
                >
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="p-4">Crear Proyecto</ModalHeader>
                        <ModalBody>
                            <div className="overflow-y-scroll overflow-x-hidden" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                                <div className="mb-4">
                                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        id="titulo"
                                        value={formData.titulo}
                                        onChange={handleChange}
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Título del proyecto"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resumen" className="block text-sm font-medium text-gray-700">Resumen</label>
                                    <textarea
                                        name="resumen"
                                        id="resumen"
                                        value={formData.resumen}
                                        onChange={handleChange}
                                        rows="3"
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Resumen del proyecto"
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-4 flex justify-between gap-3">
                                    <div className="w-full">
                                        <label htmlFor="dia-inicio" className="block text-sm font-medium text-gray-700">Día de Inicio</label>
                                        <input
                                            type="date"
                                            name="inicio"
                                            id="dia-inicio"
                                            value={formData.duracion.inicio}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="dia-fin" className="block text-sm font-medium text-gray-700">Día de Fin</label>
                                        <input
                                            type="date"
                                            name="fin"
                                            id="dia-fin"
                                            value={formData.duracion.fin}
                                            onChange={handleChange}
                                            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700">Objetivos</label>
                                    <textarea
                                        name="objetivos"
                                        id="objetivos"
                                        value={formData.objetivos}
                                        onChange={handleChange}
                                        rows="3"
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Objetivos del proyecto"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                    <select
                                        name="carrera"
                                        id="carrera"
                                        value={formData.carrera}
                                        onChange={handleChange}
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Seleccionar carrera</option>
                                        {CarrerasData.map(carrera => (
                                            <option key={carrera._id} value={carrera._id}>{carrera.carrera}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="docentes" className="block text-sm font-medium text-gray-700">Docentes</label>
                                    <Select
                                        id="docentes"
                                        name="docentes"
                                        options={DocentesData.map(docente => ({ value: docente._id, label: docente.nombre }))}
                                        isMulti
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setFormData(prevState => ({
                                                ...prevState,
                                                docentes: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="alumnos_responsables" className="block text-sm font-medium text-gray-700">Alumnos Responsables</label>
                                    <Select
                                        id="alumnos_responsables"
                                        name="alumnos_responsables"
                                        options={AlumnosData.map(alumno => ({ value: alumno._id, label: alumno.nombre }))}
                                        isMulti
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setFormData(prevState => ({
                                                ...prevState,
                                                alumnos_responsables: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="alumnos_colaboradores" className="block text-sm font-medium text-gray-700">Alumnos Colaboradores</label>
                                    <Select
                                        id="alumnos_colaboradores"
                                        name="alumnos_colaboradores"
                                        options={AlumnosData.map(alumno => ({ value: alumno._id, label: alumno.nombre }))}
                                        isMulti
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setFormData(prevState => ({
                                                ...prevState,
                                                alumnos_colaboradores: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="materias" className="block text-sm font-medium text-gray-700">Materias</label>
                                    <Select
                                        id="materias"
                                        name="materias"
                                        options={MateriaData.map(materia => ({ value: materia._id, label: materia.materia }))}
                                        isMulti
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setFormData(prevState => ({
                                                ...prevState,
                                                materias: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                            </div>


                        </ModalBody>
                        <ModalFooter className="justify-between">
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
                        ¿Estás seguro de que quieres eliminar este proyecto?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDeleteModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleDeleteProjecto}>Eliminar</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    show={openEditModal}
                    onClose={hideEditModal}
                    size='xl'
                >
                    <form onSubmit={handleEditSubmit}>
                        <ModalHeader className="p-4">Editar Proyecto</ModalHeader>
                        <ModalBody>
                            <div className="overflow-y-scroll overflow-x-hidden" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                                <div className="mb-4">
                                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        id="titulo"
                                        value={selectedProjecto?.titulo || ''}
                                        onChange={handleEditChange}
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Título del proyecto"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resumen" className="block text-sm font-medium text-gray-700">Resumen</label>
                                    <textarea
                                        name="resumen"
                                        id="resumen"
                                        value={selectedProjecto?.resumen || ''}
                                        onChange={handleEditChange}
                                        rows="3"
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Resumen del proyecto"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4 flex justify-between gap-3">
                                    <div className="w-full">
                                        <label htmlFor="dia-inicio" className="block text-sm font-medium text-gray-700">Día de Inicio</label>
                                        <input
                                            type="date"
                                            name="inicio"
                                            id="dia-inicio"
                                            value={selectedProjecto?.duracion?.inicio || ''}
                                            onChange={handleEditChange}
                                            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="dia-fin" className="block text-sm font-medium text-gray-700">Día de Fin</label>
                                        <input
                                            type="date"
                                            name="fin"
                                            id="dia-fin"
                                            value={selectedProjecto?.duracion?.fin || ''}
                                            onChange={handleEditChange}
                                            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700">Objetivos</label>
                                    <textarea
                                        name="objetivos"
                                        id="objetivos"
                                        value={selectedProjecto?.objetivos || ''}
                                        onChange={handleEditChange}
                                        rows="3"
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Objetivos del proyecto"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                                    <select
                                        name="carrera"
                                        id="carrera"
                                        value={selectedProjecto?.carrera?._id || ''}
                                        onChange={handleEditChange}
                                        className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Seleccionar carrera</option>
                                        {CarrerasData.map(carrera => (
                                            <option key={carrera._id} value={carrera._id}>{carrera.carrera}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="docentes" className="block text-sm font-medium text-gray-700">Docentes</label>
                                    <Select
                                        id="docentes"
                                        name="docentes"
                                        options={(DocentesData || []).map(docente => ({ value: docente._id, label: docente.nombre }))}
                                        isMulti
                                        defaultValue={(selectedProjecto?.docentes || []).map(docente => ({ value: docente._id, label: docente.nombre }))}
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setSelectedProjecto(prevState => ({
                                                ...prevState,
                                                docentes: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="alumnos_responsables" className="block text-sm font-medium text-gray-700">Alumnos Responsables</label>
                                    <Select
                                        id="alumnos_responsables"
                                        name="alumnos_responsables"
                                        options={(AlumnosData || []).map(alumno => ({ value: alumno._id, label: alumno.nombre }))}
                                        isMulti
                                        defaultValue={(selectedProjecto?.alumnos_responsables || []).map(alumno => ({ value: alumno._id, label: alumno.nombre }))}
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setSelectedProjecto(prevState => ({
                                                ...prevState,
                                                alumnos_responsables: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="alumnos_colaboradores" className="block text-sm font-medium text-gray-700">Alumnos Colaboradores</label>
                                    <Select
                                        id="alumnos_colaboradores"
                                        name="alumnos_colaboradores"
                                        options={(AlumnosData || []).map(alumno => ({ value: alumno._id, label: alumno.nombre }))}
                                        isMulti
                                        defaultValue={(selectedProjecto?.alumnos_colaboradores || []).map(alumno => ({ value: alumno._id, label: alumno.nombre }))}
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setSelectedProjecto(prevState => ({
                                                ...prevState,
                                                alumnos_colaboradores: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="materias" className="block text-sm font-medium text-gray-700">Materias</label>
                                    <Select
                                        id="materias"
                                        name="materias"
                                        options={(MateriaData || []).map(materia => ({ value: materia._id, label: materia.materia }))}
                                        isMulti
                                        defaultValue={(selectedProjecto?.materias || []).map(materia => ({ value: materia._id, label: materia.materia }))}
                                        onChange={(selectedOptions) => {
                                            const selectedIds = selectedOptions.map(option => option.value);
                                            setSelectedProjecto(prevState => ({
                                                ...prevState,
                                                materias: selectedIds
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                        </ModalBody>
                        <ModalFooter className="justify-between">
                            <Button className="bg-red-400 hover:bg-red-600" onClick={hideEditModal}>Cancelar</Button>
                            <Button type="submit" className="bg-green-400 hover:bg-green-600">Guardar Cambios</Button>
                        </ModalFooter>
                    </form>
                </Modal>


                <Modal
                    show={openAddActividadModal}
                    onClose={() => setOpenAddActividadModal(false)}
                    size='xl'
                >
                    <form onSubmit={handleAddActividadSubmit}>
                        <ModalHeader className="p-4">Agregar Actividad</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="actividad-titulo" className="block text-sm font-medium text-gray-700">Título</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    id="actividad-titulo"
                                    value={actividadData.titulo}
                                    onChange={handleActividadFormChange}
                                    className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Título de la actividad"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="actividad-dia" className="block text-sm font-medium text-gray-700">Día</label>
                                <input
                                    type="date"
                                    name="dia"
                                    id="actividad-dia"
                                    value={actividadData.dia}
                                    onChange={handleActividadFormChange}
                                    className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="actividad-hora-extension" className="block text-sm font-medium text-gray-700">Hora de Extensión</label>
                                <input
                                    type="time"
                                    name="hora_extension"
                                    id="actividad-hora-extension"
                                    value={actividadData.hora_extension}
                                    onChange={handleActividadFormChange}
                                    className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"

                                />
                            </div>
                        </ModalBody>
                        <ModalFooter className="justify-between">
                            <Button className="bg-red-400 hover:bg-red-600" onClick={() => setOpenAddActividadModal(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-green-400 hover:bg-green-600">Agregar</Button>
                        </ModalFooter>
                    </form>
                </Modal>
                <Modal
                    show={openViewModal}
                    onClose={() => hideViewModal(false)}
                    size='xl'
                >
                    <ModalHeader className="bg-gray-300 p-4">Detalles del Proyecto</ModalHeader>
                    <ModalBody>
                        <div className="overflow-y-scroll overflow-x-hidden" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                            <div className="flex flex-col space-y-4">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold mb-4">{selectedProjectoData.titulo}</h2>
                                </div>
                                <div className="flex flex-wrap -mx-2">
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Resumen</h3>
                                        <p>{selectedProjectoData.resumen}</p>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Fecha de Inicio</h3>
                                        <p>{new Date(selectedProjectoData.duracion?.inicio).toLocaleDateString()}</p>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Fecha de Fin</h3>
                                        <p>{new Date(selectedProjectoData.duracion?.fin).toLocaleDateString()}</p>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Carrera</h3>
                                        <p>{selectedProjectoData.carrera?.carrera}</p>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Estado</h3>
                                        <p>{selectedProjectoData.estado}</p>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Objetivos</h3>
                                        <p>{selectedProjectoData.objetivos}</p>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Fecha de Creación</h3>
                                        <p>{new Date(selectedProjectoData.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Última Actualización</h3>
                                        <p>{new Date(selectedProjectoData.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap -mx-2">
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Docentes</h3>
                                        <ul className="list-disc pl-5 overflow-x-auto">
                                            {(selectedProjectoData.docentes || []).map(docente => (
                                                <li key={docente._id}>{docente.nombre} {docente.apellido}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="w-full px-2 mb-4 md:w-1/2">
                                        <h3 className="text-lg font-semibold">Materias</h3>
                                        <ul className="list-disc pl-5 overflow-x-auto">
                                            {(selectedProjectoData.materias || []).map(materia => (
                                                <li key={materia._id}>{materia.materia}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Alumnos Responsables</h3>
                                    <ul className="list-disc pl-5 overflow-x-auto">
                                        {(selectedProjectoData.alumnos_responsables || []).map(alumno => (
                                            <li key={alumno._id}>{alumno.nombre} {alumno.apellido} (CI: {alumno.ci})</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Alumnos Colaboradores</h3>
                                    <ul className="list-disc pl-5 overflow-x-auto">
                                        {(selectedProjectoData.alumnos_colaboradores || []).map(alumno => (
                                            <li key={alumno._id}>{alumno.nombre} {alumno.apellido} (CI: {alumno.ci})</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Actividades</h3>
                                    <ul className="list-disc pl-5 overflow-x-auto">
                                        {(selectedProjectoData.actividades || []).map(actividad => (
                                            <li key={actividad._id} className="flex flex-wrap justify-between">
                                                <span>{actividad.titulo} (Día: {new Date(actividad.dia).toLocaleDateString()}) (Horas de Extensión: {actividad.hora_extension} hs.)</span>
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="font-bold text-red-600"
                                                        onClick={() => showDropActividadModal(selectedProjectoData._id, actividad._id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button
                                                        className="font-bold text-blue-600"
                                                        onClick={() => showEditActividadModal(selectedProjectoData._id, actividad)}
                                                    >
                                                        Editar
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Total de Horas</h3>
                                    <p>{selectedProjectoData.total_horas} hs.</p>
                                </div>
                            </div>
                        </div>

                    </ModalBody>

                    <ModalFooter>
                        <Button className="bg-red-600" onClick={hideViewModal}>Cerrar</Button>
                    </ModalFooter>
                </Modal>




                <Modal
                    show={openDropActividadModal}
                    onClose={hideDropActividadModal}
                    size="sm"
                >
                    <ModalHeader className="p-4">Confirmar Eliminación</ModalHeader>
                    <ModalBody>
                        ¿Estás seguro de que quieres eliminar esta actividad del projecto?
                    </ModalBody>
                    <ModalFooter className="flex justify-between">
                        <Button className="bg-red-400 hover:bg-red-600" onClick={hideDropActividadModal}>Cancelar</Button>
                        <Button className="bg-green-400 hover:bg-green-600" onClick={handleRemoveActividad}>Eliminar</Button>
                    </ModalFooter>
                </Modal>

                <Modal
                    show={openEditActividadModal}
                    onClose={hideEditActividadModal}
                    size='xl'
                >
                    <form onSubmit={handleEditActividadSubmit}>
                        <ModalHeader className="p-4">Editar Actividad</ModalHeader>
                        <ModalBody>
                            <div className="mb-4">
                                <label htmlFor="edit-actividad-titulo" className="block text-sm font-medium text-gray-700">Título</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    id="edit-actividad-titulo"
                                    value={editActividadData.titulo}
                                    onChange={handleEditActividadFormChange}
                                    className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Título de la actividad"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="edit-actividad-dia" className="block text-sm font-medium text-gray-700">Día</label>
                                <input
                                    type="date"
                                    name="dia"
                                    id="edit-actividad-dia"
                                    value={editActividadData.dia}
                                    onChange={handleEditActividadFormChange}
                                    className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="edit-actividad-hora-extension" className="block text-sm font-medium text-gray-700">Hora de Extensión</label>
                                <input
                                    type="time"
                                    name="hora_extension"
                                    id="edit-actividad-hora-extension"
                                    value={editActividadData.hora_extension}
                                    onChange={handleEditActividadFormChange}
                                    className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter className="justify-between">
                            <Button className="bg-red-400 hover:bg-red-600" onClick={hideEditActividadModal}>Cancelar</Button>
                            <Button type="submit" className="bg-green-400 hover:bg-green-600">Guardar Cambios</Button>
                        </ModalFooter>
                    </form>
                </Modal>

                <Modal
                    show={openFinalizeModal}
                    onClose={hideFinalizeModal}
                    size='xl'
                >
                    <form onSubmit={handleFinalizeSubmit}>
                        <ModalHeader className="p-4">Finalizar Proyecto</ModalHeader>
                        <ModalBody>
                            <div className="overflow-y-scroll overflow-x-hidden" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-700">Alumnos Responsables</h3>
                                    {projectAlumnos.alumnos_responsables && projectAlumnos.alumnos_responsables.map((alumno, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <p className="text-sm font-medium text-gray-700">{alumno.nombre}</p>
                                            <label htmlFor={`hora_extra_${index}`} className="block text-sm font-medium text-gray-700">Horas Extras</label>
                                            <input
                                                type="time"
                                                name={`hora_extra_${index}`}
                                                id={`hora_extra_${index}`}
                                                value={finalizeResponsables[index]?.hora_extra || ''}
                                                onChange={(e) => handleFinalizeChange(e, index, 'hora_extra', 'responsables')}
                                                className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="HH:MM"
                                            />
                                            <label htmlFor={`actividades_${index}`} className="block text-sm font-medium text-gray-700 mt-2">Actividades</label>
                                            <Select
                                                id={`actividades_${index}`}
                                                name={`actividades_${index}`}
                                                options={projectAlumnos.actividades.map(actividad => ({ value: actividad._id, label: actividad.titulo }))}
                                                isMulti
                                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, index, 'actividades', 'responsables')}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-700">Alumnos Colaboradores</h3>
                                    {projectAlumnos.alumnos_colaboradores && projectAlumnos.alumnos_colaboradores.map((alumno, index) => (
                                        <div key={index} className="mb-4 border-b pb-4">
                                            <p className="text-sm font-medium text-gray-700">{alumno.nombre}</p>
                                            <label htmlFor={`actividades_colab_${index}`} className="block text-sm font-medium text-gray-700 mt-2">Actividades</label>
                                            <Select
                                                id={`actividades_colab_${index}`}
                                                name={`actividades_colab_${index}`}
                                                options={projectAlumnos.actividades.map(actividad => ({ value: actividad._id, label: actividad.titulo }))}
                                                isMulti
                                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, index, 'actividades', 'colaboradores')}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter className="justify-between">
                            <Button className="bg-red-400 hover:bg-red-600" onClick={hideFinalizeModal}>Cancelar</Button>
                            <Button type="submit" className="bg-green-400 hover:bg-green-600">Finalizar</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

export default ManageProjecto;
