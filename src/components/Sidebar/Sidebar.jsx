import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Logo from "../../../public/favicon.svg"

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem("token");

        if (token) {
            // Decodificar el token para obtener el ID del usuario
            const decodedToken = jwtDecode(token);
            const { rol } = decodedToken;

            setUserRole(rol);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="flex h-screen flex-col justify-between border-e bg-white">
            <div className="px-4 py-6">
                <div className="flex items-center rounded-lg bg-gray-100 text-xs text-gray-600 p-2">
                    <img src={Logo} className="w-7 mr-2" />
                    <h1 className="flex-shrink-0 font-bold text-xl">Sys Extension</h1>
                </div>

                <ul className="mt-6 space-y-1">
                    <li>
                        <Link
                            to="/home"
                            className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home' ? 'bg-gray-100' : ''} `}
                        >
                            Dashboard
                        </Link>
                    </li>

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="text-sm font-medium"> Proyectos </span>

                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">

                                <li>
                                    <Link
                                        to="/home/view-projecto"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/view-projecto' ? 'bg-gray-100' : ''}`}
                                    >
                                        Ver todos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/home/manage-projecto"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/manage-projecto' ? 'bg-gray-100' : ''}`}
                                    >
                                        Gestionar
                                    </Link>
                                </li>

                            </ul>
                        </details>
                    </li>

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="text-sm font-medium"> Datos </span>

                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">

                                <li>
                                    <Link
                                        to="/home/carrera"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/carrera' ? 'bg-gray-100' : ''}`}
                                    >
                                        Carrera
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/home/curso"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/curso' ? 'bg-gray-100' : ''}`}
                                    >
                                        Curso
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/home/promo"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/promo' ? 'bg-gray-100' : ''}`}
                                    >
                                        Promo
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/home/materia"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/materia' ? 'bg-gray-100' : ''}`}
                                    >
                                        Materia
                                    </Link>
                                </li>

                            </ul>
                        </details>
                    </li>

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="text-sm font-medium"> Datos Academicos </span>

                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">

                                <li>
                                    <Link
                                        to="/home/alumnos"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/alumnos' ? 'bg-gray-100' : ''}`}
                                    >
                                        Alumnos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/home/docentes"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/docentes' ? 'bg-gray-100' : ''}`}
                                    >
                                        Docentes
                                    </Link>
                                </li>

                            </ul>
                        </details>
                    </li>

                    {userRole === "Admin" &&
                        <li>
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                >
                                    <span className="text-sm font-medium">Administración</span>

                                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </summary>

                                <ul className="mt-2 space-y-1 px-4">

                                    <li>
                                        <Link
                                            to="/home/admin"
                                            className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/admin' ? 'bg-gray-100' : ''}`}
                                        >
                                            Usuarios
                                        </Link>
                                    </li>

                                </ul>
                            </details>
                        </li>
                    }

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="text-sm font-medium"> Cuenta </span>

                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                <li>
                                    <Link
                                        to="/home/detalles"
                                        className={`block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${location.pathname === '/home/detalles' ? 'bg-gray-100' : ''}`}
                                    >
                                        Detalles
                                    </Link>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
                <form onSubmit={handleLogout}>
                    <button
                        type="submit"
                        className="group relative flex w-full justify-start rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-5 opacity-75"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>

                        <span className="ml-2 text-sm font-medium text-gray-500">
                            Cerrar Sesion
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Sidebar;