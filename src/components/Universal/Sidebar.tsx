import React from "react";
interface SidebarProps {
    isOpen: boolean
    closeSidebar: () => void
    title?: string
    children: React.ReactNode
  }

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar, children }) => {


  return (
    <>
      <div className={`
        offcanvas offcanvas-end pt-3
        ${isOpen ? "show" : ""}`} 
        tabIndex={1} 
        style={{ 
          visibility: isOpen ? "visible" : "hidden", 
          position: isOpen ? "sticky" : "absolute",
          height: "80vh",
          }}>
        <div className="offcanvas-header p-0 pe-5">
          <button
            type="button"
            className="btn-close"
            onClick={closeSidebar}
            aria-label="Close"
            >
            </button>
        </div>
        <div className="offcanvas-body">{children}</div>
      </div>

      {/* Backdrop
      {isOpen && (
        <div
          className="modal-backdrop fade show"
          onClick={closeSidebar}
        ></div>
      )} */}
    </>
  );
};

export default Sidebar;
