
import { useEffect, useState } from "react";
import "./index.css";

import {
  createDonor,
  createBloodRequest,
  getMyDashboard,
  acceptNotification,
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  getAdminRequests,
  verifyBloodRequest,
  rejectBloodRequest,
} from "./api";


function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ==================================================
  // AUTHENTICATION
  // ==================================================

  const [currentUser, setCurrentUser] = useState(null);

  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [authData, setAuthData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "donor",
  });

  // Action user wanted before login
  const [pendingAction, setPendingAction] = useState(null);


  // ==================================================
  // BLOOD REQUEST MODAL
  // ==================================================

  const [showRequestForm, setShowRequestForm] = useState(false);


  // ==================================================
  // DONOR REGISTRATION MODAL
  // ==================================================

  const [showDonorForm, setShowDonorForm] = useState(false);


  // ==================================================
  // DONOR DASHBOARD
  // ==================================================

  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardItems, setDashboardItems] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);


  // Contact details revealed after acceptance
  const [acceptedContacts, setAcceptedContacts] = useState({});


  // ==================================================
  // ADMIN DASHBOARD
  // ==================================================

  const [showAdminDashboard, setShowAdminDashboard] =
    useState(false);

  const [adminRequests, setAdminRequests] =
    useState([]);

  const [adminLoading, setAdminLoading] =
    useState(false);

  const [adminError, setAdminError] =
    useState("");

  const [adminActionId, setAdminActionId] =
    useState(null);


  // ==================================================
  // BLOOD REQUEST FORM DATA
  // ==================================================

  const [requestData, setRequestData] = useState({
    patient_name: "",
    blood_group: "O+",
    city: "Kochi",
    latitude: 9.9312,
    longitude: 76.2673,
    units_required: 1,
    source_type: "individual",
    verification_status: "pending",
  });


  // Matching results
  const [matches, setMatches] = useState([]);


  // Request states
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);


  // ==================================================
  // DONOR REGISTRATION DATA
  // ==================================================

  /*
    Name and email are NOT collected here anymore.

    The backend automatically uses:
      current_user.full_name
      current_user.email

    from the authenticated account.
  */

  const [donorData, setDonorData] = useState({
    blood_group: "O+",
    city: "Kochi",
    latitude: "9.9312",
    longitude: "76.2673",
    last_donation_date: "",
    phone: "",
  });


  // Donor registration states
  const [donorLoading, setDonorLoading] = useState(false);
  const [donorError, setDonorError] = useState("");
  const [donorSuccess, setDonorSuccess] = useState("");


  // ==================================================
  // RESTORE LOGIN SESSION
  // ==================================================

  useEffect(() => {
    const savedRefreshToken = localStorage.getItem(
      "bloodbridge_refresh_token"
    );

    if (!savedRefreshToken) {
      return;
    }

    const restoreSession = async () => {
      try {
        const data = await refreshAccessToken(
          savedRefreshToken
        );

        if (data?.refresh_token) {
          localStorage.setItem(
            "bloodbridge_refresh_token",
            data.refresh_token
          );
        }

        if (data?.user) {
          setCurrentUser(data.user);
        }

      } catch (error) {
        console.error(
          "Session restore failed:",
          error
        );

        localStorage.removeItem(
          "bloodbridge_refresh_token"
        );
      }
    };

    restoreSession();
  }, []);


  // ==================================================
  // OPEN AUTH MODAL
  // ==================================================

  const openAuthForm = (mode = "login", action = null) => {
    setAuthMode(mode);
    setShowAuthForm(true);

    setAuthError("");
    setAuthSuccess("");

    setPendingAction(action);

    setMenuOpen(false);
  };


  // ==================================================
  // CLOSE AUTH MODAL
  // ==================================================

  const closeAuthForm = () => {
    setShowAuthForm(false);

    setAuthError("");
    setAuthSuccess("");

    setPendingAction(null);
  };


  // ==================================================
  // UPDATE AUTH DATA
  // ==================================================

  const updateAuthData = (field, value) => {
    setAuthData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  // ==================================================
  // SWITCH AUTH MODE
  // ==================================================

  const switchAuthMode = (mode) => {
    setAuthMode(mode);

    setAuthError("");
    setAuthSuccess("");

    setAuthData((previous) => ({
      ...previous,
      full_name: "",
      email: "",
      password: "",
    }));
  };


  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const data = await loginUser({
        email: authData.email.trim(),
        password: authData.password,
      });

      if (data?.refresh_token) {
        localStorage.setItem(
          "bloodbridge_refresh_token",
          data.refresh_token
        );
      }

      if (data?.user) {
        setCurrentUser(data.user);
      }

      setAuthSuccess(
        "Login successful. Welcome back to BloodBridge."
      );

      const actionAfterLogin = pendingAction;

      setAuthData({
        full_name: "",
        email: "",
        password: "",
        role: "donor",
      });

      setTimeout(() => {
        setShowAuthForm(false);
        setAuthSuccess("");

        setPendingAction(null);

        if (actionAfterLogin === "donor") {
          setShowDonorForm(true);
        }

        if (actionAfterLogin === "request") {
          setShowRequestForm(true);
        }

        if (actionAfterLogin === "dashboard") {
          setShowDashboard(true);
          loadDashboard();
        }

        if (actionAfterLogin === "admin") {
          setShowAdminDashboard(true);
          loadAdminRequests();
        }
      }, 500);

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setAuthError(
        error.message ||
          "Unable to login. Please check your email and password."
      );

    } finally {
      setAuthLoading(false);
    }
  };


  // ==================================================
  // REGISTER ACCOUNT
  // ==================================================

  const handleRegister = async (event) => {
    event.preventDefault();

    setAuthLoading(true);
    setAuthError("");
    setAuthSuccess("");

    try {
      const data = await registerUser({
        full_name: authData.full_name.trim(),
        email: authData.email.trim(),
        password: authData.password,
        role: authData.role,
      });

      console.log(
        "Account registered:",
        data
      );

      setAuthSuccess(
        "Account created successfully. Please login to continue."
      );

      setAuthData({
        full_name: "",
        email: authData.email.trim(),
        password: "",
        role: authData.role,
      });

      setTimeout(() => {
        setAuthMode("login");
        setAuthSuccess("");
      }, 900);

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setAuthError(
        error.message ||
          "Unable to create your account. Please try again."
      );

    } finally {
      setAuthLoading(false);
    }
  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem(
      "bloodbridge_refresh_token"
    );

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      localStorage.removeItem(
        "bloodbridge_refresh_token"
      );

      setCurrentUser(null);

      setShowDashboard(false);
      setShowAdminDashboard(false);
      setShowDonorForm(false);
      setShowRequestForm(false);

      setDashboardItems([]);
      setAdminRequests([]);
      setAcceptedContacts({});
    }
  };


  // ==================================================
  // REQUIRE LOGIN
  // ==================================================

  const requireLogin = (action) => {
    if (!currentUser) {
      openAuthForm("login", action);
      return false;
    }

    return true;
  };


  // ==================================================
  // OPEN FIND DONOR FORM
  // ==================================================

  const openRequestForm = () => {
    if (!requireLogin("request")) {
      return;
    }

    setShowRequestForm(true);
    setShowDonorForm(false);

    setMatches([]);
    setRequestError("");
    setRequestSubmitted(false);

    setMenuOpen(false);
  };


  // ==================================================
  // CLOSE FIND DONOR FORM
  // ==================================================

  const closeRequestForm = () => {
    setShowRequestForm(false);

    setMatches([]);
    setRequestError("");
    setRequestSubmitted(false);
  };


  // ==================================================
  // OPEN DONOR REGISTRATION
  // ==================================================

  const openDonorForm = () => {
    if (!requireLogin("donor")) {
      return;
    }

    setShowDonorForm(true);
    setShowRequestForm(false);

    setDonorError("");
    setDonorSuccess("");

    setMenuOpen(false);
  };


  // ==================================================
  // CLOSE DONOR REGISTRATION
  // ==================================================

  const closeDonorForm = () => {
    setShowDonorForm(false);

    setDonorError("");
    setDonorSuccess("");
  };


  // ==================================================
  // UPDATE REQUEST DATA
  // ==================================================

  const updateRequestData = (field, value) => {
    setRequestData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  // ==================================================
  // UPDATE DONOR DATA
  // ==================================================

  const updateDonorData = (field, value) => {
    setDonorData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };


  // ==================================================
  // SEND BLOOD REQUEST
  // ==================================================

  const findDonors = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      openAuthForm("login", "request");
      return;
    }

    setRequestLoading(true);
    setRequestError("");
    setMatches([]);
    setRequestSubmitted(false);

    try {
      const data = await createBloodRequest({
        patient_name:
          requestData.patient_name.trim(),

        blood_group:
          requestData.blood_group,

        city:
          requestData.city.trim(),

        latitude:
          Number(requestData.latitude),

        longitude:
          Number(requestData.longitude),

        units_required:
          Number(requestData.units_required),

        source_type:
          requestData.source_type,

        verification_status:
          "pending",
      });

      console.log(
        "Blood request created:",
        data
      );

      setMatches(
        data?.matching_donors || []
      );

      setRequestSubmitted(true);

    } catch (error) {
      console.error(
        "Blood request error:",
        error
      );

      setRequestError(
        error.message ||
          "Unable to connect to BloodBridge. Please try again."
      );

    } finally {
      setRequestLoading(false);
    }
  };


  // ==================================================
  // REGISTER DONOR PROFILE
  // ==================================================

  const registerDonor = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      openAuthForm("login", "donor");
      return;
    }

    setDonorLoading(true);
    setDonorError("");
    setDonorSuccess("");

    try {
      const data = await createDonor({
        blood_group:
          donorData.blood_group,

        city:
          donorData.city.trim(),

        latitude:
          Number(donorData.latitude),

        longitude:
          Number(donorData.longitude),

        last_donation_date:
          donorData.last_donation_date || null,

        phone:
          donorData.phone.trim(),
      });

      console.log(
        "Donor profile registered:",
        data
      );

      setDonorSuccess(
        "Donor profile registered successfully. Thank you for helping save lives."
      );

      setDonorData({
        blood_group: "O+",
        city: "Kochi",
        latitude: "9.9312",
        longitude: "76.2673",
        last_donation_date: "",
        phone: "",
      });

      // Refresh dashboard if open
      if (showDashboard) {
        await loadDashboard();
      }

    } catch (error) {
      console.error(
        "Donor registration error:",
        error
      );

      setDonorError(
        error.message ||
          "Unable to register donor profile. Please try again."
      );

    } finally {
      setDonorLoading(false);
    }
  };


  // ==================================================
  // LOAD DONOR DASHBOARD
  // ==================================================

  const loadDashboard = async () => {
    if (!currentUser) {
      return;
    }

    setDashboardLoading(true);
    setDashboardError("");

    try {
      const data = await getMyDashboard();

      const items =
        data?.dashboard || [];


      // ------------------------------------------
      // SORT DASHBOARD
      // ------------------------------------------

      const sortedItems =
        [...items].sort(
          (a, b) => {

            if (
              a.status === "pending" &&
              b.status !== "pending"
            ) {
              return -1;
            }

            if (
              a.status !== "pending" &&
              b.status === "pending"
            ) {
              return 1;
            }

            return b.id - a.id;
          }
        );


      // ------------------------------------------
      // RESTORE CONTACT DETAILS FROM STATE
      // ------------------------------------------

      const finalItems =
        sortedItems.map(
          (item) => ({
            ...item,

            donorContact:
              acceptedContacts[item.id] ||
              null,
          })
        );


      setDashboardItems(
        finalItems
      );

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setDashboardError(
        error.message ||
          "Unable to load donor dashboard. Please try again."
      );

    } finally {
      setDashboardLoading(false);
    }
  };


  // ==================================================
  // OPEN DONOR DASHBOARD
  // ==================================================

  const openDashboard = async () => {
    if (!requireLogin("dashboard")) {
      return;
    }

    setShowDashboard(true);
    setMenuOpen(false);

    await loadDashboard();
  };


  // ==================================================
  // CLOSE DONOR DASHBOARD
  // ==================================================

  const closeDashboard = () => {
    setShowDashboard(false);
    setDashboardError("");
  };


  // ==================================================
  // ACCEPT DONOR REQUEST
  // ==================================================

  const acceptDonorRequest = async (
    notificationId
  ) => {

    setAcceptingId(
      notificationId
    );

    setDashboardError("");

    try {
      const data =
        await acceptNotification(
          notificationId
        );

      console.log(
        "Request accepted:",
        data
      );


      // ------------------------------------------
      // STORE REVEALED CONTACT
      // ------------------------------------------

      if (data?.donor_contact) {
        setAcceptedContacts(
          (previous) => ({
            ...previous,

            [notificationId]:
              data.donor_contact,
          })
        );
      }


      // ------------------------------------------
      // UPDATE DASHBOARD ITEM
      // ------------------------------------------

      setDashboardItems(
        (previousItems) =>
          previousItems.map(
            (item) => {

              if (
                item.id !==
                notificationId
              ) {
                return item;
              }

              return {
                ...item,

                status: "accepted",

                request: {
                  ...item.request,
                  status: "matched",
                },

                donor: {
                  ...item.donor,
                  status: "reserved",
                },

                donorContact:
                  data?.donor_contact ||
                  item.donorContact ||
                  null,
              };
            }
          )
      );

    } catch (error) {
      console.error(
        "Accept request error:",
        error
      );

      setDashboardError(
        error.message ||
          "Unable to accept the request."
      );

    } finally {
      setAcceptingId(null);
    }
  };


  // ==================================================
  // ADMIN DASHBOARD
  // ==================================================

  const loadAdminRequests = async () => {
    setAdminLoading(true);
    setAdminError("");

    try {
      const data = await getAdminRequests();

      setAdminRequests(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Admin requests error:",
        error
      );

      setAdminError(
        error.message ||
          "Unable to load blood requests."
      );

    } finally {
      setAdminLoading(false);
    }
  };


  // ==================================================
  // OPEN ADMIN DASHBOARD
  // ==================================================

  const openAdminDashboard = async () => {
    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      return;
    }

    setShowAdminDashboard(true);
    setMenuOpen(false);

    await loadAdminRequests();
  };


  // ==================================================
  // CLOSE ADMIN DASHBOARD
  // ==================================================

  const closeAdminDashboard = () => {
    setShowAdminDashboard(false);
    setAdminError("");
  };


  // ==================================================
  // VERIFY REQUEST
  // ==================================================

  const handleVerifyRequest = async (
    requestId
  ) => {

    setAdminActionId(requestId);
    setAdminError("");

    try {
      await verifyBloodRequest(
        requestId
      );

      await loadAdminRequests();

    } catch (error) {
      console.error(
        "Verify request error:",
        error
      );

      setAdminError(
        error.message ||
          "Unable to verify this request."
      );

    } finally {
      setAdminActionId(null);
    }
  };


  // ==================================================
  // REJECT REQUEST
  // ==================================================

  const handleRejectRequest = async (
    requestId
  ) => {

    setAdminActionId(requestId);
    setAdminError("");

    try {
      await rejectBloodRequest(
        requestId
      );

      await loadAdminRequests();

    } catch (error) {
      console.error(
        "Reject request error:",
        error
      );

      setAdminError(
        error.message ||
          "Unable to reject this request."
      );

    } finally {
      setAdminActionId(null);
    }
  };


  // ==================================================
  // NAVIGATION
  // ==================================================

  const handleNavClick = () => {
    setMenuOpen(false);
  };


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="app">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="navbar">

        <a
          href="#home"
          className="logo"
          onClick={handleNavClick}
        >
          <span className="logo-drop">
            ♥
          </span>

          Blood<span>Bridge</span>
        </a>


        <div
          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}
        >

          <a
            href="#home"
            onClick={handleNavClick}
          >
            Home
          </a>


          <a
            href="#inventory"
            onClick={handleNavClick}
          >
            Blood Inventory
          </a>


          <a
            href="#eligibility"
            onClick={handleNavClick}
          >
            Eligibility
          </a>


          <a
            href="#drives"
            onClick={handleNavClick}
          >
            Find a Drive
          </a>


          {/* DONOR DASHBOARD */}

          <button
            className="dashboard-nav-button"
            onClick={openDashboard}
          >
            Donor Dashboard
          </button>


          {/* ADMIN DASHBOARD */}

          {currentUser?.role === "admin" && (
            <button
              className="dashboard-nav-button"
              onClick={openAdminDashboard}
            >
              Admin Dashboard
            </button>
          )}


          {/* USER ACCOUNT */}

          {currentUser ? (

            <div className="user-menu">

              <span className="user-greeting">
                Hi, {currentUser.full_name}
              </span>

              <button
                className="dashboard-nav-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          ) : (

            <button
              className="dashboard-nav-button"
              onClick={() =>
                openAuthForm("login")
              }
            >
              Login
            </button>

          )}


          {/* DONATE */}

          <button
            className="nav-button"
            onClick={openDonorForm}
          >
            Donate Now
          </button>

        </div>


        {/* MOBILE MENU */}

        <button
          className="menu-button"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Open menu"
        >
          ☰
        </button>

      </nav>


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <div className="badge">
            ● LIVE BLOOD AVAILABILITY
          </div>


          <h1>
            One donation.
            <br />
            <span>Multiple lives.</span>
          </h1>


          <p>
            BloodBridge connects people who need blood
            with nearby eligible donors — quickly,
            securely and responsibly.
          </p>


          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={openRequestForm}
            >
              Find a Donor →
            </button>


            <button
              className="secondary-button"
              onClick={openDonorForm}
            >
              Become a Donor
            </button>

          </div>


          <div className="hero-trust">

            <div className="avatars">
              <span>👤</span>
              <span>👤</span>
              <span>👤</span>
            </div>


            <div>

              <strong>
                2,400+ donors
              </strong>

              <small>
                ready to help
              </small>

            </div>

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="hero-visual">

          <div className="blood-orb">

            <div className="drop">
              ♥
            </div>

            <div className="pulse-ring"></div>

            <div className="pulse-ring second"></div>

          </div>


          <div className="floating-card card-one">

            <span className="card-icon">
              🩸
            </span>

            <div>

              <strong>
                O+ Available
              </strong>

              <small>
                12 nearby donors
              </small>

            </div>

          </div>


          <div className="floating-card card-two">

            <span className="check">
              ✓
            </span>

            <div>

              <strong>
                Donor matched
              </strong>

              <small>
                0.8 km away
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          STATS
      ================================================== */}

      <section className="stats">

        <div>
          <strong>2,400+</strong>
          <span>Registered Donors</span>
        </div>

        <div>
          <strong>1,850+</strong>
          <span>Successful Matches</span>
        </div>

        <div>
          <strong>18</strong>
          <span>Districts Covered</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Matching System</span>
        </div>

      </section>


      {/* ==================================================
          BLOOD INVENTORY
      ================================================== */}

      <section
        className="section"
        id="inventory"
      >

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              LIVE INVENTORY
            </span>

            <h2>
              Blood availability
            </h2>

          </div>

          <span className="live">
            ● Updated just now
          </span>

        </div>


        <div className="blood-grid">

          <BloodCard
            type="A+"
            level="Good"
            percentage={78}
          />

          <BloodCard
            type="A-"
            level="Low"
            percentage={42}
          />

          <BloodCard
            type="B+"
            level="Good"
            percentage={71}
          />

          <BloodCard
            type="B-"
            level="Critical"
            percentage={19}
          />

          <BloodCard
            type="AB+"
            level="Good"
            percentage={65}
          />

          <BloodCard
            type="AB-"
            level="Low"
            percentage={34}
          />

          <BloodCard
            type="O+"
            level="Good"
            percentage={82}
          />

          <BloodCard
            type="O-"
            level="Critical"
            percentage={16}
          />

        </div>

      </section>


      {/* ==================================================
          DONATE CTA
      ================================================== */}

      <section className="donate-section">

        <div>

          <span className="eyebrow light">
            MAKE AN IMPACT
          </span>

          <h2>
            Your blood could be
            <br />
            someone's second chance.
          </h2>

          <p>
            Register as a donor and help someone
            in your district when they need it most.
          </p>

          <button
            className="white-button"
            onClick={openDonorForm}
          >
            Become a Donor →
          </button>

        </div>


        <div className="heartbeat">

          ♥

          <div className="heartbeat-line">
            ──╱╲──╱╲────╱╲──
          </div>

        </div>

      </section>


      {/* ==================================================
          APPOINTMENT
      ================================================== */}

      <section className="section appointment-section">

        <div className="appointment-info">

          <span className="eyebrow">
            GET STARTED
          </span>

          <h2>
            Ready to make
            <br />
            a difference?
          </h2>

          <p>
            Find a nearby blood donation drive and
            book your appointment in just a few steps.
          </p>


          <div className="info-point">

            <span>✓</span>

            <div>

              <strong>
                Quick registration
              </strong>

              <p>
                Simple and secure donor registration.
              </p>

            </div>

          </div>


          <div className="info-point">

            <span>✓</span>

            <div>

              <strong>
                Nearby matching
              </strong>

              <p>
                Find eligible donors within your area.
              </p>

            </div>

          </div>


          <div className="info-point">

            <span>✓</span>

            <div>

              <strong>
                Privacy first
              </strong>

              <p>
                Contact information stays private
                until acceptance.
              </p>

            </div>

          </div>

        </div>


        {/* APPOINTMENT CARD */}

        <div className="appointment-card">

          <div className="card-top">

            <div>

              <span className="eyebrow">
                BOOK A DRIVE
              </span>

              <h3>
                Donation appointment
              </h3>

            </div>

            <span className="step">
              01 / 03
            </span>

          </div>


          <label>
            Your city
          </label>

          <select defaultValue="Kochi">

            <option>Kochi</option>
            <option>Ernakulam</option>
            <option>Thiruvananthapuram</option>
            <option>Kozhikode</option>

          </select>


          <label>
            Preferred date
          </label>

          <input
            type="date"
            defaultValue="2026-09-20"
          />


          <label>
            Blood group
          </label>

          <div className="blood-options">

            <button type="button">A+</button>
            <button type="button">A-</button>
            <button type="button">B+</button>
            <button type="button">B-</button>
            <button type="button">O+</button>
            <button type="button">O-</button>
            <button type="button">AB+</button>
            <button type="button">AB-</button>

          </div>


          <button
            className="primary-button full"
            onClick={openDonorForm}
          >
            Continue →
          </button>

        </div>

      </section>


      {/* ==================================================
          ELIGIBILITY
      ================================================== */}

      <section
        className="section eligibility"
        id="eligibility"
      >

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              BEFORE YOU DONATE
            </span>

            <h2>
              Basic eligibility
            </h2>

          </div>

        </div>


        <div className="eligibility-grid">

          <InfoCard
            icon="18+"
            title="Age"
            text="Donors should meet the required minimum age."
          />

          <InfoCard
            icon="⚖"
            title="Healthy"
            text="You should be feeling well on the day of donation."
          />

          <InfoCard
            icon="🩸"
            title="Donation interval"
            text="Enough time should have passed since your previous donation."
          />

          <InfoCard
            icon="✓"
            title="Eligibility check"
            text="Final eligibility is confirmed before donation."
          />

        </div>

      </section>


      {/* ==================================================
          UPCOMING DRIVES
      ================================================== */}

      <section
        className="section drives"
        id="drives"
      >

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              NEAR YOU
            </span>

            <h2>
              Upcoming drives
            </h2>

          </div>

          <button className="text-button">
            View all →
          </button>

        </div>


        <div className="drive-grid">

          <DriveCard
            date="20"
            month="SEP"
            title="Community Blood Drive"
            location="Kochi"
          />

          <DriveCard
            date="24"
            month="SEP"
            title="Campus Donation Camp"
            location="Ernakulam"
          />

          <DriveCard
            date="28"
            month="SEP"
            title="District Blood Camp"
            location="Aluva"
          />

        </div>

      </section>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <div className="logo">

          <span className="logo-drop">
            ♥
          </span>

          Blood<span>Bridge</span>

        </div>

        <p>
          Connecting donors with those who need them.
        </p>

        <span className="copyright">
          © 2026 BloodBridge
        </span>

      </footer>


      {/* ==================================================
          AUTHENTICATION MODAL
      ================================================== */}

      {showAuthForm && (

        <section className="request-overlay">

          <div className="request-modal auth-modal">

            <button
              className="close-button"
              onClick={closeAuthForm}
              aria-label="Close authentication"
            >
              ×
            </button>


            <span className="eyebrow">
              BLOODBRIDGE ACCOUNT
            </span>


            <h2>
              {authMode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>


            <p className="modal-description">

              {authMode === "login"
                ? "Login to access your BloodBridge account and continue."
                : "Create a secure account to request blood or register as a donor."}

            </p>


            {/* AUTH ERROR */}

            {authError && (

              <div className="error-message">
                {authError}
              </div>

            )}


            {/* AUTH SUCCESS */}

            {authSuccess && (

              <div className="form-success">
                ✓ {authSuccess}
              </div>

            )}


            <form
              onSubmit={
                authMode === "login"
                  ? handleLogin
                  : handleRegister
              }
            >

              {/* FULL NAME */}

              {authMode === "register" && (

                <>
                  <label>
                    Full name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={
                      authData.full_name
                    }
                    onChange={(event) =>
                      updateAuthData(
                        "full_name",
                        event.target.value
                      )
                    }
                    minLength="2"
                    required
                  />
                </>

              )}


              {/* EMAIL */}

              <label>
                Email address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={authData.email}
                onChange={(event) =>
                  updateAuthData(
                    "email",
                    event.target.value
                  )
                }
                required
              />


              {/* PASSWORD */}

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={authData.password}
                onChange={(event) =>
                  updateAuthData(
                    "password",
                    event.target.value
                  )
                }
                minLength="8"
                required
              />


              {/* ROLE */}

              {authMode === "register" && (

                <>
                  <label>
                    Account type
                  </label>

                  <select
                    value={authData.role}
                    onChange={(event) =>
                      updateAuthData(
                        "role",
                        event.target.value
                      )
                    }
                  >

                    <option value="donor">
                      Donor
                    </option>

                    <option value="requester">
                      Blood Requester
                    </option>

                  </select>


                  <div className="privacy-note">

                    🔒 Your account information is protected.
                    Donor contact details are only revealed
                    after a donor accepts a blood request.

                  </div>

                </>

              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-button full"
                disabled={authLoading}
              >

                {authLoading

                  ? authMode === "login"
                    ? "Logging in..."
                    : "Creating account..."

                  : authMode === "login"
                    ? "Login →"
                    : "Create Account →"}

              </button>

            </form>


            {/* SWITCH LOGIN / REGISTER */}

            <div className="auth-switch">

              {authMode === "login" ? (

                <p>
                  Don't have a BloodBridge account?

                  <button
                    type="button"
                    onClick={() =>
                      switchAuthMode(
                        "register"
                      )
                    }
                  >
                    Create an account
                  </button>
                </p>

              ) : (

                <p>
                  Already have an account?

                  <button
                    type="button"
                    onClick={() =>
                      switchAuthMode(
                        "login"
                      )
                    }
                  >
                    Login
                  </button>
                </p>

              )}

            </div>

          </div>

        </section>

      )}


      {/* ==================================================
          DONOR DASHBOARD MODAL
      ================================================== */}

      {showDashboard && (

        <section className="dashboard-overlay">

          <div className="dashboard-modal">

            <div className="dashboard-header">

              <div>

                <span className="eyebrow">
                  DONOR PORTAL
                </span>

                <h2>
                  Donor Dashboard
                </h2>

                <p>
                  Review blood requests matched to you.
                </p>

              </div>


              <div className="dashboard-header-actions">

                <button
                  className="dashboard-refresh-button"
                  onClick={loadDashboard}
                  disabled={dashboardLoading}
                  type="button"
                >
                  {dashboardLoading
                    ? "Refreshing..."
                    : "↻ Refresh"}
                </button>


                <button
                  className="close-button"
                  onClick={closeDashboard}
                  aria-label="Close dashboard"
                >
                  ×
                </button>

              </div>

            </div>


            {/* LOADING */}

            {dashboardLoading && (

              <div className="dashboard-loading">

                <div className="loading-drop">
                  🩸
                </div>

                <strong>
                  Loading your requests...
                </strong>

                <span>
                  Checking the latest donor matches.
                </span>

              </div>

            )}


            {/* ERROR */}

            {!dashboardLoading &&
              dashboardError && (

                <div className="error-message">

                  {dashboardError}

                  <button
                    type="button"
                    onClick={loadDashboard}
                  >
                    Try again
                  </button>

                </div>

              )}


            {/* EMPTY */}

            {!dashboardLoading &&
              !dashboardError &&
              dashboardItems.length === 0 && (

                <div className="dashboard-empty">

                  <div className="empty-icon">
                    🩸
                  </div>

                  <h3>
                    No matched requests yet
                  </h3>

                  <p>
                    When a blood request matches your
                    eligibility and location, it will
                    appear here.
                  </p>

                </div>

              )}


            {/* REQUEST LIST */}

            {!dashboardLoading &&
              !dashboardError &&
              dashboardItems.length > 0 && (

                <div className="dashboard-list">

                  <div className="dashboard-summary">

                    <div>

                      <strong>
                        {dashboardItems.length}
                      </strong>

                      <span>
                        Matched request
                        {dashboardItems.length !== 1
                          ? "s"
                          : ""}
                      </span>

                    </div>

                    <span className="dashboard-live">
                      ● LIVE
                    </span>

                  </div>


                  {dashboardItems.map(
                    (item) => {

                      const request =
                        item.request || {};

                      const donor =
                        item.donor || {};

                      const isPending =
                        item.status ===
                        "pending";

                      const isAccepted =
                        item.status ===
                        "accepted";

                      const isClosed =
                        item.status ===
                        "closed";


                      let statusText =
                        "Pending";

                      if (isAccepted) {
                        statusText =
                          "Accepted";
                      }

                      if (isClosed) {
                        statusText =
                          "Closed";
                      }


                      const statusClass =
                        isPending
                          ? "request-status pending"
                          : "request-status accepted-status";


                      return (

                        <div
                          className={`dashboard-request ${
                            isAccepted
                              ? "accepted"
                              : ""
                          }`}
                          key={item.id}
                        >

                          {/* REQUEST HEADER */}

                          <div className="dashboard-request-top">

                            <div className="dashboard-blood-group">

                              🩸

                              <strong>
                                {request.blood_group}
                              </strong>

                            </div>


                            <span
                              className={
                                statusClass
                              }
                            >
                              {statusText}
                            </span>

                          </div>


                          {/* PATIENT */}

                          <div className="dashboard-patient">

                            <span>
                              PATIENT
                            </span>

                            <strong>
                              {request.patient_name}
                            </strong>

                          </div>


                          {/* DETAILS */}

                          <div className="dashboard-details">

                            <div>

                              <span>
                                📍 Location
                              </span>

                              <strong>
                                {request.city}
                              </strong>

                            </div>


                            <div>

                              <span>
                                📏 Distance
                              </span>

                              <strong>
                                {item.distance_km ??
                                  "—"} km
                              </strong>

                            </div>


                            <div>

                              <span>
                                📦 Units required
                              </span>

                              <strong>
                                {request.units_required}
                              </strong>

                            </div>

                          </div>


                          {/* MATCH REASON */}

                          {!isClosed && (

                            <div className="privacy-note">

                              ✓{" "}

                              {item.match_reason ||
                                "Matched based on blood group, availability, donation interval and location."}

                            </div>

                          )}


                          {/* PENDING */}

                          {isPending && (

                            <>

                              <div className="dashboard-privacy">

                                <span>
                                  🔒
                                </span>

                                <div>

                                  <strong>
                                    Your contact details
                                    are private
                                  </strong>

                                  <p>
                                    Your phone number and
                                    email will only be
                                    revealed after you accept
                                    this request.
                                  </p>

                                </div>

                              </div>


                              <button
                                className="primary-button dashboard-accept"
                                onClick={() =>
                                  acceptDonorRequest(
                                    item.id
                                  )
                                }
                                disabled={
                                  acceptingId ===
                                  item.id
                                }
                              >

                                {acceptingId ===
                                item.id
                                  ? "Accepting..."
                                  : "Accept Request →"}

                              </button>

                            </>

                          )}


                          {/* ACCEPTED */}

                          {isAccepted && (

                            <div className="contact-reveal">

                              <div className="success-heading">

                                <span>
                                  ✓
                                </span>

                                <div>

                                  <strong>
                                    Request accepted
                                  </strong>

                                  <small>
                                    Contact details are now
                                    available.
                                  </small>

                                </div>

                              </div>


                              <div className="contact-grid">

                                <div className="contact-item">

                                  <span>
                                    📞 Phone
                                  </span>

                                  <strong>
                                    {item.donorContact?.phone ||
                                      "Contact available"}
                                  </strong>

                                </div>


                                <div className="contact-item">

                                  <span>
                                    ✉ Email
                                  </span>

                                  <strong>
                                    {item.donorContact?.email ||
                                      "Contact available"}
                                  </strong>

                                </div>

                              </div>

                            </div>

                          )}


                          {/* CLOSED */}

                          {isClosed && (

                            <div className="dashboard-privacy">

                              <span>
                                ℹ
                              </span>

                              <div>

                                <strong>
                                  Request closed
                                </strong>

                                <p>
                                  Another eligible donor was
                                  selected for this blood request.
                                </p>

                              </div>

                            </div>

                          )}

                        </div>

                      );

                    }
                  )}

                </div>

              )}

          </div>

        </section>

      )}


      {/* ==================================================
          ADMIN DASHBOARD MODAL
      ================================================== */}

      {showAdminDashboard && (

        <section className="dashboard-overlay">

          <div className="dashboard-modal">

            <div className="dashboard-header">

              <div>

                <span className="eyebrow">
                  BLOODBRIDGE ADMIN
                </span>

                <h2>
                  Admin Dashboard
                </h2>

                <p>
                  Review and verify blood requests.
                </p>

              </div>


              <div className="dashboard-header-actions">

                <button
                  className="dashboard-refresh-button"
                  onClick={loadAdminRequests}
                  disabled={adminLoading}
                  type="button"
                >
                  {adminLoading
                    ? "Refreshing..."
                    : "↻ Refresh"}
                </button>


                <button
                  className="close-button"
                  onClick={closeAdminDashboard}
                  aria-label="Close admin dashboard"
                >
                  ×
                </button>

              </div>

            </div>


            {/* ADMIN ERROR */}

            {adminError && (

              <div className="error-message">
                {adminError}
              </div>

            )}


            {/* ADMIN LOADING */}

            {adminLoading && (

              <div className="dashboard-loading">

                <div className="loading-drop">
                  🩸
                </div>

                <strong>
                  Loading blood requests...
                </strong>

                <span>
                  Checking the latest requests.
                </span>

              </div>

            )}


            {/* EMPTY */}

            {!adminLoading &&
              !adminError &&
              adminRequests.length === 0 && (

                <div className="dashboard-empty">

                  <div className="empty-icon">
                    ✓
                  </div>

                  <h3>
                    No blood requests
                  </h3>

                  <p>
                    There are currently no blood requests
                    to review.
                  </p>

                </div>

              )}


            {/* REQUEST LIST */}

            {!adminLoading &&
              adminRequests.length > 0 && (

                <div className="dashboard-list">

                  {/* SUMMARY */}

                  <div className="dashboard-summary">

                    <div>

                      <strong>
                        {adminRequests.length}
                      </strong>

                      <span>
                        Blood request
                        {adminRequests.length !== 1
                          ? "s"
                          : ""}
                      </span>

                    </div>

                    <span className="dashboard-live">
                      ● ADMIN
                    </span>

                  </div>


                  {/* REQUESTS */}

                  {adminRequests.map(
                    (request) => {

                      const isPending =
                        request.verification_status ===
                        "pending";

                      const isVerified =
                        request.verification_status ===
                        "verified";

                      const isRejected =
                        request.verification_status ===
                        "rejected";


                      let sourceLabel =
                        request.source_type;

                      if (
                        request.source_type ===
                        "blood_bank"
                      ) {
                        sourceLabel =
                          "Blood Bank";
                      } else if (
                        request.source_type
                      ) {
                        sourceLabel =
                          request.source_type
                            .charAt(0)
                            .toUpperCase() +
                          request.source_type.slice(1);
                      }


                      return (

                        <div
                          className="dashboard-request"
                          key={request.id}
                        >

                          {/* REQUEST HEADER */}

                          <div className="dashboard-request-top">

                            <div className="dashboard-blood-group">

                              🩸

                              <strong>
                                {request.blood_group}
                              </strong>

                            </div>


                            <span
                              className={
                                isPending
                                  ? "request-status pending"
                                  : "request-status accepted-status"
                              }
                            >

                              {isPending
                                ? "Pending"
                                : isVerified
                                  ? "Verified"
                                  : "Rejected"}

                            </span>

                          </div>


                          {/* PATIENT */}

                          <div className="dashboard-patient">

                            <span>
                              PATIENT
                            </span>

                            <strong>
                              {request.patient_name}
                            </strong>

                          </div>


                          {/* DETAILS */}

                          <div className="dashboard-details">

                            <div>

                              <span>
                                📍 Location
                              </span>

                              <strong>
                                {request.city}
                              </strong>

                            </div>


                            <div>

                              <span>
                                📦 Units required
                              </span>

                              <strong>
                                {request.units_required}
                              </strong>

                            </div>


                            <div>

                              <span>
                                🏥 Source
                              </span>

                              <strong>
                                {sourceLabel}
                              </strong>

                            </div>

                          </div>


                          {/* ACTION BUTTONS */}

                          {isPending && (

                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "18px",
                              }}
                            >

                              <button
                                className="primary-button"
                                type="button"
                                disabled={
                                  adminActionId ===
                                  request.id
                                }
                                onClick={() =>
                                  handleVerifyRequest(
                                    request.id
                                  )
                                }
                              >

                                {adminActionId ===
                                request.id
                                  ? "Updating..."
                                  : "✓ Verify"}

                              </button>


                              <button
                                className="secondary-button"
                                type="button"
                                disabled={
                                  adminActionId ===
                                  request.id
                                }
                                onClick={() =>
                                  handleRejectRequest(
                                    request.id
                                  )
                                }
                              >

                                ✕ Reject

                              </button>

                            </div>

                          )}


                          {/* VERIFIED */}

                          {isVerified && (

                            <div className="privacy-note">

                              ✓ This request has been verified
                              by a BloodBridge administrator.

                            </div>

                          )}


                          {/* REJECTED */}

                          {isRejected && (

                            <div className="privacy-note">

                              This request was rejected by a
                              BloodBridge administrator.

                            </div>

                          )}

                        </div>

                      );

                    }
                  )}

                </div>

              )}

          </div>

        </section>

      )}


      {/* ==================================================
          BLOOD REQUEST MODAL
      ================================================== */}

      {showRequestForm && (

        <section className="request-overlay">

          <div className="request-modal">

            <button
              className="close-button"
              onClick={closeRequestForm}
              aria-label="Close"
            >
              ×
            </button>


            <span className="eyebrow">
              FIND A DONOR
            </span>


            <h2>
              Request blood
            </h2>


            <p className="modal-description">
              Enter the patient's details and BloodBridge
              will find eligible nearby donors.
            </p>


            <form onSubmit={findDonors}>

              {/* PATIENT */}

              <label>
                Patient name
              </label>

              <input
                type="text"
                placeholder="Enter patient name"
                value={
                  requestData.patient_name
                }
                onChange={(event) =>
                  updateRequestData(
                    "patient_name",
                    event.target.value
                  )
                }
                required
              />


              {/* BLOOD GROUP */}

              <label>
                Blood group
              </label>

              <select
                value={
                  requestData.blood_group
                }
                onChange={(event) =>
                  updateRequestData(
                    "blood_group",
                    event.target.value
                  )
                }
              >

                <option value="O+">
                  O+
                </option>

                <option value="O-">
                  O-
                </option>

                <option value="A+">
                  A+
                </option>

                <option value="A-">
                  A-
                </option>

                <option value="B+">
                  B+
                </option>

                <option value="B-">
                  B-
                </option>

                <option value="AB+">
                  AB+
                </option>

                <option value="AB-">
                  AB-
                </option>

              </select>


              {/* CITY */}

              <label>
                City
              </label>

              <input
                type="text"
                value={
                  requestData.city
                }
                onChange={(event) =>
                  updateRequestData(
                    "city",
                    event.target.value
                  )
                }
                required
              />


              {/* LOCATION */}

              <div className="form-row">

                <div>

                  <label>
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={
                      requestData.latitude
                    }
                    onChange={(event) =>
                      updateRequestData(
                        "latitude",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                <div>

                  <label>
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={
                      requestData.longitude
                    }
                    onChange={(event) =>
                      updateRequestData(
                        "longitude",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>


              {/* UNITS */}

              <label>
                Units required
              </label>

              <input
                type="number"
                min="1"
                value={
                  requestData.units_required
                }
                onChange={(event) =>
                  updateRequestData(
                    "units_required",
                    event.target.value
                  )
                }
                required
              />


              {/* REQUEST SOURCE */}

              <label>
                Request source
              </label>

              <select
                value={requestData.source_type}
                onChange={(event) =>
                  updateRequestData(
                    "source_type",
                    event.target.value
                  )
                }
              >

                <option value="individual">
                  Individual
                </option>

                <option value="hospital">
                  Hospital
                </option>

                <option value="blood_bank">
                  Blood Bank
                </option>

              </select>


              {/* VERIFICATION INFORMATION */}

              <div className="privacy-note">

                ℹ Your request will be submitted as
                <strong> Pending </strong>
                and reviewed by a BloodBridge administrator.

              </div>


              {/* ERROR */}

              {requestError && (

                <div className="error-message">
                  {requestError}
                </div>

              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-button full"
                disabled={
                  requestLoading
                }
              >

                {requestLoading
                  ? "Submitting request..."
                  : "Find Matching Donors →"}

              </button>

            </form>


            {/* MATCH RESULTS */}

            {requestSubmitted && (

              <div className="match-results">

                {matches.length > 0 ? (

                  <>

                    <div className="match-header">

                      <h3>
                        Matching donors
                      </h3>

                      <span>
                        {matches.length} found
                      </span>

                    </div>


                    {matches.map(
                      (donor) => (

                        <div
                          className="match-card"
                          key={donor.id}
                        >

                          <div className="match-avatar">
                            🩸
                          </div>


                          <div className="match-info">

                            <strong>
                              {donor.name}
                            </strong>

                            <span>
                              {donor.blood_group}
                              {" · "}
                              {donor.city}
                            </span>

                            <small>
                              {donor.distance_km} km away
                            </small>


                            {donor.match_reason && (

                              <small>
                                ✓{" "}
                                {donor.match_reason}
                              </small>

                            )}

                          </div>


                          <span className="available-badge">
                            Available
                          </span>

                        </div>

                      )
                    )}


                    <div className="privacy-note">

                      🔒 Donor contact information
                      remains private until the donor
                      accepts the request.

                    </div>

                  </>

                ) : (

                  <div className="no-match">

                    <strong>
                      No eligible nearby donors found.
                    </strong>

                    <br />

                    Try another blood group or location.

                  </div>

                )}

              </div>

            )}

          </div>

        </section>

      )}


      {/* ==================================================
          DONOR REGISTRATION MODAL
      ================================================== */}

      {showDonorForm && (

        <section className="request-overlay">

          <div className="request-modal donor-registration-modal">

            <button
              className="close-button"
              onClick={closeDonorForm}
              aria-label="Close donor registration"
            >
              ×
            </button>


            <span className="eyebrow">
              BECOME A DONOR
            </span>


            <h2>
              Register as a donor
            </h2>


            <p className="modal-description">

              Welcome,{" "}
              <strong>
                {currentUser?.full_name}
              </strong>
              . Complete your donor profile to start
              receiving nearby blood requests.

            </p>


            {/* ACCOUNT INFORMATION */}

            <div className="privacy-note">

              ✓ Logged in as{" "}
              <strong>
                {currentUser?.email}
              </strong>

            </div>


            <form onSubmit={registerDonor}>

              {/* BLOOD GROUP */}

              <label>
                Blood group
              </label>

              <select
                value={
                  donorData.blood_group
                }
                onChange={(event) =>
                  updateDonorData(
                    "blood_group",
                    event.target.value
                  )
                }
              >

                <option value="O+">
                  O+
                </option>

                <option value="O-">
                  O-
                </option>

                <option value="A+">
                  A+
                </option>

                <option value="A-">
                  A-
                </option>

                <option value="B+">
                  B+
                </option>

                <option value="B-">
                  B-
                </option>

                <option value="AB+">
                  AB+
                </option>

                <option value="AB-">
                  AB-
                </option>

              </select>


              {/* CITY */}

              <label>
                City
              </label>

              <input
                type="text"
                placeholder="Enter your city"
                value={
                  donorData.city
                }
                onChange={(event) =>
                  updateDonorData(
                    "city",
                    event.target.value
                  )
                }
                required
              />


              {/* LOCATION */}

              <div className="form-row">

                <div>

                  <label>
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={
                      donorData.latitude
                    }
                    onChange={(event) =>
                      updateDonorData(
                        "latitude",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                <div>

                  <label>
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={
                      donorData.longitude
                    }
                    onChange={(event) =>
                      updateDonorData(
                        "longitude",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>


              {/* LAST DONATION */}

              <label>
                Last donation date
              </label>

              <input
                type="date"
                value={
                  donorData.last_donation_date
                }
                onChange={(event) =>
                  updateDonorData(
                    "last_donation_date",
                    event.target.value
                  )
                }
              />


              {/* PHONE */}

              <label>
                Phone number
              </label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={
                  donorData.phone
                }
                onChange={(event) =>
                  updateDonorData(
                    "phone",
                    event.target.value
                  )
                }
                required
              />


              {/* PRIVACY */}

              <div className="privacy-note">

                🔒 Your phone number will remain private
                and will only be revealed after you accept
                a matched blood request.

              </div>


              {/* ERROR */}

              {donorError && (

                <div className="error-message">
                  {donorError}
                </div>

              )}


              {/* SUCCESS */}

              {donorSuccess && (

                <div className="form-success">

                  ✓ {donorSuccess}

                </div>

              )}


              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-button full"
                disabled={
                  donorLoading
                }
              >

                {donorLoading
                  ? "Registering donor..."
                  : "Register as Donor →"}

              </button>

            </form>

          </div>

        </section>

      )}

    </div>
  );
}


/* ==================================================
   BLOOD CARD COMPONENT
================================================== */

function BloodCard({
  type,
  level,
  percentage,
}) {

  return (

    <div className="blood-card">

      <div className="blood-card-top">

        <div className="blood-type">

          <span>
            🩸
          </span>

          <strong>
            {type}
          </strong>

        </div>


        <span
          className={`urgency ${level.toLowerCase()}`}
        >
          {level}
        </span>

      </div>


      <div className="blood-number">

        {percentage}

        <small>
          %
        </small>

      </div>


      <div className="progress">

        <div
          style={{
            width: `${percentage}%`,
          }}
        ></div>

      </div>


      <small className="availability-text">
        Availability index
      </small>

    </div>

  );
}


/* ==================================================
   INFO CARD COMPONENT
================================================== */

function InfoCard({
  icon,
  title,
  text,
}) {

  return (

    <div className="info-card">

      <div className="info-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>

  );
}


/* ==================================================
   DRIVE CARD COMPONENT
================================================== */

function DriveCard({
  date,
  month,
  title,
  location,
}) {

  return (

    <div className="drive-card">

      <div className="date-box">

        <strong>
          {date}
        </strong>

        <span>
          {month}
        </span>

      </div>


      <div>

        <h3>
          {title}
        </h3>

        <p>
          📍 {location}
        </p>

      </div>


      <button type="button">
        →
      </button>

    </div>

  );
}


export default App;

