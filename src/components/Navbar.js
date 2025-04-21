// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAdmin, setIsAdmin }) => {
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-yellow-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Home
        </Link>
        <div className="space-x-6">
          <Link to="/prices" className="font-bold text-white text-lg hover:text-gray-300 hover:underline">
            Prices
          </Link>
          <Link to="/upload" className="font-bold text-white text-lg hover:text-gray-300 hover:underline">
            Upload
          </Link>
          {isAdmin && (
        <button
          onClick={handleLogout}
          className=" font-bold text-lg hover:underline hover:text-gray-300"
        >
          Logout
        </button>
      )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
