import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate to redirect after logout
import { FaSignOutAlt } from 'react-icons/fa'; // Add a logout icon

const Topbar = () => {
  const navigate = useNavigate(); // useNavigate hook for redirection

  const handleLogout = () => {
    // Clear the JWT token from local storage or cookies
    localStorage.removeItem('token'); // Or remove the token from cookies if you're using cookies

    // Redirect to the login page
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="bg-gray-900 text-white w-full h-16 flex justify-between items-center px-6 md:px-10 shadow-md border-b-2 border-gray-300">
      {/* Title/Logo */}
      <div className="text-3xl font-bold">
        Dashboard
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout} // Add onClick handler for logout
          className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          aria-label="Logout"
        >
          <FaSignOutAlt size={20} /> {/* Adding icon for better clarity */}
          Logout
        </button>
      </div>
    </div>


  );
};

export default Topbar;
