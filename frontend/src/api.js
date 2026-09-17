const API_BASE_URL = "http://127.0.0.1:8000";


// ======================================================
// COMMON API REQUEST FUNCTION
// ======================================================

async function request(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
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
        "Unable to connect to BloodBridge server. Please make sure the backend is running."
      );
    }

    throw error;
  }
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

export async function getDashboard(donorId) {
  return request(`/notifications/dashboard/${donorId}`);
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

export async function getAcceptedContact(notificationId) {
  return request(
    `/notifications/${notificationId}/contact`
  );
}

