import {Link} from 'react-router-dom';
import '../Assets/navbar.css';
const Navbar = () => {
 return(
    <nav className='groupy'>
     <div className='links'>
        <Link to ="/">Home</Link>
        <Link to ="/Teams">Teams </Link>
        <Link to ="/Standings">Standings</Link>
        <Link to ="/Merch">Merch</Link>
        <Link to ="/Cart">Cart</Link>
         <Link to ="/signup">Contact us </Link>
        </div>
        
    </nav>

 )


}
export default Navbar;