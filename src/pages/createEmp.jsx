import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEmp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState(null);
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [designation, setDesignation] = useState("");
  const [isVerified, setIsVerified] = useState(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Check if file is selected
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpg', 'image/png'];
      if (allowedTypes.includes(file.type)) {
        setFile(file);
      } else {
        alert("Please upload a file in JPG or PNG format.");
        setFile(null); // Clear the file input
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobileNo", mobile);
    formData.append("file", file);
    formData.append("gender", gender);
    formData.append("designation", designation);
    formData.append("course", course);

    try {
      const response = await axios.post(
        "http://localhost:4000/createEmp",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Employee created successfully:", response.data);
      // Optionally, redirect or reset the form
      setName("");
      setEmail("");
      setMobile("");
      setFile(null);
      setGender("");
      setDesignation("");
      setCourse("");
      navigate("/cemp"); 
    } catch (error) {
      console.error("Error creating employee:", error);
    }
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
            <Sidebar data={"Create Employee"} />
          </div>
          <div className="p-4">
            <form
              className="space-y-4"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div>
                <label htmlFor="name" className="block">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block">
                  Mobile No:
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border border-gray-300 p-2 w-full"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div>
                <label htmlFor="file" className="block">
                  Upload File:
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block">Designation:</label>
                <div className="flex items-center space-x-4">
                  <div>
                    <input
                      type="radio"
                      id="HR"
                      name="designation"
                      value="HR"
                      checked={designation === "HR"}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="HR">HR</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="manager"
                      name="designation"
                      value="manager"
                      checked={designation === "manager"}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="manager">Manager</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="sales"
                      name="designation"
                      value="sales"
                      checked={designation === "sales"}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="sales">Sales</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block">Gender:</label>
                <div className="flex items-center space-x-4">
                  <div>
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="male">Male</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="female">Female</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block">Course:</label>
                <div className="flex items-center space-x-4">
                  <div>
                    <input
                      type="radio"
                      id="MCA"
                      name="course"
                      value="MCA"
                      checked={course === "MCA"}
                      onChange={(e) => setCourse(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="MCA">MCA</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="BCA"
                      name="course"
                      value="BCA"
                      checked={course === "BCA"}
                      onChange={(e) => setCourse(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="BCA">BCA</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="BSC"
                      name="course"
                      value="BSC"
                      checked={course === "BSC"}
                      onChange={(e) => setCourse(e.target.value)}
                      className="mr-2"
                      required
                    />
                    <label htmlFor="BSC">BSC</label>
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="submit"
                  value="Submit"
                  className="bg-blue-500 text-white p-2 rounded"
                />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>Checking...</div>
      )}
    </>
  );
};

export default CreateEmp;
