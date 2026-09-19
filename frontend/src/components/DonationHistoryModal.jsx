import React, { useState, useEffect } from "react";

const DEFAULT_HISTORY = [
  {
    id: 1,
    date: "12 Aug 2026",
    bloodGroup: "O+",
    centre: "Kochi Blood Bank",
    units: 1,
    status: "Completed",
    type: "Whole Blood",
  },
  {
    id: 2,
    date: "15 May 2026",
    bloodGroup: "O+",
    centre: "CMC Hospital",
    units: 1,
    status: "Completed",
    type: "Whole Blood",
  },
  {
    id: 3,
    date: "10 Jan 2026",
    bloodGroup: "O+",
    centre: "Aster Medcity Blood Centre",
    units: 1,
    status: "Completed",
    type: "Platelets (Apheresis)",
  },
  {
    id: 4,
    date: "05 Oct 2025",
    bloodGroup: "O+",
    centre: "Amrita Institute Blood Bank",
    units: 1,
    status: "Completed",
    type: "Whole Blood",
  },
  {
    id: 5,
    date: "14 Jun 2025",
    bloodGroup: "O+",
    centre: "General Hospital Ernakulam",
    units: 1,
    status: "Completed",
    type: "Whole Blood",
  },
  {
    id: 6,
    date: "18 Feb 2025",
    bloodGroup: "O+",
    centre: "Red Cross Emergency Camp",
    units: 1,
    status: "Completed",
    type: "Whole Blood",
  },
  {
    id: 7,
    date: "20 Nov 2024",
    bloodGroup: "O+",
    centre: "Sunrise Hospital",
    units: 1,
    status: "Completed",
    type: "Whole Blood",
  },
];

export function DonationHistoryModal({ isOpen, onClose, donorName = "Donor" }) {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("bloodbridge_donation_history");
      return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    centre: "",
    bloodGroup: "O+",
    type: "Whole Blood",
  });

  const [certificateDonor, setCertificateDonor] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("bloodbridge_donation_history", JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  if (!isOpen) return null;

  const totalDonations = history.length;
  const livesHelped = totalDonations * 3;
  const lastDonation = history[0]?.date || "12 Aug 2026";
  const nextEligibleDate = "10 Nov 2026";

  const handleAddDonation = (e) => {
    e.preventDefault();
    if (!newEntry.centre) return;

    const formattedDate = new Date(newEntry.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const entry = {
      id: Date.now(),
      date: formattedDate,
      bloodGroup: newEntry.bloodGroup,
      centre: newEntry.centre,
      units: 1,
      status: "Completed",
      type: newEntry.type,
    };

    setHistory([entry, ...history]);
    setShowAddForm(false);
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      centre: "",
      bloodGroup: "O+",
      type: "Whole Blood",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container donation-history-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="eyebrow">DONOR PROFILE</span>
            <h2>My Donations</h2>
            <p className="modal-subtitle">
              Verified records of your past life-saving blood donations.
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Top Highlight Metric Cards */}
        <div className="history-kpi-grid">
          <div className="kpi-card highlight-red">
            <span className="kpi-icon">🩸</span>
            <div className="kpi-data">
              <span className="kpi-num">{totalDonations}</span>
              <span className="kpi-label">Total Donations</span>
            </div>
          </div>

          <div className="kpi-card highlight-emerald">
            <span className="kpi-icon">❤️</span>
            <div className="kpi-data">
              <span className="kpi-num">{livesHelped}</span>
              <span className="kpi-label">Lives Potentially Helped</span>
            </div>
          </div>

          <div className="kpi-card highlight-blue">
            <span className="kpi-icon">🗓️</span>
            <div className="kpi-data">
              <span className="kpi-text">{lastDonation}</span>
              <span className="kpi-label">Last Donation</span>
            </div>
          </div>

          <div className="kpi-card highlight-amber">
            <span className="kpi-icon">⏳</span>
            <div className="kpi-data">
              <span className="kpi-text">{nextEligibleDate}</span>
              <span className="kpi-label">Next Eligible Date</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="history-actions-row">
          <h3 className="section-mini-heading">Donation History Timeline</h3>
          <button
            type="button"
            className="btn-outline-sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "+ Log Donation Record"}
          </button>
        </div>

        {/* Add Entry Form */}
        {showAddForm && (
          <form className="add-history-form" onSubmit={handleAddDonation}>
            <div className="form-row-grid">
              <div className="form-group">
                <label>Donation Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Blood Centre / Hospital</label>
                <input
                  type="text"
                  placeholder="e.g. Aster Medcity, Kochi"
                  value={newEntry.centre}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, centre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Blood Group</label>
                <select
                  value={newEntry.bloodGroup}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, bloodGroup: e.target.value })
                  }
                >
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Component Type</label>
                <select
                  value={newEntry.type}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, type: e.target.value })
                  }
                >
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Platelets (Apheresis)">Platelets</option>
                  <option value="Plasma">Plasma</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary-sm">
              Save to History
            </button>
          </form>
        )}

        {/* History List */}
        <div className="history-list-scroll">
          {history.map((item) => (
            <div className="history-item-card" key={item.id}>
              <div className="history-date-col">
                <span className="history-day">{item.date.split(" ")[0]}</span>
                <span className="history-month-year">
                  {item.date.split(" ").slice(1).join(" ")}
                </span>
              </div>

              <div className="history-blood-badge">
                <span>{item.bloodGroup}</span>
              </div>

              <div className="history-details-col">
                <strong className="history-centre-name">{item.centre}</strong>
                <span className="history-sub">
                  {item.type} · 1 Unit Transfusion Ready
                </span>
              </div>

              <div className="history-status-col">
                <span className="status-badge-pill completed">
                  ✓ {item.status}
                </span>
                <button
                  type="button"
                  className="cert-link-btn"
                  onClick={() => setCertificateDonor(item)}
                >
                  Certificate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Preview Modal */}
        {certificateDonor && (
          <div
            className="submodal-overlay"
            onClick={() => setCertificateDonor(null)}
          >
            <div
              className="certificate-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cert-border">
                <div className="cert-header">
                  <span className="cert-symbol">🩸</span>
                  <h3>BLOODBRIDGE RECOGNITION OF VALOR</h3>
                  <p>Certified Voluntary Blood Donor</p>
                </div>
                <div className="cert-body">
                  <p>This document honors and certifies that</p>
                  <h2 className="cert-recipient">{donorName || "Valued Lifesaver"}</h2>
                  <p>
                    has generously donated <strong>{certificateDonor.type} ({certificateDonor.bloodGroup})</strong> at{" "}
                    <strong>{certificateDonor.centre}</strong> on <strong>{certificateDonor.date}</strong>,
                    exemplifying selfless service and helping sustain critical hospital transfusion needs.
                  </p>
                </div>
                <div className="cert-footer">
                  <div className="cert-seal">
                    <span>SEAL OF HONOR</span>
                    <small>REF: BB-{certificateDonor.id}-VOL</small>
                  </div>
                  <button
                    type="button"
                    className="btn-outline-sm"
                    onClick={() => window.print()}
                  >
                    🖨️ Print Certificate
                  </button>
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={() => setCertificateDonor(null)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footnote */}
        <div className="modal-footer-note">
          <span>
            ℹ️ The National Blood Transfusion Council requires a minimum 90-day interval between whole blood donations.
          </span>
        </div>
      </div>
    </div>
  );
}

export default DonationHistoryModal;
