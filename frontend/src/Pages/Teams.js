import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Assets } from "../Assets/assets";
import "../Assets/main.css";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const Teams = () => {
  const teamsData = [
    {
      id: 1,
      name: "McLaren",
      car: Assets.macy,
      driver1: {
        name: "Lando Norris",
        img: Assets.Lando,
        age: 25,
        nationality: "British",
        wins: 7,
        podiums: 18,
        points: 423,
        championships: 1,
      },
      driver2: {
        name: "Oscar Piastri",
        img: Assets.Oscar,
        age: 24,
        nationality: "Australian",
        wins: 7,
        podiums: 16,
        points: 410,
        championships: 0,
      },
    },
    {
      id: 2,
      name: "Red Bull",
      car: Assets.red,
      driver1: {
        name: "Max Verstappen",
        img: Assets.Maxverstappen,
        age: 26,
        nationality: "Dutch",
        wins: 8,
        podiums: 15,
        points: 421,
        championships: 4,
      },
      driver2: {
        name: "Yuki Tsunoda",
        img: Assets.yuki,
        age: 23,
        nationality: "Japanese",
        wins: 0,
        podiums: 0,
        points: 33,
        championships: 0,
      },
    },
    {
      id: 3,
      name: "Mercedes",
      car: Assets.mc,
      driver1: {
        name: "George Russell",
        img: Assets.george,
        age: 26,
        nationality: "British",
        wins: 2,
        podiums: 9,
        points: 319,
        championships: 0,
      },
      driver2: {
        name: "Kimi Antonelli",
        img: Assets.Kimi,
        age: 18,
        nationality: "Italian",
        wins: 0,
        podiums: 3,
        points: 150,
        championships: 0,
      },
    },
    {
      id: 4,
      name: "Ferrari",
      car: Assets.FE,
      driver1: {
        name: "Charles Leclerc",
        img: Assets.CHAR,
        age: 27,
        nationality: "Monegasque",
        wins: 0,
        podiums: 7,
        points: 242,
        championships: 0,
      },
      driver2: {
        name: "Lewis Hamilton",
        img: Assets.lewis,
        age: 38,
        nationality: "British",
        wins: 0,
        podiums: 0,
        points: 156,
        championships: 7,
      },
    },
    {
      id: 5,
      name: "Williams",
      car: Assets.willi,
      driver1: {
        name: "Alexander Albon",
        img: Assets.alex,
        age: 27,
        nationality: "Thai",
        wins: 0,
        podiums: 0,
        points: 73,
        championships: 0,
      },
      driver2: {
        name: "Carlos Sainz Jr.",
        img: Assets.Car,
        age: 28,
        nationality: "Spanish",
        wins: 0,
        podiums: 2,
        points: 64,
        championships: 0,
      },
    },
    {
      id: 6,
      name: "Aston Martin",
      car: Assets.astonmartin,
      driver1: {
        name: "Fernando Alonso",
        img: Assets.alonzo,
        age: 41,
        nationality: "Spanish",
        wins: 0,
        podiums: 0,
        points: 56,
        championships: 2,
      },
      driver2: {
        name: "Lance Stroll",
        img: Assets.stroll,
        age: 25,
        nationality: "Canadian",
        wins: 0,
        podiums: 3,
        points: 33,
        championships: 0,
      },
    },
    {
      id: 7,
      name: "Sauber",
      car: Assets.sauber,
      driver1: {
        name: "Nico Hülkenberg",
        img: Assets.nick,
        age: 35,
        nationality: "German",
        wins: 0,
        podiums: 0,
        points: 51,
        championships: 0,
      },
      driver2: {
        name: "Isack Hadjar",
        img: Assets.isack,
        age: 20,
        nationality: "French",
        wins: 0,
        podiums: 1,
        points: 51,
        championships: 0,
      },
    },
    {
      id: 8,
      name: "Haas",
      car: Assets.haasy,
      driver1: {
        name: "Oliver Bearman",
        img: Assets.Olly,
        age: 21,
        nationality: "British",
        wins: 0,
        podiums: 0,
        points: 41,
        championships: 0,
      },
      driver2: {
        name: "Esteban Ocon",
        img: Assets.ocon,
        age: 26,
        nationality: "French",
        wins: 0,
        podiums: 0,
        points: 38,
        championships: 0,
      },
    },
    {
      id: 9,
      name: "Racing Bulls",
      car: Assets.racingbulls,
      driver1: {
        name: "Liam Lawson",
        img: Assets.liam,
        age: 21,
        nationality: "New Zealander",
        wins: 0,
        podiums: 0,
        points: 38,
        championships: 0,
      },
      driver2: {
        name: "Gabriel Bortoleto",
        img: Assets.gab,
        age: 23,
        nationality: "Brazilian",
        wins: 0,
        podiums: 0,
        points: 19,
        championships: 0,
      },
    },
    {
      id: 10,
      name: "Alpine",
      car: Assets.alpine,
      driver1: {
        name: "Pierre Gasly",
        img: Assets.pierre,
        age: 27,
        nationality: "French",
        wins: 0,
        podiums: 0,
        points: 22,
        championships: 0,
      },
      driver2: {
        name: "Franco Colapinto",
        img: Assets.colapinto,
        age: 22,
        nationality: "Argentine",
        wins: 0,
        podiums: 0,
        points: 0,
        championships: 0,
      },
    },
  ];

  const allDrivers = teamsData.flatMap((team) => [
    team.driver1,
    team.driver2,
  ]);

  const [selectedDriver1, setSelectedDriver1] = useState(null);
  const [selectedDriver2, setSelectedDriver2] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const calculateDriverScore = (driver) =>
    (
      driver.points * 0.4 +
      driver.wins * 20 * 0.3 +
      driver.podiums * 10 * 0.2 +
      driver.championships * 50 * 0.1
    ).toFixed(1);

  const openCompareModal = () => {
    if (selectedDriver1 && selectedDriver2 && selectedDriver1 !== selectedDriver2)
      setShowCompareModal(true);
    else alert("Select two different drivers!");
  };

  const StatBar = ({ label, value, max, color }) => (
    <div className="stat-box">
      <span className="stat-label">{label}</span>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        ></div>
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );

  const driver1Score =
    selectedDriver1 && parseFloat(calculateDriverScore(selectedDriver1));
  const driver2Score =
    selectedDriver2 && parseFloat(calculateDriverScore(selectedDriver2));

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🏎️ Formula 1 Teams (2025)</h2>

      {/* SELECT DROPDOWNS */}
      <div className="text-center mb-4">
        <select
          className="form-select d-inline-block w-auto me-2"
          onChange={(e) =>
            setSelectedDriver1(
              e.target.value === "" ? null : allDrivers[e.target.value]
            )
          }
        >
          <option value="">Select Driver 1</option>
          {allDrivers.map((driver, idx) => (
            <option key={idx} value={idx}>
              {driver.name}
            </option>
          ))}
        </select>

        <select
          className="form-select d-inline-block w-auto me-2"
          onChange={(e) =>
            setSelectedDriver2(
              e.target.value === "" ? null : allDrivers[e.target.value]
            )
          }
        >
          <option value="">Select Driver 2</option>
          {allDrivers.map((driver, idx) => (
            <option key={idx} value={idx}>
              {driver.name}
            </option>
          ))}
        </select>

        <button className="btn btn-danger" onClick={openCompareModal}>
          Compare Drivers
        </button>
      </div>

      {/* ORIGINAL TABLE */}
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>Car</th>
              <th>Driver 1</th>
              <th>Driver 2</th>
            </tr>
          </thead>
          <tbody>
            {teamsData.map((team) => (
              <tr key={team.id}>
                <th>{team.id}</th>
                <td>{team.name}</td>
                <td>
                  <img src={team.car} alt="" width="120" />
                </td>
                <td>
                  <img src={team.driver1.img} alt="" width="40" />{" "}
                  {team.driver1.name}
                </td>
                <td>
                  <img src={team.driver2.img} alt="" width="40" />{" "}
                  {team.driver2.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal show={showCompareModal} onHide={() => setShowCompareModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Driver Comparison</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedDriver1 && selectedDriver2 && (
            <div className="d-flex justify-content-around text-center">
              <div className={`card-driver ${driver1Score > driver2Score ? "winner-card" : ""}`}>
                <img src={selectedDriver1.img} alt="" width="100" />
                <h5>{selectedDriver1.name}</h5>

                <StatBar label="Points" value={selectedDriver1.points} max={500} color="#ff0000"/>
                <StatBar label="Wins" value={selectedDriver1.wins} max={10} color="#ffcc00"/>
                <StatBar label="Podiums" value={selectedDriver1.podiums} max={20} color="#00ccff"/>
                <StatBar label="Championships" value={selectedDriver1.championships} max={10} color="#cc00ff"/>
                <StatBar label="Score" value={driver1Score} max={300} color="#00ff99"/>
              </div>

              <div className="vs-badge">VS</div>

              <div className={`card-driver ${driver2Score > driver1Score ? "winner-card" : ""}`}>
                <img src={selectedDriver2.img} alt="" width="100" />
                <h5>{selectedDriver2.name}</h5>

                <StatBar label="Points" value={selectedDriver2.points} max={500} color="#ff0000"/>
                <StatBar label="Wins" value={selectedDriver2.wins} max={10} color="#ffcc00"/>
                <StatBar label="Podiums" value={selectedDriver2.podiums} max={20} color="#00ccff"/>
                <StatBar label="Championships" value={selectedDriver2.championships} max={10} color="#cc00ff"/>
                <StatBar label="Score" value={driver2Score} max={300} color="#00ff99"/>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Teams;