import React from "react";

const Sidebar = ({ data }) => {
  return (
    <div className="bg-yellow-400 p-4 font-bold w-full">
      <nav>
        <div className="block text-2xl">
          {data}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
