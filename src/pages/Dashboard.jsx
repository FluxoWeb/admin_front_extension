import React, { useState, useEffect } from "react";
import axios from "axios";
import CardCounter from "../components/Card/CardCounter";
import CardInfo from "../components/Card/CardInfo";

const backAPI = process.env.BACK_URL;

const Dashboard = () => {
    const [AlumnosData, setAlumnosData] = useState([]);
    const [DocentesData, setDocentesData] = useState([]);
    const [CursosData, setCursosData] = useState([]);
    const [CarrerasData, setCarrerasData] = useState([]);
    const [PromosData, setPromosData] = useState([]);

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

    // Función para obtener datos de las promos
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

    // Calcular el total de los datos
    const totalAlumnos = AlumnosData.length;
    const totalDocentes = DocentesData.length;
    const totalCursos = CursosData.length;
    const totalCarreras = CarrerasData.length;
    const totalPromos = PromosData.length;

    useEffect(() => {
        fetchAlumnos();
        fetchDocentes();
        fetchCurso();
        fetchCarrera();
        fetchPromo();
    }, []);

    const anchoCard = '230px';

    return (
        <div className="m-8">
            <div className="flex justify-between">
                <CardCounter title="Cursos" icon="fa-solid fa-award" color="blue" width={anchoCard} total={totalCursos} />
                <CardCounter title="Carreras" icon="fa-solid fa-stopwatch" color="red" width={anchoCard} total={totalCarreras} />
                <CardCounter title="Promos" icon="fa-solid fa-graduation-cap" color="yellow" width={anchoCard} total={totalPromos} />
                <CardCounter title="Alumnos" icon="fa-solid fa-user-graduate" color="green" width={anchoCard} total={totalAlumnos} />
                <CardCounter title="Docentes" icon="fa-solid fa-person-chalkboard" color="purple" width={anchoCard} total={totalDocentes} />
            </div>
            <div className="my-8">
                <CardInfo/>
            </div>
        </div>
    );
};

export default Dashboard;