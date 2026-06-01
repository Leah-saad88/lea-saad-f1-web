import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Assets } from "../Assets/assets";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Professional Step Components
import AuthStep from "./AuthStep";
import PaymentStep from "./PaymentStep";
import SuccessTracker from "./SuccessTracker";

import "react-toastify/dist/ReactToastify.css";
import "../Assets/cart.css"; 
import "../Assets/merch.css";

const Cart = () => {
  const context = useContext(CartContext);
  // Ensure safe access to user data and cart array elements
  const user = context?.user || null;
  const cart = context?.cart || context?.cartItems || [];
  const removeFromCart = context?.removeFromCart || (() => {});
  const updateQuantity = context?.updateQuantity || (() => {});
  const navigate = useNavigate();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("auth"); 
  const [orderReference, setOrderReference] = useState(""); 
  
  const [shippingData, setShippingData] = useState({
    fullName: "", address: "", city: "", country: "Lebanon", phone: "", zip: ""
  });

  const [trackingProgress, setTrackingProgress] = useState(0);

  // Financial Telemetry calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const handlingFee = cart.length > 0 ? 25 : 0; 
  const finalTotal = subtotal + handlingFee;

  const formatPrice = (p) => `$${(p || 0).toLocaleString()}`;
  const tempID = `F1-TX-${Math.random().toString(36).toUpperCase().slice(2, 10)}`;

  const hasTickets = cart.some(item => item.id.toString().includes('ticket'));
  const hasMerch = cart.some(item => !item.id.toString().includes('ticket'));

  // Success Animation Logic Progression
  useEffect(() => {
    if (checkoutStep === "success") {
      const interval = setInterval(() => {
        setTrackingProgress((prev) => (prev < 4 ? prev + 1 : prev));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [checkoutStep]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  // --- 🏁 THE CORE SETTLEMENT HANDLER ---
  const handlePaymentFinish = (dbOrderId) => {
    // Check for safe user session validation
    if (!user || !user.email) {
        toast.error("PROTOCOL BREACH: User identification lost. Re-authenticating...");
        setCheckoutStep("auth");
        return;
    }

    setOrderReference(dbOrderId); 
    setCheckoutStep("processing");
    
    // Simulate Central Gateway Sync Delay
    setTimeout(() => {
      setCheckoutStep("success");
      toast.success("CENTRAL GATEWAY: ORDER AUTHORIZED.");
      
      // Reset global cart states safely
      if (context.setCart) {
          context.setCart([]); 
      } else if (context.clearCart) {
          context.clearCart(); 
      }
      
      localStorage.removeItem("f1_cart_backup");
    }, 3000);
  };

  const resolveCartImage = (item) => {
    if (!item) return Assets.placeholder;
    const source = item.image_url || item.img || "";
    if (typeof source === 'string' && (source.startsWith('http') || source.startsWith('blob:') || source.startsWith('data:image'))) {
      return source;
    }
    return Assets[source] || Assets[source?.split('.')[0]] || Assets.placeholder;
  };

  return (
    <div className="cart-page industrial-theme">
      <div className="cart-header">
        <div className="auth-header">
          <span className="security-tag">SESSION: {user ? "ENCRYPTED" : "ANONYMOUS"}</span>
          <span className="protocol-id">USER: {user ? user.name.toUpperCase() : "GUEST"}</span>
        </div>
        <h1>Asset Review & Settlement</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items-section">
          {cart.length > 0 ? cart.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="item-image">
                <img src={resolveCartImage(item)} alt={item.name} />
              </div>
              <div className="item-info">
                <div className="item-main">
                  <h3>{item.name}</h3>
                  <p className="item-desc">{item.tierLabel ? `TIER: ${item.tierLabel}` : "VERIFIED ASSET"}</p>
                </div>
                <div className="item-controls">
                  {!item.id.toString().includes("ticket") ? (
                    <div className="qty-picker">
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>-</button>
                      <span>{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
                    </div>
                  ) : <div className="single-unit-tag">SEAT: {item.seatNumber}</div>}
                  <p className="item-subtotal">{formatPrice(item.price * (item.quantity || 1))}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>&times;</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="empty-cart-msg">
              <p>NO ASSETS DETECTED IN LOCAL CACHE.</p>
              <button className="industrial-submit-btn" onClick={() => navigate('/pitlane')}>RETURN TO MARKET</button>
            </div>
          )}
        </div>

        <div className="cart-summary-sidebar">
          <div className="summary-card industrial-secure">
            <h3>Settlement Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>Handling Fee</span><span>{formatPrice(handlingFee)}</span></div>
            <hr className="divider" />
            <div className="summary-row total-row"><span>Final Total</span><span>{formatPrice(finalTotal)}</span></div>
            <button className="industrial-submit-btn" onClick={() => setIsCheckoutOpen(true)} disabled={cart.length === 0}>
              INITIATE CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="modal-backdrop checkout-portal">
          <div className="checkout-container industrial-secure">
            {checkoutStep !== "processing" && (
                <button className="close-x" onClick={() => setIsCheckoutOpen(false)}>&times;</button>
            )}
            
            <div className="checkout-nav">
              {['auth', 'shipping', 'payment', 'success'].map((s, idx) => (
                <div key={s} className={`step ${checkoutStep === s || (checkoutStep === 'processing' && s === 'success') ? 'active' : ''}`}>
                  {idx + 1}. {s.toUpperCase()}
                </div>
              ))}
            </div>

            {checkoutStep === "auth" && <AuthStep onComplete={() => setCheckoutStep("shipping")} />}

            {checkoutStep === "shipping" && (
              <div className="checkout-step-view">
                <h2 className="industrial-title">Logistics Deployment</h2>
                <div className="industrial-form">
                  <div className="field-group">
                    <label>RECIPIENT FULL NAME</label>
                    <input name="fullName" placeholder="Name" value={shippingData.fullName} onChange={handleShippingChange} />
                  </div>
                  <div className="field-group">
                    <label>SHIPPING ADDRESS</label>
                    <input name="address" placeholder="Street" value={shippingData.address} onChange={handleShippingChange} />
                  </div>
                  <div className="input-row">
                    <div className="field-group"><label>CITY</label><input name="city" value={shippingData.city} onChange={handleShippingChange} /></div>
                    <div className="field-group"><label>ZIP</label><input name="zip" value={shippingData.zip} onChange={handleShippingChange} /></div>
                  </div>
                  <div className="field-group">
                    <label>TELEMETRY (PHONE)</label>
                    <input name="phone" placeholder="+961" value={shippingData.phone} onChange={handleShippingChange} />
                  </div>
                  <button className="industrial-submit-btn" onClick={() => (shippingData.fullName && shippingData.address) ? setCheckoutStep("payment") : toast.error("Logistics data missing.")}>
                    CONFIRM LOGISTICS
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === "payment" && (
              <PaymentStep 
                finalTotal={finalTotal} 
                formatPrice={formatPrice} 
                shippingData={shippingData} 
                cartItems={cart}
                userEmail={user?.email} 
                onComplete={handlePaymentFinish} 
              />
            )}

            {checkoutStep === "processing" && (
              <div className="checkout-loading">
                <div className="loader-ring"></div>
                <p>SYNCHRONIZING WITH CENTRAL GATEWAY...</p>
              </div>
            )}

            {checkoutStep === "success" && (
              <SuccessTracker 
                trackingProgress={trackingProgress}
                hasTickets={hasTickets}
                hasMerch={hasMerch}
                transactionID={orderReference || tempID}
                shippingData={shippingData}
              />
            )}
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default Cart;