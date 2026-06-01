import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentStep = ({ finalTotal, formatPrice, onComplete, shippingData, cartItems }) => {
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔐 Generate transaction ID once
  const [transactionId] = useState(
    `F1-TX-${Math.random().toString(36).toUpperCase().slice(2, 10)}`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Retrieve the user from localStorage
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        toast.error("IDENTITY UNKNOWN: Please log in again.");
        setIsProcessing(false);
        return;
      }

      // 2. Map data EXACTLY as your server.js expects it
      const orderData = {
        user_id: user.id,  
        email: user?.email,           // Matches backend user_id
        transaction_id: transactionId, // Matches backend transaction_id
        total_amount: finalTotal,      // Matches backend total_amount
        payment_method: paymentMethod === "visa" ? "Credit Card" : paymentMethod.toUpperCase(),
        shippingData: {                // Matches backend shippingData object
          address: shippingData.address,
          city: shippingData.city,
          phone: shippingData.phone
        },
        cartItems: cartItems           // Matches backend cartItems array
      };

      // 3. Call the correct endpoint from your server.js
      const res = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderData
      );

      if (res.status === 200) {
        toast.success("TRANSACTION AUTHORIZED BY CENTRAL GATEWAY.");
        onComplete(transactionId);
      }

    } catch (err) {
      console.error("Sync Error:", err.response?.data || err.message);
      toast.error("CRITICAL ERROR: Financial synchronization failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-step-view">
      <h2 className="industrial-title">Financial Settlement</h2>

      {/* Industrial Summary Header */}
      <div className="industrial-secure" style={{ padding: '15px', marginBottom: '20px', borderLeft: '3px solid #ff0000' }}>
        <p style={{ fontSize: '0.7rem', color: '#666', margin: 0 }}>DISPATCH TOTAL</p>
        <h3 style={{ margin: '5px 0', color: '#fff' }}>{formatPrice(finalTotal)}</h3>
        <p style={{ fontSize: '0.65rem', color: '#ff0000' }}>GATEWAY ID: {transactionId}</p>
      </div>

      <form className="industrial-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label>AUTHORIZED PAYMENT CHANNEL</label>
          <div className="method-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button 
              type="button"
              className={`method-btn ${paymentMethod === 'visa' ? 'active' : ''}`}
              onClick={() => setPaymentMethod("visa")}
              style={methodStyle(paymentMethod === 'visa')}
            >
              VISA / MC
            </button>
            <button 
              type="button"
              className={`method-btn ${paymentMethod === 'omt' ? 'active' : ''}`}
              onClick={() => setPaymentMethod("omt")}
              style={methodStyle(paymentMethod === 'omt')}
            >
              OMT / WHISH
            </button>
            <button 
              type="button"
              className={`method-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
              onClick={() => setPaymentMethod("bank")}
              style={methodStyle(paymentMethod === 'bank')}
            >
              BANK
            </button>
          </div>
        </div>

        {paymentMethod === "visa" ? (
          <div className="industrial-form-grid">
            <div className="field-group">
              <label>CARDHOLDER IDENTITY</label>
              <input type="text" placeholder={shippingData.fullName.toUpperCase()} required />
            </div>
            <div className="field-group">
              <label>ENCRYPTED CARD NUMBER</label>
              <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
            </div>
            <div className="input-row" style={{ display: 'flex', gap: '10px' }}>
              <div className="field-group" style={{ flex: 1 }}>
                <label>VALID THRU</label>
                <input type="text" placeholder="MM/YY" required />
              </div>
              <div className="field-group" style={{ flex: 1 }}>
                <label>SEC CODE</label>
                <input type="password" placeholder="***" required />
              </div>
            </div>
          </div>
        ) : (
          <div className="instruction-box" style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px dashed #444', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>
              Instructions for <strong>{paymentMethod.toUpperCase()}</strong> settlement will be issued upon authorization.
            </p>
          </div>
        )}

        <div className="step-footer-actions" style={{ marginTop: '25px' }}>
          <button 
            type="submit" 
            className={`industrial-submit-btn ${isProcessing ? 'loading' : ''}`} 
            disabled={isProcessing}
          >
            {isProcessing ? "SYNCHRONIZING..." : `AUTHORIZE ${formatPrice(finalTotal)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper style for the method buttons to keep CSS in one place
const methodStyle = (isActive) => ({
  padding: '12px',
  background: isActive ? 'rgba(255, 0, 0, 0.2)' : '#111',
  color: isActive ? '#fff' : '#666',
  border: isActive ? '1px solid #ff0000' : '1px solid #333',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.75rem',
  transition: '0.3s'
});

export default PaymentStep;