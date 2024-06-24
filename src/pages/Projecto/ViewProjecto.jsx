import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Badge, Dropdown, DropdownItem, Modal, ModalBody, ModalFooter, ModalHeader, Button } from "flowbite-react";

const backAPI = process.env.BACK_URL;

const ViewProjecto = () => {
    const [ProjectosData, setProjectosData] = useState([]);
    const [filteredProjectosData, setFilteredProjectosData] = useState([]);
    const [filterState, setFilterState] = useState('Todos'); // 'Todos', 'Nuevo', 'Finalizado'
    const [searchTerm, setSearchTerm] = useState('');

    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedProjectoData, setSelectedProjectoData] = useState([]);

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

    // Función para obtener datos de los projectos para la tabla
    const fetchProjectos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backAPI}/api/projecto/get-all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setProjectosData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchProjectos();
    }, []);

    useEffect(() => {
        let filteredProjects = ProjectosData;

        if (filterState !== 'Todos') {
            filteredProjects = filteredProjects.filter(projecto => projecto.estado === filterState);
        }

        if (searchTerm) {
            filteredProjects = filteredProjects.filter(projecto =>
                projecto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProjectosData(filteredProjects);
    }, [filterState, searchTerm, ProjectosData]);

    return (
        <div className="m-8">
            <h1 className="py-2 text-xl font-bold text-gray-900 dark:text-white">Panel de visualización de los proyectos</h1>
            <div className="min-h-full">
                <div className="mb-4 flex items-center gap-3">
                    <select
                        className="p-2 border rounded-md"
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                    <input
                        type="text"
                        className="p-2 border rounded-md"
                        placeholder="Buscar por título"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Tabla de datos */}
                <div className="overflow-x-auto text-left">
                    <Table>
                        <TableHead>
                            <TableHeadCell>Titulo</TableHeadCell>
                            <TableHeadCell>Carrera</TableHeadCell>
                            <TableHeadCell>Total de horas</TableHeadCell>
                            <TableHeadCell>Estado</TableHeadCell>
                            <TableHeadCell><span className="sr-only">Acciones</span></TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                            {filteredProjectosData.map(projecto => (
                                <TableRow key={projecto._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 py-4">
                                    <TableCell>{projecto.titulo}</TableCell>
                                    <TableCell>{projecto.carrera?.carrera}</TableCell>
                                    <TableCell>{projecto.total_horas} hs.</TableCell>
                                    <TableCell>
                                        {projecto.estado === 'Nuevo' ? (
                                            <Badge color="info">Nuevo</Badge>
                                        ) : projecto.estado === 'Finalizado' ? (
                                            <Badge color="success">Finalizado</Badge>
                                        ) : (
                                            <Badge color="failure">Cancelado</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown label="Acciones" inline>
                                            <DropdownItem onClick={() => showViewModal(projecto._id)}>Ver detalles</DropdownItem>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

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
            </div>
        </div>
    );
}

export default ViewProjecto;
