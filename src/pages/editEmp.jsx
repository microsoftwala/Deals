// src/pages/EditEmp.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEmp = () => {
  const { id } = useParams(); // Extract employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await axios.get(`http://localhost:4000/findEmp/${id}`);
        const emp = response.data;
        console.log(emp.name)
        setEmployee(emp);
        setName(emp.name);
        setEmail(emp.email);
        setMobile(emp.mobileNo);
        setDesignation(emp.designation);
        setGender(emp.gender);
        setCourse(emp.course);
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    }
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployee = {
      name,
      email,
      mobileNo: mobile,
      designation,
      gender,
      course,
    };

    try {
      await axios.put(`http://localhost:4000/updateEmp/${id}`, updatedEmployee);
      navigate("/emplist"); 
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Edit Employee</h1>
      {employee ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block">Mobile No:</label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              pattern="[0-9]{10}"
              required
            />
          </div>
          <div>
            <label htmlFor="designation" className="block">Designation:</label>
            <select
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            >
              <option value="HR">HR</option>
              <option value="manager">Manager</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div>
            <label htmlFor="gender" className="block">Gender:</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="course" className="block">Course:</label>
            <select
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            >
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
              <option value="BSC">BSC</option>
            </select>
          </div>
          <div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update</button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditEmp;
