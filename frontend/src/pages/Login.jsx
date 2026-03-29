import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../index.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // store role (optional but useful)
        localStorage.setItem("role", data.role);

        // 🔀 Redirect based on role
        if (data.role === "admin") {
          navigate("/dashboard");
        } else if (data.role === "officer") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Server not responding");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🌿 Karnataka Wildlife Parks</h1>
        <p className="tagline">
          Empowering Wildlife Conservation Through Data
        </p>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="input-group">
            <FaUserAlt className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Error Message */}
          {error && <p className="error">{error}</p>}

          {/* Button */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;