import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="text-lg">
          Home
        </Link>
        <Link to="/emplist" className="text-lg">
          Employee List
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-bold">cs21b1042</span>
        <button
          className="bg-red-500 text-white px-4 py-1 rounded"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
