import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, increaseQty, decreaseQty } =
    useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!cartItems.length) return alert("Your cart is empty");
 
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    navigate("/login");
  };

  return (
    <div className="container py-5 mb-5">
      <h1 className="mb-5 text-center">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="fs-5">Your cart is empty 🛒</p>
         
          <button className="btn btn-dark" onClick={() => navigate("/Merch")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="row g-3">
              {cartItems.map((item) => (
                <div key={item.id} className="col-sm-6 col-md-4">
                  <div className="card h-auto shadow-sm">
                    <img
                      src={item.img}
                      className="card-img-top"
                      alt={item.name}
                      style={{ objectFit: "cover", height: "180px" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text fs-5 mb-2">${item.price}</p>
                      <div className="d-flex justify-content-center align-items-center mb-2">
                        <button
                          className="btn btn-outline-secondary btn-sm me-2"
                          onClick={() => decreaseQty(item.id)}
                        >
                          -
                        </button>
                        <span className="fw-bold mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary btn-sm ms-2"
                          onClick={() => increaseQty(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <hr />
              <button
                className="btn btn-dark w-100 mb-2"
                onClick={handleCheckout}
              >
                Checkout
              </button>
              <button
                className="btn btn-outline-danger w-100"
                onClick={clearCart}
              >
                Clear Cart
              </button>
             
              <button
                className="btn btn-dark"
                onClick={() => navigate("/Merch")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;