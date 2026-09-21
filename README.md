# 🩸 BloodBridge

### Smart Blood Donor & Request Matching Platform

BloodBridge is a web-based blood donation and request management platform designed to connect **blood donors with people who need blood** through a structured, location-aware and eligibility-aware matching system.

The platform provides separate experiences for **Donors, Requesters and Administrators**, with features for donor management, blood requests, smart matching, notifications, donation history, donor impact, eligibility pre-screening and administrative analytics.

---

## 🌐 Live Demo

**Live Application:**
https://blood-bridge-pink.vercel.app/

**Backend API:**
https://bloodbridge-1-elsg.onrender.com

**GitHub Repository:**
https://github.com/ipratikraj/BloodBridge

---

## 📌 Problem Statement

Finding a suitable blood donor quickly can be difficult during medical emergencies.

Traditional approaches often depend on:

* Manual searching for donors
* Social media or messaging groups
* Unstructured donor information
* Limited location awareness
* Lack of donor eligibility information
* Difficulty tracking requests and responses
* Limited administrative visibility

BloodBridge aims to provide a centralized platform where blood requests can be created and suitable donors can be identified using multiple practical matching factors.

---

## 💡 Proposed Solution

BloodBridge brings donors, requesters and administrators into one platform.

A requester can create a blood request by providing information such as:

* Patient name
* Blood group
* Location
* Required units
* Request details

The system then evaluates available donor information and prioritizes suitable donors based on:

* Blood group compatibility
* Distance
* Donor availability
* Donation eligibility

This creates a more structured approach to donor discovery instead of relying only on manual searching.

---

# ✨ Key Features

## 👤 User Authentication

BloodBridge provides authentication and role-based access for different types of users.

### Donor

* Register an account
* Log in securely
* Maintain donor information
* View matching requests
* View donation history
* View personal impact information

### Requester

* Register an account
* Log in securely
* Create blood requests
* View suitable donors
* Send donor requests
* Track request status

### Administrator

* Secure admin access
* Monitor platform activity
* View analytics
* Manage users
* Monitor requests
* Review system information

---

## 🧠 Smart Blood Matching

One of the core features of BloodBridge is its **multi-factor smart matching system**.

Instead of relying only on blood group, the system evaluates multiple factors to prioritize suitable donors.

### Match Score

| Matching Factor        |   Weight |
| ---------------------- | -------: |
| 🩸 Blood Compatibility |  **40%** |
| 📍 Distance            |  **30%** |
| 🟢 Availability        |  **20%** |
| ✅ Donation Eligibility |  **10%** |
| **Total**              | **100%** |

The matching interface can provide information such as:

* Donor name
* Blood group
* Distance
* Availability
* Eligibility
* Match score
* Request action

### Donation Interval

The matching logic also considers donor eligibility based on the donation interval.

A **90-day donation interval rule** is implemented to prevent donors from being treated as eligible when their previous donation was too recent.

> **Note:** BloodBridge's current smart matching system is a rule-based scoring system. It is not presented as a machine-learning accuracy model.

---

# 🩸 Blood Donor Management

Donors can provide information required for matching and can participate in the donor-request workflow.

The system is designed to help maintain structured donor information rather than relying on unorganized lists or messages.

---

# 📋 Blood Request Management

Requesters can create blood requests containing relevant information such as:

* Patient name
* Blood group
* Location
* Units required
* Request status

The request can then be processed by the matching system to identify suitable donors.

---

# 📜 Donation History

BloodBridge includes a **Donation History** feature that allows donors to view their previous donation-related information.

This helps provide donors with a clearer record of their participation and supports eligibility-aware matching.

---

# ❤️ Donor Impact Dashboard

The **Impact Dashboard** provides donors with a visual representation of their contribution to blood donation.

It is intended to improve donor engagement by showing donation-related impact information in an easy-to-understand dashboard format.

> **Note:** Any illustrative/demo statistics shown in the interface should be interpreted as demonstration data unless explicitly backed by the application's stored records.

---

# 🏥 Blood Bank & Hospital Locator

BloodBridge includes a **Blood Bank / Hospital Locator** feature designed to help users identify nearby healthcare or blood-donation facilities.

This extends the platform beyond donor matching and provides users with another useful resource when dealing with blood-related requirements.

> Availability and accuracy of external facility information depend on the data source used by the application.

---

# ✅ Donor Eligibility Checker

BloodBridge provides a preliminary **Donor Eligibility Checker**.

It helps users review basic eligibility-related conditions before considering blood donation.

### Important

The eligibility checker is a **pre-screening / awareness tool**.

It does **not**:

* Provide a medical diagnosis
* Replace professional medical screening
* Guarantee that a person can donate blood

Final eligibility should always be determined by qualified medical or blood-bank professionals.

---

# 🔔 Notification Center

BloodBridge includes an improved notification system to organize important user updates.

Notifications can be viewed using categories such as:

* **All**
* **Emergency**
* **Requests**
* **System**

This provides a centralized place for users to monitor important activity.

---

# 📊 Admin Analytics Dashboard

Administrators can access an analytics dashboard designed to provide an overview of platform activity.

The dashboard can present information such as:

* Total donors
* Total requests
* Matches
* Fulfilled requests
* Blood group distribution
* Request status
* Emergency statistics

The analytics interface is intended to provide administrators with a quick overview of the system.

> Any demonstration statistics that are not directly backed by stored application records should be treated as illustrative/demo values.

---

# ❤️ Why Donate Blood?

BloodBridge also includes a **Why Donate Blood** section to spread awareness about the importance of blood donation.

The section focuses on:

* Importance of regular blood donation
* Supporting patients during emergencies
* Encouraging community participation
* Creating awareness about blood donation

---

# 🏗️ System Architecture

```text
┌───────────────────────────────┐
│            Users              │
│ Donor / Requester / Admin     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│     React + Vite Frontend     │
│       JavaScript + CSS        │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│       FastAPI Backend         │
├───────────────────────────────┤
│ Authentication                │
│ User Management               │
│ Request Management             │
│ Matching Logic                 │
│ Notifications                 │
│ Admin Analytics               │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        SQLite Database        │
└───────────────────────────────┘
```

---

# 🔄 Basic Workflow

```text
Requester
    │
    ▼
Creates Blood Request
    │
    ▼
System Evaluates Donors
    │
    ├── Blood Compatibility
    ├── Distance
    ├── Availability
    └── Donation Eligibility
    │
    ▼
Smart Match Score
    │
    ▼
Suitable Donors Displayed
    │
    ▼
Requester Sends Request
    │
    ▼
Donor Responds
    │
    ▼
Request Status Updated
```

---

# 👥 User Roles

| Role                | Main Responsibilities                                                        |
| ------------------- | ---------------------------------------------------------------------------- |
| 🩸 **Donor**        | Manage donor information, view requests/matches, donation history and impact |
| 🧑‍⚕️ **Requester** | Create blood requests and find suitable donors                               |
| 🛡️ **Admin**       | Monitor users, requests and platform analytics                               |

---

# 🛠️ Technology Stack

## Frontend

* **React**
* **Vite**
* **JavaScript**
* **CSS**
* React Hooks
* Responsive UI components

## Backend

* **Python**
* **FastAPI**
* **Uvicorn**
* REST APIs
* SQLAlchemy

## Database

* **SQLite**

## Authentication

* JWT-based authentication
* Password hashing
* Role-based access

## Development & Deployment

* **Git**
* **GitHub**
* **Vercel** — Frontend deployment
* **Render** — Backend deployment

---

# 📂 Project Structure

```text
BloodBridge/
│
├── app/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── schemas/
│   ├── database/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── ...
│
├── main.py
├── requirements.txt
├── README.md
└── ...
```

---

# 🚀 Running BloodBridge Locally

## Prerequisites

Make sure the following are installed:

* Python 3.x
* Node.js
* npm
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/ipratikraj/BloodBridge.git
cd BloodBridge
```

---

# ⚙️ Backend Setup

Create and activate a virtual environment.

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start FastAPI

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at the local URL displayed by Vite, commonly:

```text
http://localhost:5173
```

---

# 🔐 Demo Credentials

The following administrator account is provided for **project evaluation and demonstration purposes**.

### Admin

```text
Email: admin@bloodbridge.com
Password: Admin@12345
```

> These credentials are intended for the demo/evaluation environment only. Do not reuse demo credentials for real production systems.

---

# 🌍 Deployment

BloodBridge is deployed using separate frontend and backend services.

### Frontend

**Vercel**

```text
https://blood-bridge-pink.vercel.app/
```

### Backend

**Render**

```text
https://bloodbridge-1-elsg.onrender.com
```

The frontend communicates with the FastAPI backend through REST APIs.

---

# 🔒 Security Considerations

BloodBridge includes authentication and role-based access control.

Important security practices for a production deployment would include:

* Strong production passwords
* Secure secret management
* HTTPS
* Persistent production database
* Proper user verification
* Input validation
* Rate limiting
* Secure token handling
* Regular dependency updates
* Protection of sensitive medical/personal information


---

# ⚠️ Current Limitations

BloodBridge is currently a **working prototype / hackathon project** and has several areas that would need further development for large-scale real-world deployment.

### Database Scalability

The current implementation uses SQLite. It is convenient for development and prototyping, but a production-scale deployment would benefit from a persistent and scalable database such as PostgreSQL.

### External Facility Data

The usefulness of the blood bank/hospital locator depends on the reliability and freshness of the underlying facility information.

### Eligibility Screening

The eligibility checker is only a preliminary screening tool and cannot replace professional medical evaluation.

### Real-Time Communication

A full production system could benefit from real-time notifications and communication channels.

### Verification

Real-world deployment would require stronger donor, hospital and request verification mechanisms.

---

# 🔮 Future Scope

Possible future improvements include:

* PostgreSQL or another scalable database
* Real-time notifications
* SMS and email alerts
* WhatsApp-based emergency notifications
* Verified hospitals and blood banks
* Maps and location API integration
* Emergency-priority matching
* Advanced donor verification
* Hospital/blood-bank integration
* Mobile application
* Advanced analytics
* Secure cloud infrastructure
* Improved request verification
* Privacy-focused healthcare data handling
* Potential future AI/ML-based recommendation features

> AI/ML-based matching is considered a future enhancement and should not be confused with the current rule-based smart matching system.

---

# 🎯 Project Objectives

BloodBridge aims to:

1. Simplify blood donor discovery.
2. Connect requesters with suitable donors.
3. Consider multiple factors during donor matching.
4. Improve location-aware donor discovery.
5. Provide eligibility-aware matching.
6. Organize blood requests and donor information.
7. Improve donor engagement through history and impact features.
8. Provide useful notifications.
9. Provide administrators with system-level analytics.
10. Create a foundation for a scalable blood donation platform.

---

# 🌟 Key Benefits

* Faster donor discovery
* Structured blood request management
* Multi-factor donor matching
* Location-aware matching
* Donation eligibility consideration
* Donor history tracking
* Donor engagement through impact information
* Centralized notifications
* Administrative analytics
* Clean and responsive user interface

---

# 🧪 Testing

The application was tested across major workflows including:

* User registration
* User login
* Donor workflow
* Requester workflow
* Admin workflow
* Blood request creation
* Donor matching
* Blood group compatibility
* Distance-based matching
* Donation interval eligibility
* Notification workflow
* Admin analytics
* Logout/session handling
* Error handling
* Frontend/backend communication


---



# 🤝 Project Purpose

BloodBridge was developed as a technology-focused solution to explore how web applications can make blood donor discovery and request management more structured, accessible and efficient.

The project combines:

**Authentication + Donor Management + Blood Requests + Smart Matching + Notifications + Donor Engagement + Analytics**

into one unified platform.

---

# 👨‍💻 Developer

**Pratik Raj**

MCA Student
Cochin University of Science and Technology (CUSAT)

---

# 📜 Disclaimer

BloodBridge is an academic/hackathon project and should not be treated as a replacement for hospitals, blood banks, doctors or emergency medical services.

Blood availability, donor eligibility and medical decisions should always be confirmed by qualified healthcare professionals and authorized blood banks.

---

## 🩸 BloodBridge

### Connecting the right donor with the right request — faster.
