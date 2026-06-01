import { Link } from "react-router-dom";
import "../Assets/navbar.css";
import { Assets } from "../Assets/assets";

const Navbar = () => {
  return (
    <nav className="groupy">
      <div className="logo">
        <img src={Assets.F11} alt="F11 Logo" />
      </div>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/Teams">Teams</Link>

        {/* ===== STANDINGS DROPDOWN ===== */}
        <div className="dropdown">
          <span className="dropdown-title">Standings</span>
          <div className="dropdown-menu">
            <Link to="/Results/drivers">Driver Standings</Link>
            <Link to="/Results/constructors">Constructor Championship</Link>
            <Link to="/Results/results">2025 Race Results</Link>
            <Link to="/Results/data analytics">data analytics</Link>
          </div>
        </div>
        {/* ===== END STANDINGS ===== */}

        {/* ===== PITLANE SHOP DROPDOWN ===== */}
        <div className="dropdown">
          <span className="dropdown-title">PitLane Shop</span>
          <div className="dropdown-menu">
            <Link to="/Pitlaneshop/merch">Merch</Link>
            <Link to="/Pitlaneshop/tickets">Tickets</Link>
          </div>
        </div>
        {/* ===== END PITLANE ===== */}

        <Link to="/Cart">Cart</Link>
        <Link to="/signup">Contact Us</Link>
         
      </div>

    </nav>
  );
};

export default Navbar;
