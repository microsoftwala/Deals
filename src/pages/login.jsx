import React, { useState } from "react";
import axios from "axios";
import "../css/login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });
      // console.log("Response:", response.data);
      localStorage.setItem("token", response.data.token);
      setSuccess("Login successful");
      setError("");
      setUsername("");
      setPassword("");
      navigate("/home");
    } catch (error) {
      console.error("There was an error!", error);
      setError("Login failed. Please try again.");
      setUsername("");
      setPassword("");
      setSuccess("");
    }
  };

  setTimeout(() => {
    setError("");
    setSuccess("");
  }, 4000);

  return (
    <div className="hello">
      <div className="container">
        <div className="signin-form">
          <h2>Login In</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="bg-red-600  text-black pl-3 pr-3 pt-1 pb-1 rounded-md mb-2">
                {error}
              </p>
            )}
            {success && (
              <div className="bg-green-600  text-black pl-3 pr-3 pt-1 pb-1 rounded-md mb-2">
                {success}
              </div>
            )}
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
