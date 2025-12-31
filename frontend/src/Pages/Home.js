import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Carousel from "react-bootstrap/Carousel";
import { Assets } from "../Assets/assets";
import "../Assets/main.css";

// ✅ Toastify imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const racerData = [
    {
      id: 1,
      name: "Verstappen",
      desc: "Red Bull Racing’s reigning champion. Can he defend his title?",
      img: Assets.Maxverstappen,
    },
    {
      id: 2,
      name: "Lando",
      desc: "McLaren’s rising star. Will 2025 be his breakout year?",
      img: Assets.Lando,
    },
    {
      id: 3,
      name: "Oscar",
      desc: "Young talent with serious pace. Could surprise everyone!",
      img: Assets.Oscar,
    },
  ];

  const handleVote = (name) => {
    toast.success(`🏁 Vote submitted for ${name}!`, {
      position: "top-right",
      autoClose: 2000,
      theme: "dark",
    });
  };

  return (
    <>
      <div>
        <img
          src={Assets.leahedited}
          alt="leah's collage"
          className="homeimg img-fluid"
        />
      </div>

      <div>
        <p className="text">
          🏎️ Formula 1 has become a Sunday tradition for many of us. With each
          race drawing more eyes and hearts, the season finale is fast
          approaching. Now it’s time to cast your vote who do you think will
          take the crown as World Champion?
        </p>
      </div>

      <div className="main">
        <div className="card-container">
          {racerData.map((value) => (
            <div className="card" key={value.id}>
              <img src={value.img} alt={value.name} />
              <h5>{value.name}</h5>
              <p>{value.desc}</p>
              <button
                className="vote-button"
                onClick={() => handleVote(value.name)}
              >
                Vote
              </button>
            </div>
          ))}
        </div>

        <p className="text">
          The three races left for the season with some memorable moments
        </p>

        <Carousel interval={1500} pause={false} controls indicators>
          <Carousel.Item>
            <img className="imgy" src={Assets.skysports} alt="Race 1" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="imgy" src={Assets.qatar} alt="Race 2" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="imgy" src={Assets.abudahbi} alt="Race 3" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="imgy" src={Assets.wiwi} alt="Race 4" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="imgy" src={Assets.b} alt="Race 5" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="imgy" src={Assets.d} alt="Race 6" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="imgy" src={Assets.f} alt="Race 7" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="imgy" src={Assets.c} alt="Race 8" />
          </Carousel.Item>
        </Carousel>
      </div>

      <p className="text">
        The Stats of the last race that occured in Brazil 🏁
      </p>

      <div className="responsive">
        <table className="table table-dark">
          <thead className="Table">
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>Team</th>
              <th>📷</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>🥇</th>
              <td>Lando Norris</td>
              <td>Mclaren</td>
              <td>
                <img src={Assets.Lando} alt="lando norris" width="50" />
              </td>
              <td>25</td>
            </tr>
            <tr>
              <th>🥈</th>
              <td>K. Antonelli</td>
              <td>Mercedes</td>
              <td>
                <img src={Assets.Kimi} alt="kimi" width="50" />
              </td>
              <td>18</td>
            </tr>
            <tr>
              <th>🥉</th>
              <td>Max Verstappen</td>
              <td>Redbull</td>
              <td>
                <img
                  src={Assets.Maxverstappen}
                  alt="max verstappen"
                  width="50"
                />
              </td>
              <td>15</td>
            </tr>
            <tr>
              <th>4</th>
              <td>George Russel</td>
              <td>Mercedes</td>
              <td>
                <img src={Assets.george} alt="george" width="50" />
              </td>
              <td>12</td>
            </tr>
            <tr>
              <th>5</th>
              <td>Oscar Piastri</td>
              <td>Mclaren</td>
              <td>
                <img src={Assets.Oscar} alt="oscar" width="50" />
              </td>
              <td>10</td>
            </tr>
            <tr>
              <th>6</th>
              <td>Olly Bearman</td>
              <td>Haas</td>
              <td>
                <img src={Assets.Olly} alt="olly" width="50" />
              </td>
              <td>8</td>
            </tr>
            <tr>
              <th>7</th>
              <td>Liam Lawson</td>
              <td>Racing Bulls</td>
              <td>
                <img src={Assets.liam} alt="liam" width="50" />
              </td>
              <td>6</td>
            </tr>
            <tr>
              <th>8</th>
              <td>I. Hadjar</td>
              <td>Racing Bulls</td>
              <td>
                <img src={Assets.isack} alt="isack" width="50" />
              </td>
              <td>4</td>
            </tr>
            <tr>
              <th>9</th>
              <td>N. Hulkenberg</td>
              <td>Sauber</td>
              <td>
                <img src={Assets.nick} alt="nick" width="50" />
              </td>
              <td>2</td>
            </tr>
            <tr>
              <th>10</th>
              <td>Pierre Gasly</td>
              <td>Alpine</td>
              <td>
                <img src={Assets.pierre} alt="pierre" width="50" />
              </td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>

    
      <ToastContainer />
    </>
  );
};

export default Home;

