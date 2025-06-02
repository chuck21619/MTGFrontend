import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard({ accessToken, setAccessToken }) {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");
  const decoded = jwtDecode(accessToken || "");
  const username = decoded?.username || "Unknown";

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setAccessToken("");
    navigate("/login");
    alert("You have been logged out.");
  };

  const handleUpdateEmail = async () => {
    if (!accessToken || !newEmail.trim()) {
      alert("Please log in and enter a valid email.");
      return;
    }

    const res = await authFetch(`${BACKEND_URL}/api/update-email`, {
      method: "POST",
      body: JSON.stringify({ new_email: newEmail }),
    });

    const data = await res.json();
    alert(data.message || "No response message.");
  };

  const handleUpdateGoogleSheet = async () => {
    if (!accessToken || !sheetUrl.trim()) {
      alert("Please log in and enter a valid link.");
      return;
    }

    const res = await authFetch(`${BACKEND_URL}/api/update-google-sheet`, {
      method: "POST",
      body: JSON.stringify({ new_google_sheet: sheetUrl }),
    });

    const data = await res.json();
    alert(data.message || "No response message.");
  };

  async function authFetch(url, options = {}, retry = true) {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401 && retry) {
      const refreshRes = await fetch(`${BACKEND_URL}/api/refresh-token`, {
        method: "POST",
        credentials: "include",
      });

      const refreshData = await refreshRes.json();
      if (refreshRes.ok && refreshData.access_token) {
        setAccessToken(refreshData.access_token);
        return authFetch(url, options, false);
      } else {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
    }

    return res;
  }

  return (
    <>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <div className="dashboard-container">
        <h2>Welcome to your dashboard!</h2>

        <div>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="dashboard-input"
          />
          <br />
          <button onClick={handleUpdateEmail} className="update-button">
            Update Email
          </button>
        </div>
        <div>
          <label htmlFor="sheet-url">Google Sheet URL:</label>
          <input
            id="sheet-url"
            type="text"
            placeholder="Enter your sheet URL"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <button onClick={handleUpdateGoogleSheet}>Link Sheet</button>
        </div>

      </div>
    </>
  );

}
