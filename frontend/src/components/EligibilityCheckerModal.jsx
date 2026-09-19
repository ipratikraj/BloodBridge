import React, { useState } from "react";

export function EligibilityCheckerModal({ isOpen, onClose, onBecomeDonor }) {
  const [formData, setFormData] = useState({
    age: "22",
    weight: "68",
    lastDonation: "2026-05-01",
    neverDonated: false,
    currentlySick: "no",
    takingMedication: "no",
    recentSurgery: "no",
    pregnant: "na",
  });

  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setResult(null); // reset result when changing inputs
  };

  const checkEligibility = (e) => {
    e.preventDefault();

    const ageNum = parseInt(formData.age, 10);
    const weightNum = parseFloat(formData.weight);
    const issues = [];

    // Age check
    if (isNaN(ageNum) || ageNum < 18) {
      issues.push("Donors must be at least 18 years of age (standard legal requirement).");
    } else if (ageNum > 65) {
      issues.push("First-time or routine donors over 65 require special medical evaluation.");
    }

    // Weight check
    if (isNaN(weightNum) || weightNum < 50) {
      issues.push("Donors must weigh a minimum of 50 kg to donate whole blood safely.");
    }

    // Illness check
    if (formData.currentlySick === "yes") {
      issues.push("Must be completely free of cold, flu, sore throat, or active fever for at least 7 days.");
    }

    // Medication check
    if (formData.takingMedication === "yes") {
      issues.push("Certain antibiotics, blood thinners, and systemic drugs require a temporary waiting period.");
    }

    // Surgery / Tattoo check
    if (formData.recentSurgery === "yes") {
      issues.push("A 6-month deferral period applies following major surgery, dental extractions, body piercings, or tattoos.");
    }

    // Pregnancy check
    if (formData.pregnant === "yes") {
      issues.push("Individuals who are currently pregnant or less than 6 months postpartum are temporarily deferred.");
    }

    // Last donation interval check
    if (!formData.neverDonated && formData.lastDonation) {
      const lastDate = new Date(formData.lastDonation);
      const today = new Date();
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays < 90 && diffDays >= 0) {
        const daysLeft = 90 - diffDays;
        issues.push(
          `Standard donation interval is 90 days. You have approximately ${daysLeft} day(s) remaining before your next eligible donation date.`
        );
      }
    }

    const isEligible = issues.length === 0;

    setResult({
      isEligible,
      issues,
      evaluatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container eligibility-checker-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="eyebrow">PRE-SCREENING QUESTIONNAIRE</span>
            <h2>DONOR ELIGIBILITY CHECK</h2>
            <p className="modal-subtitle">
              Verify standard medical criteria before heading to a donation centre.
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={checkEligibility} className="checker-form">
          <div className="checker-grid">
            {/* Age */}
            <div className="checker-field">
              <label>
                Age
                <span className="field-hint">(18 – 65 years)</span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  type="number"
                  min="16"
                  max="80"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                />
                <span className="unit-label">years</span>
              </div>
            </div>

            {/* Weight */}
            <div className="checker-field">
              <label>
                Weight
                <span className="field-hint">(Min 50 kg)</span>
              </label>
              <div className="input-unit-wrapper">
                <input
                  type="number"
                  min="35"
                  max="180"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  required
                />
                <span className="unit-label">kg</span>
              </div>
            </div>

            {/* Last Donation */}
            <div className="checker-field full-width">
              <div className="label-with-checkbox">
                <label>Last Donation Date</label>
                <label className="checkbox-sublabel">
                  <input
                    type="checkbox"
                    checked={formData.neverDonated}
                    onChange={(e) =>
                      handleInputChange("neverDonated", e.target.checked)
                    }
                  />
                  I am a first-time donor
                </label>
              </div>
              <input
                type="date"
                value={formData.lastDonation}
                disabled={formData.neverDonated}
                onChange={(e) =>
                  handleInputChange("lastDonation", e.target.value)
                }
              />
            </div>

            {/* Currently Sick */}
            <div className="checker-field">
              <label>Currently sick, flu, or fever?</label>
              <div className="toggle-pill-group">
                <button
                  type="button"
                  className={`toggle-pill ${formData.currentlySick === "no" ? "active" : ""}`}
                  onClick={() => handleInputChange("currentlySick", "no")}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`toggle-pill ${formData.currentlySick === "yes" ? "active red-active" : ""}`}
                  onClick={() => handleInputChange("currentlySick", "yes")}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Taking Medication */}
            <div className="checker-field">
              <label>Taking antibiotics / medication?</label>
              <div className="toggle-pill-group">
                <button
                  type="button"
                  className={`toggle-pill ${formData.takingMedication === "no" ? "active" : ""}`}
                  onClick={() => handleInputChange("takingMedication", "no")}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`toggle-pill ${formData.takingMedication === "yes" ? "active red-active" : ""}`}
                  onClick={() => handleInputChange("takingMedication", "yes")}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Surgery / Tattoo in last 6 months */}
            <div className="checker-field">
              <label>Surgery or tattoo in last 6 months?</label>
              <div className="toggle-pill-group">
                <button
                  type="button"
                  className={`toggle-pill ${formData.recentSurgery === "no" ? "active" : ""}`}
                  onClick={() => handleInputChange("recentSurgery", "no")}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`toggle-pill ${formData.recentSurgery === "yes" ? "active red-active" : ""}`}
                  onClick={() => handleInputChange("recentSurgery", "yes")}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* Pregnant */}
            <div className="checker-field">
              <label>Pregnant or breastfeeding?</label>
              <div className="toggle-pill-group">
                <button
                  type="button"
                  className={`toggle-pill ${formData.pregnant === "na" ? "active" : ""}`}
                  onClick={() => handleInputChange("pregnant", "na")}
                >
                  N/A
                </button>
                <button
                  type="button"
                  className={`toggle-pill ${formData.pregnant === "no" ? "active" : ""}`}
                  onClick={() => handleInputChange("pregnant", "no")}
                >
                  No
                </button>
                <button
                  type="button"
                  className={`toggle-pill ${formData.pregnant === "yes" ? "active red-active" : ""}`}
                  onClick={() => handleInputChange("pregnant", "yes")}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>

          <div className="checker-action-row">
            <button type="submit" className="btn-primary full-width-btn">
              CHECK ELIGIBILITY →
            </button>
          </div>
        </form>

        {/* Result Card */}
        {result && (
          <div
            className={`checker-result-card ${
              result.isEligible ? "result-eligible" : "result-deferred"
            }`}
          >
            <div className="result-header">
              <span className="result-icon">
                {result.isEligible ? "✅" : "⚠️"}
              </span>
              <div>
                <h4>
                  {result.isEligible
                    ? "You appear eligible based on the information provided."
                    : "You may be temporarily deferred from donating."}
                </h4>
                <span className="result-time">Evaluated at {result.evaluatedAt}</span>
              </div>
            </div>

            {result.isEligible ? (
              <div className="result-body">
                <p>
                  You meet the essential criteria for age, weight, and health status for voluntary whole blood donation.
                </p>
                {onBecomeDonor && (
                  <button
                    type="button"
                    className="btn-success-sm"
                    onClick={() => {
                      onClose();
                      onBecomeDonor();
                    }}
                  >
                    Proceed to Donor Registration →
                  </button>
                )}
              </div>
            ) : (
              <div className="result-body">
                <p className="deferral-intro">Please review the following observations:</p>
                <ul className="issues-list">
                  {result.issues.map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Medical Disclaimer */}
            <div className="medical-disclaimer-box">
              <strong>Medical Disclaimer:</strong>
              <p>
                Please confirm eligibility with a qualified medical professional or certified blood bank. Don't make your app claim medical eligibility definitively. Use it as a pre-screening questionnaire. Standard on-site hemoglobin and blood pressure testing is mandatory before every donation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EligibilityCheckerModal;
