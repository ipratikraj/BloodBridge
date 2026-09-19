import React from "react";

export function AdminAnalyticsView({ analyticsData = null, onSwitchToRequests }) {
  const data = analyticsData || {
    kpis: {
      donors: 248,
      requests: 137,
      matches: 89,
      fulfilled: 62,
    },
    blood_group_distribution: {
      "O+": 94,
      "B+": 64,
      "A+": 45,
      "O-": 20,
      "AB+": 15,
      Others: 10,
    },
    requests_by_status: {
      pending: 24,
      matched: 31,
      fulfilled: 62,
      cancelled: 7,
    },
    emergency_requests: {
      today: 7,
      this_week: 28,
      this_month: 94,
    },
  };

  const { donors, requests, matches, fulfilled } = data.kpis;

  // Calculate percentages for distribution bars
  const totalDonorsInDist = Object.values(data.blood_group_distribution).reduce(
    (a, b) => a + b,
    0
  );

  const bloodGroupColors = {
    "O+": "#dc2626",
    "B+": "#0284c7",
    "A+": "#059669",
    "O-": "#d97706",
    "AB+": "#7c3aed",
    Others: "#64748b",
  };

  return (
    <div className="admin-analytics-container">
      {/* Top 4 KPI Boxes */}
      <div className="admin-kpi-4grid">
        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <span className="kpi-tag">TOTAL DONORS</span>
            <span className="kpi-icon-small">🩸</span>
          </div>
          <div className="admin-kpi-number">{donors}</div>
          <div className="admin-kpi-footer">
            <span className="trend-pos">↑ +14%</span> vs last month
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <span className="kpi-tag">TOTAL REQUESTS</span>
            <span className="kpi-icon-small">📋</span>
          </div>
          <div className="admin-kpi-number">{requests}</div>
          <div className="admin-kpi-footer">
            <span className="trend-pos">↑ +8%</span> this week
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <span className="kpi-tag">TOTAL MATCHES</span>
            <span className="kpi-icon-small">⚡</span>
          </div>
          <div className="admin-kpi-number">{matches}</div>
          <div className="admin-kpi-footer">
            <span className="trend-neutral">65%</span> algorithmic match rate
          </div>
        </div>

        <div className="admin-kpi-box">
          <div className="admin-kpi-top">
            <span className="kpi-tag">FULFILLED</span>
            <span className="kpi-icon-small">✅</span>
          </div>
          <div className="admin-kpi-number">{fulfilled}</div>
          <div className="admin-kpi-footer">
            <span className="trend-pos">94%</span> completion success
          </div>
        </div>
      </div>

      {/* Main Analytics Rows */}
      <div className="admin-analytics-split">
        {/* Left Column: Blood Group Distribution Bar Chart */}
        <div className="admin-chart-card">
          <div className="chart-header">
            <div>
              <h4>Blood Group Distribution</h4>
              <p>Registered inventory across all compatible types</p>
            </div>
            <span className="chart-badge">248 Donors</span>
          </div>

          <div className="distribution-bars-list">
            {Object.entries(data.blood_group_distribution).map(
              ([group, count]) => {
                const percentage = Math.round(
                  (count / totalDonorsInDist) * 100
                );
                return (
                  <div className="dist-row" key={group}>
                    <div className="dist-label-col">
                      <strong className="dist-group-name">{group}</strong>
                      <span className="dist-count">{count} donors</span>
                    </div>

                    <div className="dist-bar-track">
                      <div
                        className="dist-bar-fill"
                        style={{
                          width: `${Math.max(6, percentage)}%`,
                          backgroundColor:
                            bloodGroupColors[group] || "#dc2626",
                        }}
                      />
                    </div>

                    <div className="dist-percent-col">
                      <span>{percentage}%</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Right Column: Requests by Status & Emergency Timeline */}
        <div className="admin-side-metrics">
          {/* Requests by Status */}
          <div className="admin-metric-card">
            <div className="chart-header">
              <h4>Requests by Status</h4>
              <span className="chart-sub">137 total logged</span>
            </div>

            <div className="status-stats-grid">
              <div className="status-stat-pill pill-pending">
                <span className="stat-name">Pending</span>
                <strong className="stat-val">
                  {data.requests_by_status.pending}
                </strong>
              </div>

              <div className="status-stat-pill pill-matched">
                <span className="stat-name">Matched</span>
                <strong className="stat-val">
                  {data.requests_by_status.matched}
                </strong>
              </div>

              <div className="status-stat-pill pill-fulfilled">
                <span className="stat-name">Fulfilled</span>
                <strong className="stat-val">
                  {data.requests_by_status.fulfilled}
                </strong>
              </div>

              <div className="status-stat-pill pill-cancelled">
                <span className="stat-name">Cancelled</span>
                <strong className="stat-val">
                  {data.requests_by_status.cancelled}
                </strong>
              </div>
            </div>
          </div>

          {/* Emergency Requests */}
          <div className="admin-metric-card">
            <div className="chart-header">
              <h4>Emergency Requests</h4>
              <span className="chart-sub-red">● High Priority Alerts</span>
            </div>

            <div className="emergency-timeline-row">
              <div className="em-box">
                <span className="em-label">Today</span>
                <strong className="em-number text-red">
                  {data.emergency_requests.today}
                </strong>
                <small className="em-note">Real-time</small>
              </div>

              <div className="em-box">
                <span className="em-label">This Week</span>
                <strong className="em-number text-amber">
                  {data.emergency_requests.this_week}
                </strong>
                <small className="em-note">7-day rolling</small>
              </div>

              <div className="em-box">
                <span className="em-label">This Month</span>
                <strong className="em-number text-dark">
                  {data.emergency_requests.this_month}
                </strong>
                <small className="em-note">30-day aggregate</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Row */}
      {onSwitchToRequests && (
        <div className="admin-table-cta-banner">
          <div>
            <strong>Need to review pending verifications?</strong>
            <p>Inspect clinical documentation and approve pending patient requests.</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={onSwitchToRequests}
          >
            Go to Request Management Table →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminAnalyticsView;
