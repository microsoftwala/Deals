import React, { useEffect, useState } from "react";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const App = () => {
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
        console.log(response.data)
        setIsVerified(true);
      } catch (err) {
        console.error("Token verification failed:", err);
        setIsVerified(false);
      } finally {
        console.log("")
      }
    };
    if (token) {
      verifyToken();
    } else {
      navigate("/")
    }
  }, []);

  return (
    <>
      {isVerified ? (
        <div className="min-h-screen flex flex-col">
          <header className="bg-gray-200 p-4 flex items-center justify-between">
            <Logo />
            <Navbar />
          </header>
          <div className="flex flex-col">
            <Sidebar data={"Dashboard"} />
            <MainContent />
          </div>
        </div>
      ) : (
        <div>Validation from backend!!!</div>
      )}
    </>
  );
  
};

export default App;
