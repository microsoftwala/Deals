import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmpList = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/verify",
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setIsVerified(true);
      } catch (err) {
        console.error("Token verification failed:", err);
        setIsVerified(false);
        navigate("/");
      }
    };
    if (token) {
      verifyToken();
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    async function showData() {
      try {
        const response = await axios.get("http://localhost:4000/showEmplist");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      }
    }
    if (isVerified) {
      showData();
    }
  }, [isVerified]);

  // Filter employees based on search term and searchBy option
  const filteredData = data.filter((employee) => {
    const valueToSearch = employee[searchBy]?.toLowerCase() || "";
    return valueToSearch.includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/deleteEmp/${id}`);
      setData(data.filter((employee) => employee._id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  const handleEdit = (id) => {
    // Redirect to the edit page, passing the employee ID
    navigate(`/editEmp/${id}`);
  };

  return (
    <>
      {isVerified ? (
        <div className="min-h-screen flex flex-col">
          <header className="bg-gray-200 p-4 flex items-center justify-between">
            <Logo />
            <Navbar />
          </header>
          <div className="flex w-full">
            <Sidebar data={"Show Employee Data"} />
          </div>
          <div className="p-4">
            {/* Search Input */}
            <div className="mb-4 flex flex-col space-y-2">
              <input
                type="text"
                placeholder={`Search by ${searchBy}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
              />
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="designation">Designation</option>
              </select>
            </div>
            {/* Display filtered data */}
            {filteredData.length > 0 ? (
              <ul className="space-y-4">
                {filteredData.map((employee) => (
                  <li
                    key={employee._id}
                    className="border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="text-lg font-semibold text-gray-800">
                        {employee.name}
                      </div>
                      <div className="text-gray-600">
                        Email: {employee.email}
                      </div>
                      <div className="text-gray-600">
                        Mobile No: {employee.mobileNo}
                      </div>
                      <div className="text-gray-600">
                        Designation: {employee.designation}
                      </div>
                      <div className="text-gray-600">
                        Gender: {employee.gender}
                      </div>
                      <div className="text-gray-600">
                        Course: {employee.course}
                      </div>
                      <div className="text-gray-600">
                        Joined on:{" "}
                        {new Date(employee.createDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </div>
                      <div className="mt-2 flex space-x-3">
                        <button
                          onClick={() => handleEdit(employee._id)}
                          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No employee data available</p>
            )}
          </div>
        </div>
      ) : (
        <div>Validation from backend</div>
      )}
    </>
  );
};

export default EmpList;
