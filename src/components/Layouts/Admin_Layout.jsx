import React from "react";
import { Outlet } from "react-router-dom";

const Admin_Layout = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default Admin_Layout;