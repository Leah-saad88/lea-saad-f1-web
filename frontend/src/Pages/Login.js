import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      const user = res.data.user;
      if (!user?.id) return alert("Login failed: user ID missing");

      localStorage.setItem("user", JSON.stringify(user));

      setNotification("✅ Login successful! Your Order is in progress");

      setTimeout(() => {
        navigate("/address");
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="card-title mb-3 text-center">Login</h3>

        {notification && <div className="alert alert-success">{notification}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Login</button>
        </form>
        
        <p className="text-center mt-3 mb-0">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}