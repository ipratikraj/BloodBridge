import React from "react";

export function ImpactDashboardModal({ isOpen, onClose, donorStats = {} }) {
  if (!isOpen) return null;

  const donations = donorStats.donations || 7;
  const livesImpacted = donorStats.livesImpacted || donations * 3;
  const emergencyResponses = donorStats.emergencyResponses || 4;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container impact-dashboard-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header impact-header">
          <div className="impact-title-group">
            <span className="heart-badge-pulse">❤️</span>
            <div>
              <span className="eyebrow red-eyebrow">VOLUNTEER CONTRIBUTION</span>
              <h2>YOUR IMPACT</h2>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Hero Big 3 Stats */}
        <div className="impact-hero-grid">
          <div className="impact-hero-card card-donations">
            <div className="impact-icon-badge">🩸</div>
            <div className="impact-number">{donations}</div>
            <div className="impact-title">Donations</div>
            <div className="impact-caption">Total verified units given</div>
          </div>

          <div className="impact-hero-card card-lives">
            <div className="impact-icon-badge">❤️</div>
            <div className="impact-number">{livesImpacted}</div>
            <div className="impact-title">Lives Impacted*</div>
            <div className="impact-caption">Estimated patient recipients</div>
          </div>

          <div className="impact-hero-card card-emergency">
            <div className="impact-icon-badge">🚨</div>
            <div className="impact-number">{emergencyResponses}</div>
            <div className="impact-title">Emergency Responses</div>
            <div className="impact-caption">Urgent SOS calls answered</div>
          </div>
        </div>

        {/* Lifesaver Level & Milestone */}
        <div className="impact-tier-card">
          <div className="tier-badge-gold">
            <span>🏆 GOLD TIER LIFESAVER</span>
          </div>
          <div className="tier-info">
            <h4>You are in the top 5% of active community donors</h4>
            <p>
              Your selfless contributions have provided emergency stabilization for acute trauma patients and scheduled surgical procedures.
            </p>
            <div className="milestone-bar-container">
              <div className="milestone-label-row">
                <span>Progress to Platinum Hero (10 Donations)</span>
                <strong>{donations}/10</strong>
              </div>
              <div className="milestone-track">
                <div
                  className="milestone-fill"
                  style={{ width: `${Math.min(100, (donations / 10) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Component Transfusion Breakdown */}
        <div className="components-breakdown-section">
          <h3>How Your Blood Was Utilized (Component Breakdown)</h3>
          <div className="components-grid">
            <div className="component-card prbc">
              <div className="comp-icon">🔴</div>
              <strong>Packed Red Blood Cells</strong>
              <span className="comp-units">{donations} Units Transfused</span>
              <p>Critical for acute trauma, accident stabilization, and major surgeries.</p>
            </div>

            <div className="component-card platelets">
              <div className="comp-icon">🟡</div>
              <strong>Platelet Concentrates</strong>
              <span className="comp-units">{donations} Units Separated</span>
              <p>Crucial for leukemia patients undergoing aggressive chemotherapy.</p>
            </div>

            <div className="component-card plasma">
              <div className="comp-icon">💧</div>
              <strong>Fresh Frozen Plasma</strong>
              <span className="comp-units">{donations} Units Processed</span>
              <p>Essential for treating major burn trauma and severe clotting disorders.</p>
            </div>
          </div>
        </div>

        {/* Academic Methodology Callout */}
        <div className="methodology-banner">
          <div className="methodology-icon">🔬</div>
          <div className="methodology-text">
            <strong>*Methodology & Impact Estimation:</strong>
            <p>
              Every whole blood donation can potentially help multiple patients depending on how blood components are used. In standard hospital blood banking, 1 unit of whole blood is fractionated into red blood cells, platelets, and plasma—each serving separate clinical recipients. This number represents an academic impact estimate.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="impact-modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImpactDashboardModal;
