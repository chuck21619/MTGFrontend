import { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Profile({ accessToken, setAccessToken }) {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [sheetUrl, setSheetUrl] = useState("");

  useEffect(() => {
    getProfileInfo();
  }, []);

  const getProfileInfo = async () => {
    const res = await authFetch(
      `${BACKEND_URL}/api/profileInfo`,
      {
        method: "GET",
      },
      {
        accessToken,
        setAccessToken,
        navigate,
        backendUrl: BACKEND_URL,
      }
    );

    const data = await res.json();

    setNewEmail(data.email || "");
    setSheetUrl(data.googleSheetUrl || "");
  };

  const handleUpdateGoogleSheet = async () => {
    if (!accessToken || !sheetUrl.trim()) {
      alert("Please log in and enter a valid link.");
      return;
    }

    const res = await authFetch(
      `${BACKEND_URL}/api/update-google-sheet`,
      {
        method: "POST",
        body: JSON.stringify({ new_google_sheet: sheetUrl }),
      },
      {
        accessToken,
        setAccessToken,
        navigate,
        backendUrl: BACKEND_URL,
      }
    );

    const data = await res.json();
    alert(data.message || "No response message.");
  };

  const handleUpdateEmail = async () => {
    if (!accessToken || !newEmail.trim()) {
      alert("Please log in and enter a valid email.");
      return;
    }

    const res = await authFetch(
      `${BACKEND_URL}/api/update-email`,
      {
        method: "POST",
        body: JSON.stringify({ new_email: newEmail }),
      },
      {
        accessToken,
        setAccessToken,
        navigate,
        backendUrl: BACKEND_URL,
      }
    );

    const data = await res.json();
    alert(data.message || "No response message.");
  };

  return (
    <>
      <h2>Profile</h2>
      <div>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email"
          className="dashboard-input"
        />
        <button onClick={handleUpdateEmail}>Update Email</button>
      </div>
      <div>
        <input
          id="sheet-url"
          type="text"
          placeholder="Enter your sheet URL"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
        />
        <button onClick={handleUpdateGoogleSheet}>Link Sheet</button>
      </div>
    </>
  );
}
