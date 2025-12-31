import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Assets } from "../Assets/assets";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState(""); 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/signup", form);

      setNotification(res.data.message || "✅ Account created successfully!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setNotification(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="signup-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${Assets.leahandritadesign})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "2%",
        marginTop: "1%",
        marginBottom: "1%",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255,255,255,0.8)",
        }}
      >
        <h3 className="text-center mb-4 text-dark">Create Account</h3>

        
        {notification && (
          <div className="alert alert-success">{notification}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-dark">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-dark">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-dark">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-dark">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
