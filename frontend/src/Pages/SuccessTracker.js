import React from "react";

const SuccessTracker = ({ 
  trackingProgress, 
  transitPercent, 
  hasTickets, 
  hasMerch, 
  transactionID, 
  shippingData, 
  setShowReceipt 
}) => {
  
  // Safety fallback for destination name (converts to uppercase for industrial aesthetic)
  const destination = shippingData?.city ? shippingData.city.toUpperCase() : "DESTINATION";

  return (
    <div className="checkout-success-view">
      <div className="success-header">
        <div className="success-icon-shield">✓</div>
        <h2>LIQUIDITY SETTLED</h2>
        {/* transactionID here is the actual ID returned from your SQL INSERT or the generated Hash */}
        <p className="protocol-text">ORDER REFERENCE: #{transactionID || "TEMP-SESSION"}</p>
      </div>

      <div className="order-tracking-terminal">
        {hasTickets && (
          <div className="fulfillment-track">
            <div className="track-label">
              <span className="tag blue">DIGITAL</span> TICKET DEPLOYMENT
            </div>
            <div className="tracking-timeline">
              <div className={`t-step ${trackingProgress >= 1 ? 'active' : ''}`}><span>VERIFIED</span></div>
              <div className={`t-line ${trackingProgress >= 2 ? 'filled' : ''}`}></div>
              <div className={`t-step ${trackingProgress >= 2 ? 'active' : ''}`}><span>MINTING</span></div>
              <div className={`t-line ${trackingProgress >= 3 ? 'filled' : ''}`}></div>
              <div className={`t-step ${trackingProgress >= 3 ? 'active' : ''}`}><span>INBOX</span></div>
            </div>
          </div>
        )}

        {hasMerch && (
          <div className="fulfillment-track">
            <div className="track-label">
              <span className="tag yellow">LOGISTICS</span> MERCH CHASE CAR
            </div>
            <div className="live-delivery-map">
              <div className="track-path">
                <div className="car-carrier" style={{ left: `${transitPercent}%` }}>
                  <div className="car-icon">🏎️</div>
                </div>
              </div>
              <div className="map-labels">
                <span>WAREHOUSE</span>
                <span className="blink">TRANSIT</span>
                <span>{destination}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="success-footer-actions">
        <button 
          className="industrial-submit-btn secondary" 
          onClick={() => setShowReceipt(true)}
        >
          VIEW OFFICIAL RECEIPT
        </button>
        <button 
          className="industrial-submit-btn" 
          onClick={() => window.location.href='/'}
        >
          RETURN TO HOME
        </button>
      </div>
    </div>
  );
};

export default SuccessTracker;