import React, { useContext, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Assets } from "../Assets/assets";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

// Components
import AuthStep from "./AuthStep"; 

// Styles
import "react-toastify/dist/ReactToastify.css";
import "../Assets/merch.css";
import "../Assets/main.css";

const Pitlaneshop = () => {
  // Pulling 'user' from context to handle the Auth Gatekeeper
  const { addToCart, user } = useContext(CartContext); 
  const { type } = useParams();
  const view = type || "merch";

  // UI States
  const [showResaleForm, setShowResaleForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeMapModal, setActiveMapModal] = useState(null);
  const [activeSeatModal, setActiveSeatModal] = useState(null);

  // Currency & Seating States
  const [currency, setCurrency] = useState({ code: "USD", symbol: "$", rate: 1 });
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [mockAvailability, setMockAvailability] = useState([]);
  
  // Data Lists
  const [merchItems, setMerchItems] = useState([]);
  const [ticketItems, setTicketItems] = useState([]);
  const [marketItems, setMarketItems] = useState([]);

  // Resale Form State
  const [resaleData, setResaleData] = useState({
    firstName: "",
    lastName: "",
    serial: "",
    orderId: "",
    purchaseDate: "", 
    payoutMethod: "OMT", 
    image: null,
    agreedToTerms: false
  });
  
  // Customization Studio States
  const [uploadedImage, setUploadedImage] = useState(null); 
  const [material, setMaterial] = useState("cotton");
  const materialPrices = { cotton: 30, polyester: 40, leather: 75, carbon_fiber: 120, premium_blend: 95 };

  const canvasRef = useRef(null);

  // --- OG STUDIO UPLOAD LOGIC ---
  const handleStudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- AUTH GATEKEEPER ---
  const toggleResaleForm = () => {
    if (!user) {
      toast.info("IDENTITY VERIFICATION REQUIRED: Initializing Auth Step...");
      setShowAuthModal(true); 
      return;
    }
    setShowResaleForm(!showResaleForm);
    if (canvasRef.current) setTimeout(() => clearSignature(), 100);
  };

  // --- TELEMETRY FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [merchRes, ticketRes, marketRes] = await Promise.all([
          axios.get("http://localhost:5000/api/merch"),
          axios.get("http://localhost:5000/api/tickets"),
          axios.get("http://localhost:5000/api/resale/market")
        ]);
        setMerchItems(merchRes.data || []);
        setTicketItems(ticketRes.data || []);
        setMarketItems(marketRes.data || []);
      } catch (err) {
        toast.error("Telemetry Link Failure.");
      }
    };
    fetchData();
  }, []);

  // --- SEAT PICKER LOGIC (UNIQUE ID FIX) ---
  const openSeatPicker = async (ticket, tier) => {
    setIsAnimating(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/seats/${ticket.id}/${tier.id}`);
      if (res.data?.length > 0) {
        setMockAvailability(res.data.map((s) => ({ 
          db_id: s.id, 
          id: s.seat_number, 
          isOccupied: s.is_occupied === 1 
        })));
        setSelectedSeat(null);
        setActiveSeatModal({ ...ticket, selectedTier: tier });
        setTimeout(() => setIsAnimating(false), 800);
      }
    } catch (err) {
      toast.error("Seating fetch failure.");
      setIsAnimating(false);
    }
  };

  const handleConfirmSeat = () => {
    const seatObject = mockAvailability.find(s => s.id === selectedSeat);
    if (!selectedSeat || !activeSeatModal || !seatObject) return;

    addToCart({
      ...activeSeatModal,
      id: `ticket-${seatObject.db_id}`, 
      db_id: seatObject.db_id, 
      name: `${activeSeatModal.name} (${selectedSeat})`,
      price: activeSeatModal.selectedTier.price,
      image_url: activeSeatModal.image_url,
      seatNumber: selectedSeat,
      tierLabel: activeSeatModal.selectedTier.label,
    });
    setActiveSeatModal(null);
    toast.success("Asset secured.");
  };

  // --- SIGNATURE DRAWING LOGIC ---
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.strokeStyle = "#e10600"; 
    ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvas.isDrawing = true;
  };
  const draw = (e) => {
    if (!canvasRef.current?.isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke();
  };
  const stopDrawing = () => { if (canvasRef.current) canvasRef.current.isDrawing = false; };
  const clearSignature = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // --- RESALE SUBMISSION ---
  const handleResaleSubmit = async (e) => {
    e.preventDefault();
    
    // 🚨 SAFETY GUARD: Check if user exists before reading .email
    if (!user || !user.email) {
      toast.error("IDENTITY ERROR: Please sign in to authorize liquidation.");
      setShowAuthModal(true);
      return;
    }

    const canvas = canvasRef.current;
    const signatureBase64 = canvas.toDataURL("image/png");
    const formData = new FormData();
    formData.append("serial", resaleData.serial);
    formData.append("orderId", resaleData.orderId);
    formData.append("purchaseDate", resaleData.purchaseDate); 
    formData.append("payoutMethod", resaleData.payoutMethod); 
    formData.append("signature", signatureBase64); 
    formData.append("image", resaleData.image);
    formData.append("sellerName", `${resaleData.firstName} ${resaleData.lastName}`);
    formData.append("email", user.email);

    try {
        toast.info("Synchronizing Telemetry...");
        const response = await axios.post("http://localhost:5000/api/resale/submit", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if(response.data.success) {
            toast.success("Liquidation Protocol Initiated.");
            setShowResaleForm(false);
        }
    } catch (err) { toast.error("Submission Failed."); }
  };

  const resolveAsset = (item) => {
    if (!item) return Assets.placeholder;
    const source = item.image_url || item.img || "";
    if (typeof source === "string" && source.startsWith("http")) return source;
    return Assets[source] || Assets[source?.split(".")[0]] || Assets.placeholder;
  };

  const formatPrice = (price) => `${currency.symbol}${(price * currency.rate).toLocaleString()}`;

  return (
    <div className={`pitlane-page industrial-theme ${isAnimating ? "view-transition" : ""}`}>
      <div className="shop-controls industrial-secure">
        <div className="currency-picker">
          {["USD", "EUR", "GBP"].map((code) => (
            <button key={code} className={currency.code === code ? "active" : ""} onClick={() => setCurrency({ code, symbol: code === "USD" ? "$" : code === "EUR" ? "€" : "£", rate: code === "USD" ? 1 : code === "EUR" ? 0.92 : 0.79 })}>{code}</button>
          ))}
        </div>
        {view === "tickets" && (
          <button className="resell-nav-btn industrial-btn" onClick={toggleResaleForm}>
            {showResaleForm ? "← BACK TO LIST" : "🎟️ ASSET LIQUIDATION (RESALE)"}
          </button>
        )}
      </div>

      {view === "merch" && (
        <div className="merch-view-wrapper">
          <div className="card-container merch-cards">
            {merchItems.map((v) => (
              <div className="card merch-card industrial-secure" key={v.id}>
                <div className="image-wrapper"><img src={resolveAsset(v)} alt={v.name} /></div>
                <h5>{v.name}</h5>
                <p className="price-tag">{formatPrice(v.price)}</p>
                <button onClick={() => addToCart(v)} className="buy-btn industrial-btn">Add to Cart</button>
              </div>
            ))}
          </div>

          {/* --- 🛠️ CUSTOMIZATION STUDIO --- */}
          <div className="customization-studio industrial-secure">
            <div className="studio-header"><h2>F1™ CUSTOMIZATION STUDIO</h2></div>
            <div className="studio-grid">
              <div className="preview-section">
                <label className="industrial-upload-box">
                  {uploadedImage ? <img src={uploadedImage} alt="Preview" className="live-preview-img" /> : <p>UPLOAD DESIGN SOURCE</p>}
                  <input type="file" onChange={handleStudioUpload} hidden />
                </label>
              </div>
              <div className="options-section">
                <div className="material-picker">
                  <div className="material-grid">
                    {Object.keys(materialPrices).map((m) => (
                      <div key={m} className={`material-card ${material === m ? "active" : ""}`} onClick={() => setMaterial(m)}>
                        <span>{m.replace("_", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="custom-add-btn industrial-btn-primary" onClick={() => {
                  if (!uploadedImage) return toast.warning("Upload design source.");
                  addToCart({ id: `custom-${Date.now()}`, name: `Custom ${material.toUpperCase()}`, image_url: uploadedImage, price: materialPrices[material], isCustom: true, material: material });
                  toast.success("Custom design authorized.");
                }}>FINALIZE BUILD</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "tickets" && (
        <div className="tickets-display-area">
          {!showResaleForm ? (
            <div className="tickets-section">
               <h2 className="tickets-title industrial-title">Official F1™ 2026 World Championship Calendar</h2>
               {ticketItems.map((ticket) => (
                 <div key={ticket.id} className="ticket-row-wrapper industrial-secure">
                   <div className="ticket-row">
                      <div className="ticket-image" style={{ position: "relative" }}>
                        <img src={resolveAsset(ticket)} alt={ticket.name} />
                        <div className="map-overlay-btn" onClick={() => setActiveMapModal(ticket)} style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#e10600', color: '#fff', padding: '5px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px', border: '1px solid #000' }}>
                          CIRCUIT OVERLAY MAP
                        </div>
                      </div>
                      <div className="ticket-info"><h3>{ticket.name}</h3><p>📍 {ticket.circuit}</p></div>
                      
                      {/* 🏁 MINI-SCROLLER TIER OPTIONS (VIP, GENERAL, ETC) 🏁 */}
                      <div className="hover-panel" style={{ display: 'flex', overflowX: 'auto', gap: '15px', paddingBottom: '10px', scrollSnapType: 'x mandatory', width: '30%' }}>
                        {ticket.tiers?.map(t => (
                          <div key={t.id} className="tier-option" style={{ minWidth: '100px', flexShrink: 0, scrollSnapAlign: 'start' }}>
                            <span>{t.label} - {formatPrice(t.price)}</span>
                            <button onClick={() => openSeatPicker(ticket, t)} className="tier-buy-btn" style={{ marginTop: '5px' }}>SELECT</button>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="resale-portal-wrapper">
              <div className="resale-container industrial-secure">
                <div className="auth-header"><span>PROTOCOL: F1-RESALE-v4.2 | LOGGED AS: {user?.name.toUpperCase()}</span></div>
                <form className="resale-form-industrial" onSubmit={handleResaleSubmit}>
                  <div className="industrial-grid">
                    <div className="audit-section">
                      <label className="industrial-upload-box">
                        {resaleData.image ? <img src={URL.createObjectURL(resaleData.image)} alt="Scan" /> : <p>UPLOAD TICKET SCAN</p>}
                        <input type="file" required onChange={(e) => setResaleData({ ...resaleData, image: e.target.files[0] })} hidden />
                      </label>
                    </div>
                    <div className="data-section">
                      <div className="input-group-row">
                        <div className="field-group"><label>FIRST NAME</label><input type="text" required value={resaleData.firstName} onChange={(e) => setResaleData({ ...resaleData, firstName: e.target.value })} /></div>
                        <div className="field-group"><label>LAST NAME</label><input type="text" required value={resaleData.lastName} onChange={(e) => setResaleData({ ...resaleData, lastName: e.target.value })} /></div>
                      </div>
                      <div className="input-group-row">
                        <div className="field-group"><label>PRIMARY SERIAL</label><input type="text" placeholder="F1-XXXX" required value={resaleData.serial} onChange={(e) => setResaleData({ ...resaleData, serial: e.target.value.toUpperCase() })} /></div>
                        <div className="field-group"><label>ORDER ID</label><input type="text" placeholder="#TX-000" required value={resaleData.orderId} onChange={(e) => setResaleData({ ...resaleData, orderId: e.target.value.toUpperCase() })} /></div>
                      </div>
                      
                      <div className="input-group-row">
                        <div className="field-group">
                          <label>PURCHASE DATE</label>
                          <input type="date" required value={resaleData.purchaseDate} onChange={(e) => setResaleData({ ...resaleData, purchaseDate: e.target.value })} style={{background: "#000", color: "#fff"}} />
                        </div>
                        <div className="field-group">
                          <label>PAYOUT SETTLEMENT ROUTE (MINUS 10% COMMISSION)</label>
                          <select required value={resaleData.payoutMethod} onChange={(e) => setResaleData({...resaleData, payoutMethod: e.target.value})} style={{background: "#0a0a0a", color: "#fff", padding: "10px", border: "1px solid #333", height: "43px", borderRadius: "0px"}}>
                            <option value="OMT">OMT Global (Cash Pickup)</option>
                            <option value="BANK">Bank Wire Transfer (Local/Intl)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="industrial-signature-box">
                        <label>DIGITAL ATTESTATION (SIGNATURE)</label>
                        <canvas ref={canvasRef} width="450" height="100" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} style={{background: "#0a0a0a", border: "1px solid #333"}} />
                        <button type="button" onClick={clearSignature} className="clear-btn">RESET</button>
                      </div>

                      <div className="policy-checkbox-group" style={{margin: "15px 0", display: "flex", gap: "10px", alignItems: "flex-start"}}>
                        <input type="checkbox" id="policy" checked={resaleData.agreedToTerms} onChange={(e) => setResaleData({...resaleData, agreedToTerms: e.target.checked})} style={{accentColor: "#e10600"}} />
                        <label htmlFor="policy" style={{fontSize: "12px", color: "#888"}}>
                          I agree to the <strong>Asset Liquidation Terms</strong>. I authorize a 10% gateway commission deduction upon successful secondary marketplace sale.
                        </label>
                      </div>

                      <button type="submit" className="industrial-submit-btn">AUTHORIZE LIQUIDATION</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- AUTH REDIRECT MODAL --- */}
      {showAuthModal && (
        <div className="modal-backdrop">
          <div className="auth-portal-container industrial-secure">
            <button className="close-x" onClick={() => setShowAuthModal(false)}>&times;</button>
            <h2 className="industrial-title" style={{textAlign: "center"}}>SECURE ACCESS REQUIRED</h2>
            <AuthStep onComplete={() => {
              setShowAuthModal(false);
              setShowResaleForm(true);
              toast.success("ID Verified. Gateway Open.");
            }} />
          </div>
        </div>
      )}

      {/* --- CIRCUIT MAP DATA OVERLAY MODAL --- */}
      {activeMapModal && (
        <div className="modal-backdrop">
          <div className="auth-portal-container industrial-secure" style={{ maxWidth: '600px' }}>
            <button className="close-x" onClick={() => setActiveMapModal(null)}>&times;</button>
            <h2 className="industrial-title" style={{ textAlign: "center", textTransform: "uppercase" }}>{activeMapModal.name} Telemetry Map</h2>
            <div style={{ border: "1px solid #333", padding: "10px", background: "#0a0a0a" }}>
              <img src={resolveAsset({ image_url: activeMapModal.mapImg })} alt={`${activeMapModal.name} Circuit Layout`} style={{ width: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
      )}

      {/* --- SEAT MODAL --- */}
      {activeSeatModal && (
        <div className="modal-backdrop">
          <div className="seat-modal industrial-secure animated-3d-view">
            <button className="close-x" onClick={() => setActiveSeatModal(null)}>&times;</button>
            <div className="seating-grid 3d-layout">
              {mockAvailability.map((s) => (
                <div 
                  key={s.db_id} 
                  className={`seat seat-3d ${s.isOccupied ? "occupied" : "available"} ${selectedSeat === s.id ? "selected" : ""}`} 
                  onClick={() => !s.isOccupied && setSelectedSeat(s.id)}
                >
                   <div className="seat-top"></div>
                   <div className="seat-label">{s.id}</div>
                </div>
              ))}
            </div>
            <button onClick={handleConfirmSeat} disabled={!selectedSeat} className="confirm-btn industrial-btn-primary">CONFIRM ASSET SELECTION</button>
          </div>
        </div>
      )}
      
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default Pitlaneshop;