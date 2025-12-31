import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Address = () => {
  const [address, setAddress] = useState("");
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;   // ✅ read user_id from localStorage

  const handlePlaceOrder = async () => {
    if (!address) return alert("Please enter your address");
    if (!cartItems.length) return alert("Cart is empty");
    if (!user_id) return alert("User not logged in");

    try {
      // Loop through cart items and send each one
      for (let item of cartItems) {
        const res = await fetch("http://localhost:5000/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,                // ✅ logged-in user ID
            item_name: item.name,
            item_image: item.img,
            quantity: item.quantity,
            address,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      }

      localStorage.removeItem("cartItems"); // clear cart
      setNotification("✅ Order placed successfully! Shipment will arrive in 2 days.");

      setTimeout(() => {
        navigate("/"); // back to home
      }, 2000);
    } catch (err) {
      alert("Failed to place order: " + err.message);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="mb-3 text-center">Enter Your Address</h3>

        {notification && <div className="alert alert-success">{notification}</div>}

        <textarea
          className="form-control mb-3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full address"
          rows={4}
        />

        <button className="btn btn-dark w-100" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Address;