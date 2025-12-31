import Footer from './Components/Footer';
import Navbar from './Components/Navbar'; 
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Teams from './Pages/Teams';
import Standings from './Pages/Standings';
import Merch from './Pages/Merch';
import Cart from './Pages/Cart';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Address from './Pages/Address';
import { CartProvider } from './context/CartContext';
function App() {
  return (
   <div>
      <CartProvider>
    <Router>
    <Navbar />
    <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/Teams" element={ <Teams/>} />
             <Route path="/Merch" element={ <Merch/>} />
            <Route path="/Standings" element={< Standings/>} />
            <Route path="/Cart" element={<Cart/>} />
            <Route path="/Signup" element={<Signup />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/Address" element={<Address />} />
          </Routes>
    <Footer />
    </Router>
    </CartProvider>
    </div>
    
  )
}

export default App;
