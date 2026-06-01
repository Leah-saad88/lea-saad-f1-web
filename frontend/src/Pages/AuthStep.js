import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthStep = ({ onComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false); // Controls the switch to OTP view
  const [serverOtp, setServerOtp] = useState(""); // Stores the OTP received from backend
  const [userOtp, setUserOtp] = useState(""); // Stores what the user types in
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      if (isLogin) {
        // --- 🚨 SECURITY PROTOCOL: OTP PHASE INITIATED 🚨 ---
        // The backend sends the OTP in the response body
        setServerOtp(res.data.otp.toString());
        
        // Temporarily store user data until verified
        localStorage.setItem("f1_user_temp", JSON.stringify(res.data.user)); 
        
        setShowOtpInput(true); // Switch the form to show the OTP input
        toast.info("TELEMETRY CODE DISPATCHED TO REGISTERED COMMS CHANNEL (EMAIL).");
      } else {
        toast.success("NEW PILOT REGISTERED. PROCEED TO AUTHENTICATION.");
        setIsLogin(true); // Move back to login view so they can sign in
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "SYSTEM_AUTH_ERROR: PROTOCOL BREACH");
    }
  };

  // --- 🆕 THE VERIFICATION HANDLER ---
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    
    if (userOtp === serverOtp) {
      // Success: Move temporary user to main storage
      const user = JSON.parse(localStorage.getItem("f1_user_temp"));
      localStorage.setItem("f1_user", JSON.stringify(user));
      localStorage.removeItem("f1_user_temp"); // Cleanup
      
      toast.success("IDENTITY VERIFIED. ACCESS GRANTED TO PITLANE.");
      onComplete(); // Triggers the next phase in your Cart/Checkout flow
    } else {
      toast.error("INVALID ACCESS CODE. RETRY VERIFICATION.");
    }
  };

  return (
    <div className="auth-step-view industrial-secure">
      <h2 className="industrial-title" style={{ color: showOtpInput ? "#00ff41" : "#fff" }}>
        {showOtpInput 
          ? "PROTOCOL: 2FA VERIFICATION" 
          : isLogin ? "PROTOCOL: IDENTITY VERIFICATION" : "PROTOCOL: NEW PILOT ENROLLMENT"}
      </h2>
      
      {!showOtpInput ? (
        /* --- STANDARD LOGIN / SIGNUP FORM --- */
        <form onSubmit={handleSubmit} className="industrial-form">
          {!isLogin && (
            <div className="field-group">
              <label>PILOT NAME</label>
              <input 
                name="name"
                placeholder="FULL NAME" 
                onChange={handleChange} 
                required 
              />
            </div>
          )}

          <div className="field-group">
            <label>COMMS CHANNEL (EMAIL)</label>
            <input 
              type="email" 
              name="email"
              placeholder="EMAIL@GATEWAY.COM" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="field-group">
            <label>SECURITY PASSPHRASE</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="industrial-submit-btn">
            {isLogin ? "AUTHORIZE ACCESS" : "REGISTER TO DATABASE"}
          </button>
        </form>
      ) : (
        /* --- 🚨 OTP VERIFICATION VIEW 🚨 --- */
        <form onSubmit={handleVerifyOtp} className="industrial-form">
          <div className="field-group" style={{ textAlign: "center" }}>
            <label style={{ color: "#888", marginBottom: "20px" }}>ENTER 6-DIGIT SECURITY CODE</label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="000000" 
              className="otp-input-large"
              style={{ 
                textAlign: 'center', 
                fontSize: '2.5rem', 
                letterSpacing: '15px', 
                background: '#0a0a0a', 
                color: '#00ff41',
                border: '1px solid #00ff41',
                width: '100%',
                padding: '15px'
              }}
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              autoFocus
              required 
            />
            <p style={{ color: "#444", fontSize: "10px", marginTop: "10px" }}>
              CHECK YOUR INBOX FOR TELEMETRY SYNC CODE
            </p>
          </div>
          
          <button type="submit" className="industrial-submit-btn" style={{ background: '#00ff41', color: 'black' }}>
            VERIFY IDENTITY
          </button>
          
          <p className="toggle-auth-mode" onClick={() => setShowOtpInput(false)} style={{ marginTop: "20px" }}>
            ← RETURN TO LOGIN TERMINAL
          </p>
        </form>
      )}

      {!showOtpInput && (
        <p className="toggle-auth-mode" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "NEW PILOT? REGISTER HERE" : "EXISTING PILOT? LOGIN"}
        </p>
      )}
    </div>
  );
};

export default AuthStep;