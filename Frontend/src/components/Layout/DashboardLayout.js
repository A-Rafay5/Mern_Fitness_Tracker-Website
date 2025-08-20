import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar collapse
  const sidebarWidth = isSidebarCollapsed ? 80 : 256; // Sidebar width in pixels

  return (
    <>
      {/* Inline styles for responsive adjustments */}
      <style>
        {`
          @media (max-width: 768px) {
            .sidebar {
              width: 80px !important; /* Sidebar collapses to 80px on smaller screens */
            }

            .main-content {
              margin-left: 80px !important;
              width: calc(100% - 80px) !important;
            }
          }

          @media (min-width: 768px) {
            .sidebar {
              transition: width 0.3s ease-in-out; /* Smooth transition for sidebar */
            }

            .main-content {
              transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out; /* Smooth transition for content */
            }
          }
        `}
      </style>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className="sidebar bg-gray-900 text-white fixed h-screen shadow-xl"
          style={{
            width: `${sidebarWidth}px`,
            transition: "width 0.3s ease-in-out",
          }}
        >
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Main Content */}
        <div
          className="main-content flex flex-col"
          style={{
            marginLeft: `${sidebarWidth}px`,
            width: `calc(100% - ${sidebarWidth}px)`,
            transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
            overflowX: "hidden", // Prevent horizontal scroll issues
          }}
        >
          {/* Topbar */}
          <Topbar />

          {/* Scrollable Main Content */}
          <div
            className="flex-1 p-6 bg-gray-100 overflow-auto"
            style={{ height: "calc(100vh - 64px)" }} // Adjust for topbar height
          >
            <Outlet /> {/* Render child routes */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
