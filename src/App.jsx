import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [accessToken, setAccessToken] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // Try refreshing token on app load
  useEffect(() => {
    async function tryAutoLogin() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/refresh-token`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.access_token) {
          setAccessToken(data.access_token);
        } else {
          setAccessToken(""); // not logged in
        }
      } catch (err) {
        console.error("Auto-login failed:", err);
        setAccessToken("");
      } finally {
        setAuthChecked(true);
      }
    }

    tryAutoLogin();
  }, []);

  // Prevent routing until auth check is done
  if (!authChecked) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={accessToken ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login setAccessToken={setAccessToken} />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout accessToken={accessToken} setAccessToken={setAccessToken} />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute accessToken={accessToken}>
                <Dashboard accessToken={accessToken} setAccessToken={setAccessToken} />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute accessToken={accessToken}>
                <Profile accessToken={accessToken} setAccessToken={setAccessToken} />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
