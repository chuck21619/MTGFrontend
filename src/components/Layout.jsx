import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

export async function handleLogout(accessToken, setAccessToken, navigate, BACKEND_URL) {
  try {
    const decoded = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;
    const username = decoded?.username || "Unknown";

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
}


export default function Layout({ accessToken, setAccessToken }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="sidebar">
        <nav>
          <ul>
            <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
            <li><NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink></li>
          </ul>
        </nav>
        <button onClick={() => handleLogout(accessToken, setAccessToken, navigate, BACKEND_URL)} className="nav-button" >
          Logout
        </button>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
