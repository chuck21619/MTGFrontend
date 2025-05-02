import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import "./App.css";

export default function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || "");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setAccessToken={setAccessToken} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            accessToken
              ? <Dashboard accessToken={accessToken} setAccessToken={setAccessToken} />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}
