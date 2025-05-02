import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8080"
  : "https://mtgbackend.onrender.com";

export default function Dashboard({ accessToken, setAccessToken }) {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

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

    localStorage.removeItem("access_token");
    setAccessToken("");
    navigate("/login");
    alert("You have been logged out.");
  };

  const handleUpdateEmail = async () => {
    const newEmail = document.getElementById("newEmailInput").value.trim();
    if (!accessToken || !newEmail) {
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

  async function authFetch(url, options = {}, retry = true) {
    let token = localStorage.getItem("access_token");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
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
        localStorage.setItem("access_token", refreshData.access_token);
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
    <div>
      <h2>Welcome to your dashboard!</h2>
      <button onClick={() => console.log("Fetch secret message here")}>
        Fetch Secret Message
      </button>
      <div>
        <h3>Update Email</h3>
        <input id="newEmailInput" type="email" placeholder="Enter new email" />
        <button onClick={handleUpdateEmail}>Update Email</button>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
