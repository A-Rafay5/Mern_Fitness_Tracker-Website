import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserAlt, FaBars, FaDumbbell, FaCarrot, FaChartLine } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { TbMessageChatbotFilled } from "react-icons/tb";
const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  return (
    <div
      className={`bg-gray-900 text-white h-screen fixed transition-all duration-300 ease-in-out shadow-xl ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button
          onClick={onToggle}
          className="text-gray-300 hover:text-indigo-500 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 space-y-6 px-3 mt-4">
        {[
          { to: "/", label: "Home", icon: <FaHome size={20} /> },
          { to: "/dashboard", label: "Dashboard", icon: <MdSpaceDashboard size={20} /> },
          { to: "/dashboard/workouts", label: "Workouts", icon: <FaDumbbell size={20} /> },
          { to: "/dashboard/nutrition", label: "Nutrition", icon: <FaCarrot size={20} /> },
          { to: "/dashboard/progress", label: "Progress", icon: <FaChartLine size={20} /> },
          { to: "/dashboard/profile", label: "Profile", icon: <FaUserAlt size={20} /> },
          { to: "/wingman", label: "Wingman AI", icon: <TbMessageChatbotFilled size={20} /> },
        ].map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`flex items-center p-2 rounded-md transition-all duration-200 hover:bg-indigo-600 ${
                location.pathname === item.to ? "bg-indigo-700" : "text-gray-300"
              }`}
              aria-label={item.label}
            >
              <span className="flex items-center justify-start text-2xl">{item.icon}</span>
              {!isCollapsed && <span className="ml-4">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="text-gray-500 text-sm p-4 mt-auto">
        {!isCollapsed && <p>© 2024 Your Company</p>}
      </div>
    </div>
  );
};

export default Sidebar;
