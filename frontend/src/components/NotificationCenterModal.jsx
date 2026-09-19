import React, { useState } from "react";

const INITIAL_NOTIFICATIONS = [
  {
    id: "n1",
    category: "Emergency",
    icon: "🚨",
    title: "Emergency Blood Request",
    message: "O+ needed urgently near Aster Medcity, Kochi for emergency trauma stabilization.",
    timeAgo: "5 minutes ago",
    unread: true,
    actionType: "view_request",
    priority: "critical",
  },
  {
    id: "n2",
    category: "Requests",
    icon: "🩸",
    title: "Donation Request",
    message: "Suresh Kumar needs 2 units of O+ blood at General Hospital Ernakulam.",
    timeAgo: "20 minutes ago",
    unread: true,
    actionType: "respond",
    priority: "high",
  },
  {
    id: "n3",
    category: "Requests",
    icon: "✅",
    title: "Request Accepted",
    message: "Amit Kumar accepted your blood request. Contact details have been unlocked.",
    timeAgo: "1 hour ago",
    unread: false,
    actionType: "view_contact",
    priority: "normal",
  },
  {
    id: "n4",
    category: "Emergency",
    icon: "🚨",
    title: "Emergency Blood Request",
    message: "B- negative blood required immediately at Amrita Hospital, Edappally.",
    timeAgo: "2 hours ago",
    unread: false,
    actionType: "view_request",
    priority: "critical",
  },
  {
    id: "n5",
    category: "System",
    icon: "ℹ️",
    title: "Profile Verified",
    message: "Your voluntary donor account has been verified by the BloodBridge administration.",
    timeAgo: "Yesterday",
    unread: false,
    actionType: "dismiss",
    priority: "normal",
  },
  {
    id: "n6",
    category: "System",
    icon: "🏆",
    title: "Impact Milestone Reached",
    message: "Congratulations! Your 7th donation helped 3 more patients. Thank you for your service.",
    timeAgo: "3 days ago",
    unread: false,
    actionType: "view_impact",
    priority: "normal",
  },
];

export function NotificationCenterModal({
  isOpen,
  onClose,
  onOpenDashboard,
  onOpenImpact,
}) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("All");

  if (!isOpen) return null;

  const filteredList = notifications.filter((item) => {
    if (activeTab === "All") return true;
    return item.category.toLowerCase() === activeTab.toLowerCase();
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleAction = (item) => {
    markAsRead(item.id);
    if (item.actionType === "view_contact" || item.actionType === "respond") {
      onClose();
      if (onOpenDashboard) onOpenDashboard();
    } else if (item.actionType === "view_impact") {
      onClose();
      if (onOpenImpact) onOpenImpact();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container notification-center-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="notif-header-title">
            <span className="eyebrow">ACTIVITY FEED</span>
            <div className="title-with-badge">
              <h2>Notifications</h2>
              {unreadCount > 0 && (
                <span className="unread-counter-badge">{unreadCount} new</span>
              )}
            </div>
          </div>

          <div className="notif-header-actions">
            {unreadCount > 0 && (
              <button
                type="button"
                className="btn-text-sm"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
            <button className="close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Category Tabs: All | Emergency | Requests | System */}
        <div className="notif-category-tabs">
          {["All", "Emergency", "Requests", "System"].map((cat) => {
            const count =
              cat === "All"
                ? notifications.length
                : notifications.filter((n) => n.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                className={`notif-tab ${activeTab === cat ? "active" : ""}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat === "Emergency" && "🚨 "}
                {cat === "Requests" && "🩸 "}
                {cat === "System" && "ℹ️ "}
                {cat}
                <span className="tab-pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* List of Notifications */}
        <div className="notif-scroll-list">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`notif-card ${item.unread ? "unread" : ""} ${
                item.priority === "critical" ? "critical-card" : ""
              }`}
              onClick={() => markAsRead(item.id)}
            >
              <div className="notif-icon-col">
                <span className="notif-large-icon">{item.icon}</span>
                {item.unread && <span className="unread-dot" />}
              </div>

              <div className="notif-body-col">
                <div className="notif-meta-row">
                  <span className="notif-title">{item.title}</span>
                  <span className="notif-time">{item.timeAgo}</span>
                </div>

                <p className="notif-msg">{item.message}</p>

                <div className="notif-action-row">
                  <span className={`notif-cat-tag cat-${item.category.toLowerCase()}`}>
                    {item.category}
                  </span>

                  {item.actionType === "view_contact" && (
                    <button
                      type="button"
                      className="notif-btn-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item);
                      }}
                    >
                      View Contact Details →
                    </button>
                  )}

                  {item.actionType === "respond" && (
                    <button
                      type="button"
                      className="notif-btn-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item);
                      }}
                    >
                      Respond in Dashboard →
                    </button>
                  )}

                  {item.actionType === "view_impact" && (
                    <button
                      type="button"
                      className="notif-btn-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(item);
                      }}
                    >
                      Open Impact Stats →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div className="notif-empty-state">
              <span className="empty-bell">🔔</span>
              <h4>No notifications in {activeTab}</h4>
              <p>You are all caught up with your updates.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer-note">
          <span>
            ● Live Push Notifications enabled for critical blood alerts within 50 km.
          </span>
        </div>
      </div>
    </div>
  );
}

export default NotificationCenterModal;
