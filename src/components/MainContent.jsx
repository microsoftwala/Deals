import React from "react";
import { Link } from "react-router-dom";

const MainContent = () => {
  return (
    <main className="flex-1 p-4 pt-10 mb-auto">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-4xl mb-4">Welcome Admin Panel</h1>
      </div>
      <div className="bg-blue-200 p-4 rounded flex justify-center">
        <Link to="/cemp" className="font-bold hover:text-blue-800">
          Create Employee
        </Link>
      </div>
    </main>
  );
};

export default MainContent;
