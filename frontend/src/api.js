const API_BASE_URL = "https://bloodbridge-1-elsg.onrender.com";

// ======================================================
// ACCESS TOKEN
// ======================================================

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}


// ======================================================
// COMMON API REQUEST FUNCTION
// ======================================================

async function request(url, options = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // Add JWT access token when available
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Try to read JSON response
    let data;

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    // Handle API errors
    if (!response.ok) {
      throw new Error(
        data.detail ||
        data.message ||
        `Request failed with status ${response.status}`
      );
    }

    return data;

  } catch (error) {
    // Network / server connection error
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to BloodBridge server. Please try again."
      );
    }

    throw error;
  }
}


// ======================================================
// AUTHENTICATION
// ======================================================

// Register a new user
export async function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}


// Login user
export async function loginUser(credentials) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store short-lived access token in memory
  if (data?.access_token) {
    setAccessToken(data.access_token);
  }

  return data;
}


// Refresh access token
export async function refreshAccessToken(refreshToken) {
  const data = await request("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (data?.access_token) {
    setAccessToken(data.access_token);
  }

  return data;
}


// Logout user
export async function logoutUser(refreshToken) {
  const data = await request("/auth/logout", {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  clearAccessToken();

  return data;
}


// ======================================================
// DONORS
// ======================================================

// Register a new donor
export async function createDonor(donorData) {
  return request("/donors/", {
    method: "POST",
    body: JSON.stringify(donorData),
  });
}


// Get all donors
export async function getDonors() {
  return request("/donors/");
}


// Get a specific donor
export async function getDonor(donorId) {
  return request(`/donors/${donorId}`);
}


// ======================================================
// BLOOD REQUESTS
// ======================================================

// Create a new blood request
export async function createBloodRequest(requestData) {
  return request("/requests/", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}


// Get all blood requests
export async function getBloodRequests() {
  return request("/requests/");
}


// Get a specific blood request
export async function getBloodRequest(requestId) {
  return request(`/requests/${requestId}`);
}


// ======================================================
// NOTIFICATIONS
// ======================================================

// Get all notifications
export async function getNotifications() {
  return request("/notifications/");
}


// Get dashboard using donor ID
export async function getDashboard(donorId) {
  return request(`/notifications/dashboard/${donorId}`);
}


// Get logged-in donor's dashboard
export async function getMyDashboard() {
  return request("/notifications/dashboard/me");
}


// Accept a blood request notification
export async function acceptNotification(notificationId) {
  return request(
    `/notifications/${notificationId}/accept`,
    {
      method: "POST",
    }
  );
}


// Get contact details after acceptance
export async function getAcceptedContact(notificationId) {
  return request(
    `/notifications/${notificationId}/contact`
  );
}