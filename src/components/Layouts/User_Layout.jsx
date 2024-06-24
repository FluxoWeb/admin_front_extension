import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import StatusNavbar from "../Navbar/StatusNavbar";

const User_Layout = () => {
    return (
        <div className="flex h-screen">
            <div className="w-1/6">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-grow overflow-y-auto">
                <StatusNavbar/>
                {/* Header o Tabs */}
                <div className="flex-grow overflow-y-auto">
                    <Outlet />
                </div>
                {/* Footer */}
            </div>
        </div>
    );
};

export default User_Layout;