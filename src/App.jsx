import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

export default function App() {
  const [accessToken, _setAccessToken] = useState(localStorage.getItem("access_token") || "");
  const setAccessToken = (newToken) => {
    localStorage.setItem("access_token", newToken);
    _setAccessToken(newToken);
  };
  useEffect(() => {
    localStorage.setItem("access_token", accessToken);
  }, [accessToken]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setAccessToken={setAccessToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute accessToken={accessToken}>
              <Dashboard accessToken={accessToken} setAccessToken={setAccessToken} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
