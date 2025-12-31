import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../Assets/main.css";

const drivers = [
  { name: "Lando Norris", team: "McLaren", points: 408, color: "#FF8700" },
  { name: "Oscar Piastri", team: "McLaren", points: 378, color: "#FF8700" },
  { name: "Max Verstappen", team: "Red Bull", points: 366, color: "#1E41FF" },
  { name: "George Russell", team: "Mercedes", points: 291, color: "#00D2BE" },
  { name: "Charles Leclerc", team: "Ferrari", points: 222, color: "#DC0000" },
  { name: "Lewis Hamilton", team: "Ferrari", points: 149, color: "#DC0000" },
  { name: "Kimi", team: "Mercedes", points: 132, color: "#00D2BE" },
  { name: "Alex Albon", team: "william", points: 132, color: "#141071ff" },
  { name: "isack", team: "racing bulls", points: 132, color: "#4f4e61ff" },
  { name: "Nick hulkenberg", team: "sauber", points: 132, color: "#00b41bff" },
];

const Standings = () => {
  const maxPoints = Math.max(...drivers.map((d) => d.points));

  return (
    <div className="standings-container">
      <h2 className="text">Driver's Championship Standings 🏆</h2>
      {drivers.map((driver, index) => (
        <div key={index} className="driver-row">
          <span
            className="driver-name"
            style={{ fontWeight: "bold", fontSize: "1.1rem" }}
          >
            {driver.name}
          </span>
          <motion.div
            className="driver-bar"
            initial={{ width: 0 }}
            animate={{ width: `${(driver.points / maxPoints) * 100}%` }}
            transition={{ duration: 1, delay: index * 0.2 }}
            style={{ backgroundColor: driver.color }}
          >
            <span
              className="points"
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {driver.points}
            </span>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default Standings;
