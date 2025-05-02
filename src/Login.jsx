import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.MODE === "development"
  ? "http://localhost:8080"
  : "https://mtgbackend.onrender.com";

export default function Login({ setAccessToken }) {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", username);
      setAccessToken(data.access_token);
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input name="username" type="text" placeholder="Username" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <a href="/register">Don't have an account? Register</a>
    </div>
  );
}
