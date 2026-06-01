import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Carousel from "react-bootstrap/Carousel";
import { Assets } from "../Assets/assets";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../Assets/main.css";

const Home = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2)); // March 2026

  const racerData = [
    { id: 1, name: "Verstappen", team: "Red Bull Racing", desc: "Defending Champion", img: Assets.Maxverstappen, color: "#0600EF" },
    { id: 2, name: "Lando", team: "McLaren", desc: "Rising Star", img: Assets.Lando, color: "#FF8700" },
    { id: 3, name: "Oscar", team: "McLaren", desc: "The Strategist", img: Assets.Oscar, color: "#FF8700" },
  ];

  const upcomingRaces = [
    { id: 1, name: "Las Vegas GP", location: "Las Vegas", startDate: new Date("2026-03-20"), endDate: new Date("2026-03-22") },
    { id: 2, name: "Monaco GP", location: "Monaco", startDate: new Date("2026-04-03"), endDate: new Date("2026-04-05") },
    { id: 3, name: "British GP", location: "Silverstone", startDate: new Date("2026-04-17"), endDate: new Date("2026-04-19") },
  ];

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const getRaceForDay = (day) => {
    const current = new Date(year, month, day);
    return upcomingRaces.find(r => current >= r.startDate && current <= r.endDate);
  };

  const handleVote = (name) => {
    toast.success(`🏁 VOTE RECORDED: ${name.toUpperCase()}`, { theme: "dark" });
  };

  return (
    <div className="home-wrapper">
      {/* ===== HERO SECTION ===== */}
      <div className="hero-container">
        <div className="hero-overlay">
          <h1 className="glitch-title">F1 SEASON 2026</h1>
          <p className="hero-sub">CHOOSE YOUR CHAMPION • TRACK THE CALENDAR</p>
        </div>
        <img src={Assets.leahedited} alt="F1 Collage" className="hero-img" />
      </div>

      <div className="container mt-5">
        {/* ===== RACER SELECTION GRID ===== */}
        <h2 className="section-title">SELECT YOUR DRIVER</h2>
        <div className="racer-grid">
          {racerData.map((racer) => (
            <div className="racer-card" key={racer.id} style={{ "--accent": racer.color }}>
              <div className="racer-img-wrapper">
                <img src={racer.img} alt={racer.name} />
              </div>
              <div className="racer-info">
                <span className="team-tag">{racer.team}</span>
                <h3>{racer.name}</h3>
                <p>{racer.desc}</p>
                <button className="gaming-btn" onClick={() => handleVote(racer.name)}>
                  CAST VOTE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== HIGHLIGHTS CAROUSEL ===== */}
        <div className="highlights-section my-5">
          <h2 className="section-title">SEASON HIGHLIGHTS</h2>
          <Carousel interval={2000} className="custom-carousel">
            {[Assets.skysports, Assets.qatar, Assets.abudahbi, Assets.wiwi].map((img, idx) => (
              <Carousel.Item key={idx}>
                <img className="d-block w-100 carousel-img" src={img} alt={`Slide ${idx}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* ===== BRAZIL STATS TABLE ===== */}
        <div className="stats-container">
          <h2 className="section-title">BRAZIL GP RESULTS 🏁</h2>
          <div className="table-responsive hud-table">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>POS</th>
                  <th>DRIVER</th>
                  <th>TEAM</th>
                  <th>POINTS</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>01</td><td>Lando Norris</td><td>McLaren</td><td>25</td></tr>
                <tr><td>02</td><td>K. Antonelli</td><td>Mercedes</td><td>18</td></tr>
                <tr><td>03</td><td>Max Verstappen</td><td>Red Bull</td><td>15</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== CALENDAR DASHBOARD ===== */}
        <div className="calendar-hud mt-5">
          <h2 className="section-title">RACE TELEMETRY</h2>
          <div className="calendar-header">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>PREV</button>
            <span className="month-display">{currentDate.toLocaleString("default", { month: "long" })} {year}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>NEXT</button>
          </div>
          <div className="calendar-grid-hud">
            {["S", "M", "T", "W", "T", "F", "S"].map(d => <div key={d} className="day-name">{d}</div>)}
            {calendarDays.map((day, i) => {
              const race = day ? getRaceForDay(day) : null;
              return (
                <div key={i} className={`day-cell ${race ? "race-active" : ""}`}>
                  {day}
                  {race && <span className="race-dot"></span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== AI CHAT WIDGET ===== */}
      <div className={`ai-widget ${chatOpen ? "open" : ""}`}>
        <div className="chat-tab" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? "✖ CLOSE" : "💬 ASKAi"}
        </div>
        {chatOpen && (
          <div className="chat-inner">
            <div className="chat-log">
              <p className="ai-msg">SYSTEM: Ready for input...</p>
            </div>
            <input type="text" placeholder="QUERY COMMAND..." className="chat-input-field" />
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Home;