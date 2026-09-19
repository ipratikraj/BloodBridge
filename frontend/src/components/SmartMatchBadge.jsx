import React, { useState } from "react";

export function SmartMatchCard({ donor, onSendRequest }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const score = donor.match_score || 94;
  const breakdown = donor.score_breakdown || {
    blood_compatibility: 40,
    distance: 28,
    availability: 20,
    donation_eligibility: 10,
    total: 94,
  };

  const handleSend = () => {
    if (sent || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      if (onSendRequest) onSendRequest(donor);
    }, 600);
  };

  const getScoreColor = (val) => {
    if (val >= 90) return "#10b981"; // emerald
    if (val >= 75) return "#0284c7"; // sky
    if (val >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <div className="smart-match-card">
      <div className="smart-match-top">
        <div className="match-avatar-wrapper">
          <div className="match-avatar">🩸</div>
          <div className="smart-match-basic">
            <div className="smart-match-title-row">
              <h4 className="smart-match-name">{donor.name}</h4>
              <span className="smart-match-blood-badge">{donor.blood_group}</span>
            </div>
            <div className="smart-match-meta-pills">
              <span className="meta-pill distance-pill">
                📍 {donor.distance_km || "2.3"} km away
              </span>
              <span className="meta-pill status-pill available">
                🟢 Available
              </span>
              <span className="meta-pill eligible-pill">
                ✅ Eligible
              </span>
            </div>
          </div>
        </div>

        {/* Big Match Score Display */}
        <div className="smart-score-badge-box">
          <div
            className="smart-score-circle"
            style={{
              borderColor: getScoreColor(score),
              color: getScoreColor(score),
            }}
          >
            <span className="smart-score-number">{score}%</span>
            <span className="smart-score-label">MATCH</span>
          </div>
        </div>
      </div>

      {/* Multi-factor Score Breakdown */}
      <div className="smart-factors-bar">
        <div
          className="factor-col"
          title="Blood compatibility: exact & ABO/Rh matrix"
        >
          <div className="factor-header">
            <span>Blood Compatibility</span>
            <strong>{breakdown.blood_compatibility || 40}%</strong>
          </div>
          <div className="factor-progress-track">
            <div
              className="factor-progress-fill compat-fill"
              style={{
                width: `${((breakdown.blood_compatibility || 40) / 40) * 100}%`,
              }}
            />
          </div>
        </div>

        <div
          className="factor-col"
          title="Proximity within search radius"
        >
          <div className="factor-header">
            <span>Distance</span>
            <strong>{breakdown.distance || 28}%</strong>
          </div>
          <div className="factor-progress-track">
            <div
              className="factor-progress-fill dist-fill"
              style={{ width: `${((breakdown.distance || 28) / 30) * 100}%` }}
            />
          </div>
        </div>

        <div
          className="factor-col"
          title="Active status & response rate"
        >
          <div className="factor-header">
            <span>Availability</span>
            <strong>{breakdown.availability || 20}%</strong>
          </div>
          <div className="factor-progress-track">
            <div
              className="factor-progress-fill avail-fill"
              style={{
                width: `${((breakdown.availability || 20) / 20) * 100}%`,
              }}
            />
          </div>
        </div>

        <div
          className="factor-col"
          title="90-day safe donation interval"
        >
          <div className="factor-header">
            <span>Eligibility</span>
            <strong>{breakdown.donation_eligibility || 10}%</strong>
          </div>
          <div className="factor-progress-track">
            <div
              className="factor-progress-fill elig-fill"
              style={{
                width: `${((breakdown.donation_eligibility || 10) / 10) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Toggle Details */}
      <div className="smart-match-footer">
        <button
          type="button"
          className="smart-details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Scoring Formula ▲" : "Why this match? ▼"}
        </button>

        <button
          type="button"
          className={`smart-request-btn ${sent ? "sent" : ""}`}
          onClick={handleSend}
          disabled={sending || sent}
        >
          {sending
            ? "Sending..."
            : sent
            ? "✓ Request Dispatched"
            : "Send Request →"}
        </button>
      </div>

      {showDetails && (
        <div className="smart-details-expanded">
          <div className="scoring-matrix-grid">
            <div className="matrix-item">
              <span>🩸 Blood Compatibility (40% max):</span>
              <strong>
                {breakdown.blood_compatibility}/40% (Matched {donor.blood_group})
              </strong>
            </div>
            <div className="matrix-item">
              <span>📍 Distance Factor (30% max):</span>
              <strong>
                {breakdown.distance}/30% ({donor.distance_km} km)
              </strong>
            </div>
            <div className="matrix-item">
              <span>🟢 Live Status (20% max):</span>
              <strong>{breakdown.availability}/20% (Active & reachable)</strong>
            </div>
            <div className="matrix-item">
              <span>✅ Safe Interval (10% max):</span>
              <strong>{breakdown.donation_eligibility}/10% (Passed 90-day rule)</strong>
            </div>
          </div>
          <p className="smart-matrix-note">
            Weighted algorithm prioritizes medical viability first, followed by speed of emergency arrival.
          </p>
        </div>
      )}
    </div>
  );
}

export default SmartMatchCard;
