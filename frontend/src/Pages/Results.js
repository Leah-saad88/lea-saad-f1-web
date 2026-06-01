import { motion, AnimatePresence } from "framer-motion";
import "../Assets/analytic.css";
import "../Assets/main.css";

// Import ChartJS and chart components
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register chart elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Results = ({ type }) => {
  const view = type || "drivers";

  const drivers = [
    { name: "Lando Norris", team: "McLaren", points: 408, color: "#FF8700" },
    { name: "Oscar Piastri", team: "McLaren", points: 378, color: "#FF8700" },
    { name: "Max Verstappen", team: "Red Bull", points: 366, color: "#1E41FF" },
    { name: "George Russell", team: "Mercedes", points: 291, color: "#00D2BE" },
    { name: "Charles Leclerc", team: "Ferrari", points: 222, color: "#DC0000" },
    { name: "Lewis Hamilton", team: "Ferrari", points: 149, color: "#DC0000" },
  ];

  const constructors = [
    { name: "McLaren", points: 786, color: "#FF8700" },
    { name: "Red Bull", points: 620, color: "#1E41FF" },
    { name: "Ferrari", points: 371, color: "#DC0000" },
    { name: "Mercedes", points: 423, color: "#00D2BE" },
  ];

  const results2025 = [
    {
      round: 1,
      date: "16 Mar 2025",
      gp: "Australian Grand Prix",
      circuit: "Albert Park (Melbourne)",
      winner: "Lando Norris",
      team: "McLaren",
    },
    {
      round: 2,
      date: "23 Mar 2025",
      gp: "Chinese Grand Prix",
      circuit: "Shanghai International Circuit",
      winner: "Oscar Piastri",
      team: "McLaren",
    },
    {
      round: 3,
      date: "06 Apr 2025",
      gp: "Japanese Grand Prix",
      circuit: "Suzuka Circuit",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
    {
      round: 4,
      date: "13 Apr 2025",
      gp: "Bahrain Grand Prix",
      circuit: "Bahrain International Circuit",
      winner: "Oscar Piastri",
      team: "McLaren",
    },
    {
      round: 5,
      date: "20 Apr 2025",
      gp: "Saudi Arabian Grand Prix",
      circuit: "Jeddah Corniche Circuit",
      winner: "Oscar Piastri",
      team: "McLaren",
    },
    {
      round: 6,
      date: "04 May 2025",
      gp: "Miami Grand Prix",
      circuit: "Miami International Autodrome",
      winner: "Oscar Piastri",
      team: "McLaren",
    },
    {
      round: 7,
      date: "18 May 2025",
      gp: "Emilia‑Romagna Grand Prix",
      circuit: "Autodromo Internazionale Enzo e Dino Ferrari (Imola)",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
    {
      round: 8,
      date: "25 May 2025",
      gp: "Monaco Grand Prix",
      circuit: "Circuit de Monaco",
      winner: "Lando Norris",
      team: "McLaren",
    },
    {
      round: 9,
      date: "01 Jun 2025",
      gp: "Spanish Grand Prix",
      circuit: "Circuit de Barcelona‑Catalunya",
      winner: "Oscar Piastri",
      team: "McLaren",
    },
    {
      round: 10,
      date: "15 Jun 2025",
      gp: "Canadian Grand Prix",
      circuit: "Circuit Gilles Villeneuve",
      winner: "George Russell",
      team: "Mercedes",
    },
    {
      round: 11,
      date: "29 Jun 2025",
      gp: "Austrian Grand Prix",
      circuit: "Red Bull Ring",
      winner: "Lando Norris",
      team: "McLaren",
    },
    {
      round: 12,
      date: "06 Jul 2025",
      gp: "British Grand Prix",
      circuit: "Silverstone Circuit",
      winner: "Lando Norris",
      team: "McLaren",
    },
    {
      round: 13,
      date: "27 Jul 2025",
      gp: "Belgian Grand Prix",
      circuit: "Circuit de Spa‑Francorchamps",
      winner: "Oscar Piastri",
      team: "McLaren",
    },
    {
      round: 14,
      date: "03 Aug 2025",
      gp: "Hungarian Grand Prix",
      circuit: "Hungaroring",
      winner: "Lando Norris",
      team: "McLaren",
    },
    {
      round: 15,
      date: "31 Aug 2025",
      gp: "Dutch Grand Prix",
      circuit: "Circuit Zandvoort",
      winner: "Oscar Piastri",
      team: "McLaren",
    },
    {
      round: 16,
      date: "07 Sep 2025",
      gp: "Italian Grand Prix",
      circuit: "Autodromo Nazionale Monza",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
    {
      round: 17,
      date: "21 Sep 2025",
      gp: "Azerbaijan Grand Prix",
      circuit: "Baku City Circuit",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
    {
      round: 18,
      date: "05 Oct 2025",
      gp: "Singapore Grand Prix",
      circuit: "Marina Bay Street Circuit",
      winner: "George Russell",
      team: "Mercedes",
    },
    {
      round: 19,
      date: "19 Oct 2025",
      gp: "United States Grand Prix",
      circuit: "Circuit of the Americas",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
    {
      round: 20,
      date: "26 Oct 2025",
      gp: "Mexico City Grand Prix",
      circuit: "Autódromo Hermanos Rodríguez",
      winner: "Lando Norris",
      team: "McLaren",
    },
    {
      round: 21,
      date: "09 Nov 2025",
      gp: "Brazilian Grand Prix",
      circuit: "Autódromo José Carlos Pace",
      winner: "Lando Norris",
      team: "McLaren",
    },
    {
      round: 22,
      date: "22 Nov 2025",
      gp: "Las Vegas Grand Prix",
      circuit: "Las Vegas Street Circuit",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
    {
      round: 23,
      date: "30 Nov 2025",
      gp: "Qatar Grand Prix",
      circuit: "Lusail International Circuit",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
    {
      round: 24,
      date: "07 Dec 2025",
      gp: "Abu Dhabi Grand Prix",
      circuit: "Yas Marina Circuit",
      winner: "Max Verstappen",
      team: "Red Bull Racing",
    },
  ];

  const carAnalytics2025 = [
    {
      team: "Red Bull",
      drivers: ["Max Verstappen", "Sergio Pérez"],
      wins: 12,
      podiums: 20,
      points: 650,
      avgFinish: 2.3,
      dnfs: 1,
      poles: 8,
      fastestLap: "1:08.500",
      tireData: [
        { race: "Australian GP", tireType: "Soft", lapTime: "1:22.100" },
        { race: "Monaco GP", tireType: "Medium", lapTime: "1:21.600" },
      ],
      mechanicalIssues: [{ race: "Monaco GP", issue: "Brake overheating" }],
      topSpeed: 355,
      aerodynamics: "Low Drag",
      enginePower: "1050 hp",
      color: "#1E41FF",
    },
    {
      team: "McLaren",
      drivers: ["Lando Norris", "Oscar Piastri"],
      wins: 8,
      podiums: 16,
      points: 540,
      avgFinish: 3.0,
      dnfs: 2,
      poles: 4,
      fastestLap: "1:09.000",
      tireData: [
        { race: "Chinese GP", tireType: "Medium", lapTime: "1:22.500" },
        { race: "Spanish GP", tireType: "Soft", lapTime: "1:21.900" },
      ],
      mechanicalIssues: [{ race: "Bahrain GP", issue: "Engine overheating" }],
      topSpeed: 350,
      aerodynamics: "High Downforce",
      enginePower: "1000 hp",
      color: "#FF8700",
    },
    {
      team: "Mercedes",
      drivers: ["Lewis Hamilton", "George Russell"],
      wins: 5,
      podiums: 14,
      points: 460,
      avgFinish: 3.2,
      dnfs: 1,
      poles: 5,
      fastestLap: "1:09.300",
      tireData: [
        { race: "British GP", tireType: "Hard", lapTime: "1:22.200" },
        { race: "Singapore GP", tireType: "Medium", lapTime: "1:20.900" },
      ],
      mechanicalIssues: [{ race: "Japan GP", issue: "Hydraulic issue" }],
      topSpeed: 348,
      aerodynamics: "Low Drag",
      enginePower: "1100 hp",
      color: "#00D2BE",
    },
    {
      team: "Ferrari",
      drivers: ["Charles Leclerc", "Carlos Sainz"],
      wins: 4,
      podiums: 12,
      points: 390,
      avgFinish: 4.0,
      dnfs: 2,
      poles: 6,
      fastestLap: "1:10.000",
      tireData: [
        { race: "Spanish GP", tireType: "Medium", lapTime: "1:23.500" },
        { race: "Belgian GP", tireType: "Soft", lapTime: "1:21.800" },
      ],
      mechanicalIssues: [{ race: "Canada GP", issue: "Gearbox failure" }],
      topSpeed: 345,
      aerodynamics: "Balanced Downforce",
      enginePower: "1020 hp",
      color: "#DC0000",
    },
    {
      team: "Aston Martin",
      drivers: ["Fernando Alonso", "Lance Stroll"],
      wins: 2,
      podiums: 8,
      points: 320,
      avgFinish: 4.5,
      dnfs: 3,
      poles: 2,
      fastestLap: "1:10.200",
      tireData: [
        { race: "Australian GP", tireType: "Hard", lapTime: "1:23.900" },
        { race: "Italian GP", tireType: "Medium", lapTime: "1:21.500" },
      ],
      mechanicalIssues: [{ race: "Monaco GP", issue: "Suspension failure" }],
      topSpeed: 340,
      aerodynamics: "Medium Downforce",
      enginePower: "960 hp",
      color: "#006F4F",
    },
    {
      team: "Alpine",
      drivers: ["Esteban Ocon", "Pierre Gasly"],
      wins: 0,
      podiums: 3,
      points: 180,
      avgFinish: 6.0,
      dnfs: 4,
      poles: 1,
      fastestLap: "1:12.300",
      tireData: [
        { race: "Monaco GP", tireType: "Soft", lapTime: "1:23.400" },
        { race: "Canada GP", tireType: "Hard", lapTime: "1:22.000" },
      ],
      mechanicalIssues: [{ race: "Hungary GP", issue: "Engine failure" }],
      topSpeed: 330,
      aerodynamics: "High Downforce",
      enginePower: "950 hp",
      color: "#1E5C6C",
    },
    {
      team: "Alfa Romeo",
      drivers: ["Valtteri Bottas", "Zhou Guanyu"],
      wins: 0,
      podiums: 1,
      points: 110,
      avgFinish: 7.0,
      dnfs: 5,
      poles: 0,
      fastestLap: "1:13.500",
      tireData: [
        { race: "Bahrain GP", tireType: "Medium", lapTime: "1:25.100" },
        { race: "Brazil GP", tireType: "Soft", lapTime: "1:22.900" },
      ],
      mechanicalIssues: [{ race: "Spain GP", issue: "Turbocharger failure" }],
      topSpeed: 328,
      aerodynamics: "Low Drag",
      enginePower: "910 hp",
      color: "#9B0000",
    },
    {
      team: "Williams",
      drivers: ["Alex Albon", "Logan Sargeant"],
      wins: 0,
      podiums: 0,
      points: 60,
      avgFinish: 10.0,
      dnfs: 8,
      poles: 0,
      fastestLap: "1:15.200",
      tireData: [
        { race: "Austria GP", tireType: "Medium", lapTime: "1:26.300" },
        { race: "British GP", tireType: "Hard", lapTime: "1:24.500" },
      ],
      mechanicalIssues: [{ race: "Italy GP", issue: "Fuel tank rupture" }],
      topSpeed: 320,
      aerodynamics: "High Downforce",
      enginePower: "880 hp",
      color: "#005A9C",
    },
  ];

  const maxDriverPoints = Math.max(...drivers.map((d) => d.points));
  const maxConstructorPoints = Math.max(...constructors.map((c) => c.points));

  return (
    <div className="container mt-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* DRIVER STANDINGS */}
          {view === "drivers" && (
            <div>
              <h2 className="text-center mb-4">
                2025 Driver Championship Standings 🏆
              </h2>
              {drivers.map((driver, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{driver.name}</strong>
                    <strong>{driver.points} pts</strong>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(driver.points / maxDriverPoints) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: index * 0.15 }}
                    style={{
                      backgroundColor: driver.color,
                      height: "30px",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* CONSTRUCTOR STANDINGS */}
          {view === "constructors" && (
            <div>
              <h2 className="text-center mb-4">
                2025 Constructor Championship 🏎️
              </h2>
              {constructors.map((team, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{team.name}</strong>
                    <strong>{team.points} pts</strong>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(team.points / maxConstructorPoints) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: index * 0.15 }}
                    style={{
                      backgroundColor: team.color,
                      height: "30px",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* RACE RESULTS */}
          {view === "results" && (
            <div className="race2025">
              <h2 className="text-center mb-4">2025 Race Winners 🏁</h2>
              <div className="race-list">
                {results2025.map((race, index) => (
                  <div key={index} className="race-item">
                    <div className="race-header">
                      <h5>{race.gp}</h5>
                      <small>{race.date}</small>
                    </div>
                    <p className="race-winner">
                      Winner: <strong>{race.winner}</strong> – Team: {race.team}
                    </p>
                    <small className="race-circuit">
                      Circuit: {race.circuit}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATA ANALYTICS WITH CHARTS */}
          {view === "data analytics" && (
            <div className="analytics-container">
              {carAnalytics2025.map((car, idx) => (
                <div
                  key={idx}
                  className="telemetry-card"
                  style={{ "--team-color": car.color }}
                >
                  <div className="telemetry-header">
                    <h4>{car.team}</h4>
                    <span>{car.drivers.join(", ")}</span>
                  </div>

                  {/* =================== */}
                  {/* Performance Charts */}
                  <div className="telemetry-section">
                    <h5>🏆 Performance Overview</h5>
                    <Bar
                      data={{
                        labels: ["Wins", "Podiums", "DNFs", "Poles"],
                        datasets: [
                          {
                            label: car.team,
                            data: [car.wins, car.podiums, car.dnfs, car.poles],
                            backgroundColor: [
                              car.color,
                              "#FFD700",
                              "#FF4136",
                              "#00ccff",
                            ],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, precision: 0 } },
                      }}
                    />
                  </div>

                  {/* =================== */}
                  {/* Tire Telemetry */}
                  <div className="telemetry-section">
                    <h5>🛞 Tire Lap Times</h5>
                    <Line
                      data={{
                        labels: car.tireData.map((t) => t.race),
                        datasets: [
                          {
                            label: "Lap Time (s)",
                            data: car.tireData.map((t) =>
                              parseFloat(t.lapTime.replace(":", "."))
                            ),
                            borderColor: car.color,
                            backgroundColor: car.color + "55",
                            tension: 0.3,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: false } },
                      }}
                    />
                  </div>

                  {/* =================== */}
                  {/* Mechanical Issues */}
                  <div className="telemetry-section">
                    <h5>🔧 Mechanical Issues</h5>
                    {car.mechanicalIssues.length > 0 ? (
                      car.mechanicalIssues.map((issue, i) => (
                        <p key={i}>
                          {issue.race}: {issue.issue}
                        </p>
                      ))
                    ) : (
                      <p>None</p>
                    )}
                  </div>

                  {/* =================== */}
                  {/* Engine & Aerodynamics */}
                  <div className="telemetry-section">
                    <h5>⚙️ Power Unit & Aero</h5>
                    <Doughnut
                      data={{
                        labels: ["Top Speed", "Engine Power (scaled)"],
                        datasets: [
                          {
                            data: [car.topSpeed, parseInt(car.enginePower)],
                            backgroundColor: [car.color, "#00ffcc"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: { legend: { position: "bottom" } },
                      }}
                    />
                    <p>Aerodynamics: {car.aerodynamics}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Results;