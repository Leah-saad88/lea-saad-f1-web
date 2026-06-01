import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "../Assets/main.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [resaleRequests, setResaleRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🆕 REAL-TIME SYSTEM TELEMETRY CLOCK
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  // --- MASTER TELEMETRY RETRIEVAL ---
  const fetchData = async () => {
    try {
      const [ordersRes, resaleRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/orders"),
        axios.get("http://localhost:5000/api/admin/resale-requests"),
      ]);
      setOrders(ordersRes.data);
      setResaleRequests(resaleRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Telemetry Link Failure:", err);
      toast.error("CRITICAL ERROR: Telemetry Link Severed.");
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- AUDIT PROTOCOL HANDLER (Triggers Backend Emails) ---
  const handleAction = async (requestId, status, userEmail, serial) => {
    try {
      toast.info(`INITIATING AUDIT: ${status.toUpperCase()}...`);
      const res = await axios.post("http://localhost:5000/api/admin/resale/action", {
        requestId,
        status, // 'Approved' or 'Rejected'
        email: userEmail, // 🚨 CRITICAL: Sends to backend to trigger the Audit Email
        serial: serial,
      });

      if (res.data.success) {
        toast.success(`PROTOCOL COMPLETE: Asset ${status}.`);
        fetchData(); // Hot-reload the data grid
      }
    } catch (err) {
      toast.error("AUDIT FAILURE: Synchronization Error.");
    }
  };

  return (
    <div className="admin-page industrial-theme" style={{ padding: "40px", minHeight: "100vh", background: "#050505" }}>
      
      {/* --- ENHANCED SECURITY HEADER --- */}
      <div className="auth-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '30px' }}>
        <div>
          <span className="security-tag" style={{ background: '#e10600', color: '#000', padding: '2px 10px', fontWeight: 'bold', fontSize: '10px' }}>ADMIN ACCESS: LEVEL 4</span>
          <span className="protocol-id" style={{ marginLeft: '15px', color: '#888', letterSpacing: '2px' }}>COMMAND CENTER</span>
        </div>
        <div style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'right' }}>
          SYSTEM_TIME: {systemTime} | ENCRYPTION: AES-256-GCM
        </div>
      </div>

      <h1 style={{ color: "white", marginBottom: "30px", fontFamily: "F1-Regular", letterSpacing: '-1px' }}>
        Admin Command Center <span style={{ color: '#444', fontSize: '1rem' }}>v4.2.0</span>
      </h1>

      {loading ? (
        <div className="loader-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
            <div className="loader-ring"></div>
        </div>
      ) : (
        <div className="admin-content">
          
          {/* ==========================================
               SECTION 1: TICKET LIQUIDATION AUDITS
          ========================================== */}
          <div className="resale-audit-section" style={{ marginBottom: "60px" }}>
            <h2 style={{ color: "#e10600", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px", fontSize: '1.2rem' }}>
                TICKET LIQUIDATION AUDITS (RESALE GATEWAY)
            </h2>
            <table className="industrial-table" style={{ width: "100%", color: "white", background: "#0a0a0a", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#111", textAlign: "left", color: "#888", fontSize: '0.75rem' }}>
                  <th style={{ padding: "15px" }}>ASSET_SERIAL</th>
                  <th>SOURCE_ORDER</th>
                  <th>ACQUISITION_DATE</th>
                  <th>VISUAL_SCAN</th>
                  <th>ATTESTATION</th>
                  <th>AUDIT_ACTION</th>
                </tr>
              </thead>
              <tbody>
                {resaleRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <td style={{ padding: "15px", fontFamily: 'monospace', color: '#00ff41' }}>{req.serial_number}</td>
                    <td style={{ color: "#888" }}>#{req.order_id}</td>
                    <td>{new Date(req.purchase_date).toLocaleDateString()}</td>
                    <td>
                      <img
                        src={req.ticket_scan_path}
                        alt="Scan"
                        width="60"
                        style={{ cursor: "pointer", border: "1px solid #333", borderRadius: '2px' }}
                        onClick={() => window.open(req.ticket_scan_path)}
                      />
                    </td>
                    <td>
                      <img
                        src={req.signature_path}
                        alt="Signature"
                        width="80"
                        style={{ filter: "invert(1)", background: "#ddd", padding: "2px", borderRadius: '2px' }}
                      />
                    </td>
                    <td>
                      {req.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => handleAction(req.id, "Approved", req.user_email, req.serial_number)}
                            style={{ background: "#00ff41", border: "none", padding: "6px 12px", cursor: "pointer", fontWeight: "bold", color: "black", fontSize: '10px' }}
                          >
                            APPROVE
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "Rejected", req.user_email, req.serial_number)}
                            style={{ background: "#e10600", border: "none", padding: "6px 12px", cursor: "pointer", color: "white", fontWeight: "bold", fontSize: '10px' }}
                          >
                            REJECT
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: req.status === 'Approved' ? '#00ff41' : '#e10600', fontWeight: 'bold', fontSize: '11px' }}>
                            {req.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ==========================================
               SECTION 2: ORDER TELEMETRY (DEEP MAPPING)
          ========================================== */}
          <h2 style={{ color: "#e10600", borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px", fontSize: '1.2rem' }}>
            ORDER TELEMETRY GRID
          </h2>
          <div className="admin-orders-list">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="order-group-card industrial-secure"
                style={{ marginBottom: "30px", background: "#0a0a0a", borderLeft: "4px solid #e10600", border: '1px solid #1a1a1a' }}
              >
                {/* ORDER HEADER */}
                <div className="order-header" style={{ display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #1a1a1a", background: '#111' }}>
                  <div>
                    <strong style={{ color: "#e10600" }}>ORDER_ID: #{order.order_id}</strong>
                    <span style={{ marginLeft: "20px", color: "#666", fontSize: '0.8rem' }}>HASH: {order.transaction_id}</span>
                  </div>
                  <span style={{ color: "#00ff41", fontWeight: "bold", fontSize: '0.8rem' }}>{order.status.toUpperCase()}</span>
                </div>

                {/* ITEMS GRID */}
                <div className="order-items-table" style={{ padding: "15px" }}>
                  <table style={{ width: "100%", color: "white", textAlign: "left", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ color: "#444", fontSize: "0.7rem", borderBottom: "1px solid #1a1a1a" }}>
                        <th style={{ paddingBottom: "10px" }}>ASSET_DESCRIPTION</th>
                        <th>QTY</th>
                        <th>SPECS / TIER</th>
                        <th>PRICE</th>
                        <th>SOURCE_VISUAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #111" }}>
                          <td style={{ padding: "15px 0" }}>
                            <div style={{ fontWeight: "bold", fontSize: '0.9rem' }}>{item.name}</div>
                            {item.seat && (
                              <div style={{ color: "#e10600", fontSize: "0.75rem", marginTop: "4px", fontWeight: 'bold' }}>
                                SEAT_SECURED: <span style={{ color: "white" }}>{item.seat}</span>
                              </div>
                            )}
                          </td>
                          <td style={{ fontSize: '0.9rem' }}>{item.qty}</td>
                          <td style={{ textTransform: "uppercase", fontSize: '0.8rem', color: '#888' }}>{item.material}</td>
                          <td style={{ fontSize: '0.9rem' }}>${item.price}</td>
                          <td style={{ padding: "10px 0" }}>
                            {item.custom_img ? (
                              <img
                                src={item.custom_img}
                                alt="Custom"
                                style={{ width: "60px", height: "60px", objectFit: "cover", border: "1px solid #e10600", borderRadius: "2px", cursor: "pointer" }}
                                onClick={() => window.open(item.custom_img, "_blank")}
                              />
                            ) : (
                              <span style={{ color: "#333", fontSize: '10px' }}>OFFICIAL_ASSET</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FINAL SETTLEMENT */}
                <div className="order-footer" style={{ padding: "12px 15px", textAlign: "right", background: "#0a0a0a", borderTop: '1px solid #1a1a1a' }}>
                  <span style={{ color: "#444", marginRight: "10px", fontSize: '0.8rem' }}>TOTAL_SETTLEMENT:</span>
                  <strong style={{ fontSize: "1.2rem", color: '#fff' }}>${order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" theme="dark" hideProgressBar />
    </div>
  );
};

export default AdminDashboard;