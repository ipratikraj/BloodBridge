import React, { useState } from "react";

const BENEFITS = [
  {
    icon: "❤️",
    title: "Saves Up to 3 Lives per Unit",
    description:
      "A single donation of whole blood is fractionated into Packed Red Blood Cells (PRBCs), Platelets, and Fresh Frozen Plasma (FFP). Different patients with diverse conditions benefit from each component.",
    tag: "Life-Saving Impact",
  },
  {
    icon: "🩺",
    title: "Complimentary Health Screening",
    description:
      "Prior to donation, your pulse, blood pressure, body temperature, and hemoglobin levels are evaluated. This acts as a regular mini-checkup to identify potential underlying wellness flags.",
    tag: "Preventive Care",
  },
  {
    icon: "🫀",
    title: "Supports Cardiovascular Health",
    description:
      "Regular donation helps eliminate excessive stored iron (hemochromatosis prevention). Balanced iron levels are clinically associated with lower vascular oxidative stress and cardiovascular benefits.",
    tag: "Heart Health",
  },
  {
    icon: "⚡",
    title: "Stimulates Blood Cell Production",
    description:
      "When blood is drawn, your bone marrow is stimulated to synthesize new red blood cells (erythropoiesis), refreshing your circulatory system within weeks.",
    tag: "Cell Regeneration",
  },
  {
    icon: "🧠",
    title: "Psychological Well-being & 'Helper's High'",
    description:
      "Research shows that altruistic community service directly reduces stress levels, triggers endorphin and oxytocin release, and fosters profound social belonging.",
    tag: "Mental Well-being",
  },
  {
    icon: "🛡️",
    title: "Community Emergency Preparedness",
    description:
      "Blood cannot be synthesized artificially in a laboratory. Maintaining continuous, fresh regional shelf supplies ensures hospitals can respond to natural disasters and traffic traumas without delay.",
    tag: "Emergency Readiness",
  },
];

const MYTHS_AND_FACTS = [
  {
    myth: "Donating blood makes you physically weak and takes weeks to recover.",
    fact: "Your body replenishes blood fluid volume within 24 to 48 hours with adequate water and hydration. Most healthy donors resume normal daily activities within an hour after resting.",
  },
  {
    myth: "The process is painful, complicated, and takes hours.",
    fact: "The actual blood collection takes only 8 to 10 minutes. The initial needle insertion feels like a brief pinch, and the overall experience is supervised by trained phlebotomists.",
  },
  {
    myth: "You can contract infectious diseases or HIV by donating blood.",
    fact: "It is completely impossible. Every single needle, tube, and collection bag is 100% sterile, pre-packaged, single-use, and incinerated immediately after use.",
  },
  {
    myth: "I take daily allergy pills or high blood pressure medication, so I am banned.",
    fact: "Many chronic medications (including managed hypertension, cholesterol pills, or thyroid replacements) do NOT disqualify you, provided your readings are stable on donation day.",
  },
];

export function WhyDonateSection({ onCheckEligibility, onBecomeDonor }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeComponent, setActiveComponent] = useState("rbc");

  return (
    <section className="why-donate-section" id="why-donate">
      <div className="section-inner">
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="eyebrow red-eyebrow">HUMANITARIAN & MEDICAL SCIENCE</span>
          <h2 className="section-title">
            Why Donate Blood? <span className="title-highlight">Every Drop Matters</span>
          </h2>
          <p className="section-subtitle">
            Every two seconds, someone in India needs blood. Because blood cannot be manufactured in a laboratory, your voluntary donation is the only bridge between a critical patient and survival.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="benefits-cards-grid">
          {BENEFITS.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-top">
                <div className="benefit-icon-wrapper">{benefit.icon}</div>
                <span className="benefit-tag">{benefit.tag}</span>
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Blood Components Deep Dive */}
        <div className="components-interactive-card">
          <div className="comp-card-header">
            <h3>How One Donation Yields Three Therapies</h3>
            <p>
              When you give whole blood, high-speed centrifugation separates it into three distinct therapeutic components:
            </p>

            <div className="comp-tab-buttons">
              <button
                type="button"
                className={`comp-tab-btn ${activeComponent === "rbc" ? "active" : ""}`}
                onClick={() => setActiveComponent("rbc")}
              >
                🔴 Red Blood Cells (PRBC)
              </button>
              <button
                type="button"
                className={`comp-tab-btn ${activeComponent === "platelets" ? "active" : ""}`}
                onClick={() => setActiveComponent("platelets")}
              >
                🟡 Platelets (Thrombocytes)
              </button>
              <button
                type="button"
                className={`comp-tab-btn ${activeComponent === "plasma" ? "active" : ""}`}
                onClick={() => setActiveComponent("plasma")}
              >
                💧 Plasma & Cryoprecipitate
              </button>
            </div>
          </div>

          <div className="comp-tab-content">
            {activeComponent === "rbc" && (
              <div className="comp-detail-box rbc-box">
                <div className="comp-info-col">
                  <h4>Packed Red Blood Cells (PRBCs)</h4>
                  <span className="shelf-life">⏱️ Shelf life: Up to 42 days refrigerated (2°C – 6°C)</span>
                  <p>
                    Red blood cells contain hemoglobin, which transports oxygen from the lungs to every vital organ. They are indispensable for accident trauma, severe maternal hemorrhages, cardiac surgeries, and chronic anemia treatment.
                  </p>
                  <div className="typical-use">
                    <strong>Primary Recipients:</strong> Trauma casualties, orthopedic & cardiac surgery, thalassemia patients.
                  </div>
                </div>
              </div>
            )}

            {activeComponent === "platelets" && (
              <div className="comp-detail-box platelets-box">
                <div className="comp-info-col">
                  <h4>Platelet Concentrates</h4>
                  <span className="shelf-life">⏱️ Shelf life: 5 to 7 days with continuous agitation (20°C – 24°C)</span>
                  <p>
                    Platelets are tiny cell fragments that initiate blood clotting to halt severe hemorrhaging. Because platelets have a very short lifespan, hospitals depend on constant weekly donations to sustain cancer chemotherapy wards.
                  </p>
                  <div className="typical-use">
                    <strong>Primary Recipients:</strong> Leukemia & lymphoma patients, organ transplant recipients, dengue fever cases.
                  </div>
                </div>
              </div>
            )}

            {activeComponent === "plasma" && (
              <div className="comp-detail-box plasma-box">
                <div className="comp-info-col">
                  <h4>Fresh Frozen Plasma (FFP)</h4>
                  <span className="shelf-life">⏱️ Shelf life: Up to 1 year when stored frozen (-18°C or colder)</span>
                  <p>
                    Plasma is the liquid portion of blood composed of 90% water, albumin, antibodies, and coagulation factors. It expands blood volume and replaces essential clotting proteins in acute medical shock.
                  </p>
                  <div className="typical-use">
                    <strong>Primary Recipients:</strong> Severe burn victims, shock emergencies, liver disease, hemophilia.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Myths vs Facts Accordion */}
        <div className="myths-section">
          <div className="text-center myths-title-group">
            <span className="eyebrow">CLEARING COMMON MISCONCEPTIONS</span>
            <h3>Blood Donation: Myths vs. Facts</h3>
          </div>

          <div className="myths-accordion-list">
            {MYTHS_AND_FACTS.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  className={`myth-card ${isOpen ? "open" : ""}`}
                  key={idx}
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                >
                  <div className="myth-header">
                    <div className="myth-title-row">
                      <span className="myth-cross">❌ MYTH:</span>
                      <strong>"{item.myth}"</strong>
                    </div>
                    <span className="myth-toggle-icon">{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {isOpen && (
                    <div className="fact-content">
                      <span className="fact-tick">✅ MEDICAL FACT:</span>
                      <p>{item.fact}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="why-donate-cta-card">
          <div className="cta-content">
            <h3>Ready to Be Someone's Hero Today?</h3>
            <p>
              It takes less than 15 minutes of your time to save a mother, a child, or an accident victim.
            </p>
          </div>
          <div className="cta-buttons">
            {onCheckEligibility && (
              <button
                type="button"
                className="btn-outline-white"
                onClick={onCheckEligibility}
              >
                📋 Check Your Eligibility
              </button>
            )}
            {onBecomeDonor && (
              <button
                type="button"
                className="btn-primary-white"
                onClick={onBecomeDonor}
              >
                ❤️ Become a Donor Now
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyDonateSection;
