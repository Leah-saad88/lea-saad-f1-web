import { Link } from 'react-router-dom';
import '../Assets/navbar.css';
import { Assets } from '../Assets/assets';

const Navbar = () => {
  return (
    <nav className="groupy">
      <div className="logo">
        <img src={Assets.F11} alt="F11 Logo" />
      </div>

      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/Teams">Teams</Link>
        <Link to="/Standings">Standings</Link>
        <Link to="/Merch">Merch</Link>
        <Link to="/Cart">Cart</Link>
        <Link to="/signup">Contact Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;

