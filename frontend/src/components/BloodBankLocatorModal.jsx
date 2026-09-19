import React, { useState } from "react";

const BLOOD_BANKS_DATA = [
  {
    id: 1,
    name: "Aster Medcity Blood Centre",
    distance: "3.2 km",
    distanceNum: 3.2,
    area: "Cheranalloor, South Chittoor, Kochi",
    phone: "+91 484 6699999",
    type: "24/7 Super Specialty Blood Bank",
    stockStatus: "High (All Groups Available)",
    hasApheresis: true,
    isGovt: false,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Amrita Hospital Blood Centre",
    distance: "6.8 km",
    distanceNum: 6.8,
    area: "AIMS Ponekkara, Edappally, Kochi",
    phone: "+91 484 2851234",
    type: "NABH Accredited Transfusion Medicine Centre",
    stockStatus: "Normal (O+, A+, B+ Available)",
    hasApheresis: true,
    isGovt: false,
    rating: 4.9,
  },
  {
    id: 3,
    name: "General Hospital Blood Bank",
    distance: "8.4 km",
    distanceNum: 8.4,
    area: "Hospital Road, Marine Drive, Ernakulam",
    phone: "+91 484 2361251",
    type: "District Government Blood Bank",
    stockStatus: "Urgent O- Needed",
    hasApheresis: false,
    isGovt: true,
    rating: 4.6,
  },
  {
    id: 4,
    name: "Medical Trust Hospital Blood Bank",
    distance: "9.1 km",
    distanceNum: 9.1,
    area: "MG Road, Pallimukku, Ernakulam",
    phone: "+91 484 2358001",
    type: "24/7 Emergency Blood Bank & Apheresis",
    stockStatus: "Normal (O+, B+, AB+ In Stock)",
    hasApheresis: true,
    isGovt: false,
    rating: 4.7,
  },
  {
    id: 5,
    name: "Sunrise Hospital Transfusion Unit",
    distance: "11.2 km",
    distanceNum: 11.2,
    area: "Seaport-Airport Road, Thrikkakara, Kakkanad",
    phone: "+91 484 2428920",
    type: "24/7 Emergency Blood Unit",
    stockStatus: "Critical (A-, O- Low)",
    hasApheresis: false,
    isGovt: false,
    rating: 4.5,
  },
  {
    id: 6,
    name: "Rajagiri Hospital Blood Centre",
    distance: "14.5 km",
    distanceNum: 14.5,
    area: "Near Aluva, Chunangamvely, Ernakulam",
    phone: "+91 484 2905000",
    type: "Advanced Component Separation Unit",
    stockStatus: "Sufficient (All Groups)",
    hasApheresis: true,
    isGovt: false,
    rating: 4.8,
  },
];

export function BloodBankLocatorModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  if (!isOpen) return null;

  const filteredBanks = BLOOD_BANKS_DATA.filter((bank) => {
    const matchesSearch =
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.area.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === "govt") return bank.isGovt;
    if (filterType === "apheresis") return bank.hasApheresis;
    return true;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container blood-banks-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="eyebrow">FACILITIES & CENTRES</span>
            <h2>Find Blood Banks</h2>
            <p className="modal-subtitle">
              Locate certified hospital blood banks and storage facilities near you.
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Emergency SOS hotline pill */}
        <div className="emergency-hotline-banner">
          <span className="sos-badge">🚨 EMERGENCY HOTLINE</span>
          <span>
            Need urgent, immediate blood component reservation? Call Central Blood Helpline:{" "}
            <strong>104 / 1910</strong> (National Blood Helpline)
          </span>
        </div>

        {/* Search and Filters */}
        <div className="bank-filter-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by hospital name or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-chips">
            <button
              type="button"
              className={`chip ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              All Centres ({BLOOD_BANKS_DATA.length})
            </button>
            <button
              type="button"
              className={`chip ${filterType === "apheresis" ? "active" : ""}`}
              onClick={() => setFilterType("apheresis")}
            >
              Apheresis / Platelets
            </button>
            <button
              type="button"
              className={`chip ${filterType === "govt" ? "active" : ""}`}
              onClick={() => setFilterType("govt")}
            >
              Government
            </button>
          </div>
        </div>

        {/* List of Nearby Blood Banks */}
        <div className="nearby-banks-heading">
          <h3>📍 Nearby Blood Banks</h3>
          <span>Sorted by proximity</span>
        </div>

        <div className="banks-scroll-list">
          {filteredBanks.map((bank) => (
            <div className="blood-bank-card" key={bank.id}>
              <div className="bank-main-info">
                <div className="bank-name-row">
                  <h4 className="bank-title">{bank.name}</h4>
                  <span className="bank-dist-tag">{bank.distance}</span>
                </div>

                <p className="bank-area-text">📍 {bank.area}</p>
                <div className="bank-badges-row">
                  <span className="bank-type-pill">{bank.type}</span>
                  <span className="bank-stock-pill">● {bank.stockStatus}</span>
                  {bank.hasApheresis && (
                    <span className="bank-apheresis-pill">
                      ✓ Platelet Apheresis Available
                    </span>
                  )}
                </div>
              </div>

              <div className="bank-action-col">
                <a
                  href={`tel:${bank.phone.replace(/\s+/g, "")}`}
                  className="btn-call-bank"
                >
                  📞 Call Centre
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    bank.name + " " + bank.area
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-map-dir"
                >
                  🗺️ Get Directions
                </a>
              </div>
            </div>
          ))}

          {filteredBanks.length === 0 && (
            <div className="no-banks-found">
              <p>No blood banks matched your search criteria.</p>
              <button
                type="button"
                className="btn-outline-sm"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer-note">
          <span>
            ℹ️ Blood bank stock counts refresh hourly through state and hospital reporting protocols.
          </span>
        </div>
      </div>
    </div>
  );
}

export default BloodBankLocatorModal;
