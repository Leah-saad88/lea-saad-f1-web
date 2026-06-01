import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Teams from "./Pages/Teams";
import Standings from "./Pages/Results";
import Pitlaneshop from "./Pages/Pitlaneshop";
import Cart from "./Pages/Cart";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Teams" element={<Teams />} />
          <Route path="/Pitlaneshop/:type" element={<Pitlaneshop />} />
          <Route path="/Results/drivers" element={<Standings type="drivers" />} />
          <Route path="/Results/constructors" element={<Standings type="constructors" />} />
          <Route path="/Results/results" element={<Standings type="results" />} />
          <Route path="/Results/data analytics" element={<Standings type="data analytics" />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;