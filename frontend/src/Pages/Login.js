import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Assets } from "../Assets/assets";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending request to your Render server
      const res = await axios.post("https://lea-saad-f1-web.onrender.com/login", form);

      // Save user session to LocalStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setNotification({ message: "✅ Login Successful! Redirecting...", type: "success" });
      
      // Redirect to home or dashboard after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setNotification({ 
        message: err.response?.data?.message || "❌ Invalid email or password", 
        type: "danger" 
      });
    }
  };

  return (
    <div
      className="login-page"
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
        <h3 className="text-center mb-4 text-dark">Welcome Back</h3>

        {notification.message && (
          <div className={`alert alert-${notification.type}`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            Log In
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-dark">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}