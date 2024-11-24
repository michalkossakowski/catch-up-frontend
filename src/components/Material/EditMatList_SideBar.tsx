import React, { useState } from "react";
import Sidebar from "../Universal/Sidebar";
import EditableMaterialList from "./EditMatList";
import SelectFile from "../File/SidebarFiles";

const EditMatList_SideBar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    return (
        <>
            <button
                className="btn btn-primary mb-3"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            </button>
            <div className="container d-flex">
            <EditableMaterialList/>
            <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)}>
                <SelectFile />
            </Sidebar>
        </div>
        </>
    );
};

export default EditMatList_SideBar;
