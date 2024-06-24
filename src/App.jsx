import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Paginas
import Login from "./pages/Login";

// Paginas de users
import Detalles from "./pages/User/Detalles";
import Dashboard from "./pages/Dashboard";
import Carrera from "./pages/Carrera";
import Curso from "./pages/Curso";
import Promo from "./pages/Promo";
import Alumnos from "./pages/Alumnos";
import Docentes from "./pages/Docentes";
import Materia from "./pages/Materia";

// Paginas de Projecto
import ManageProjecto from "./pages/Projecto/ManageProjecto";
import ViewProjecto from "./pages/Projecto/ViewProjecto";

// Paginas de Admins
import Admin_Panel from "./pages/Admin/Admin_Panel";
import Users from "./pages/Admin/Users";

// Layouts
import Layout from "./components/Layouts/Layout";
import User_Layout from "./components/Layouts/User_Layout";
import Admin_Layout from "./components/Layouts/Admin_Layout";

// Protected Routes
import User_Protected_Routes from "./components/Protected_Routes/User_Protected_Routes";
import Admin_Protected_Routes from "./components/Protected_Routes/Admin_Protected_Routes";



const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />

            {/* Rutas protegidas para los usuarios con el rol de "User" */}
            <Route path="home" element={
              <User_Protected_Routes>
                <User_Layout />
              </User_Protected_Routes>
            }>
              <Route index element={<Dashboard />} />

              <Route path="detalles" element={<Detalles />} />

              <Route path="carrera" element={<Carrera />} />
              <Route path="curso" element={<Curso />} />
              <Route path="promo" element={<Promo />} />
              <Route path="materia" element={<Materia />} />

              <Route path="manage-projecto" element={<ManageProjecto/>}/>
              <Route path="view-projecto" element={<ViewProjecto/>}/>

              <Route path="alumnos" element={<Alumnos />} />
              <Route path="docentes" element={<Docentes />} />

              {/* Rutas protegidas para los usuarios con el rol de "Admin" */}
              <Route path="admin" element={
                <Admin_Protected_Routes>
                  <Admin_Layout />
                </Admin_Protected_Routes>
              }>
                <Route index element={<Users />} />

              </Route>

            </Route>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;