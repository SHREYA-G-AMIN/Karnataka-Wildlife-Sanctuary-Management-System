import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../index.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (parseErr) {
        data = null;
      }
      console.log("Login response:", res.status, data ?? raw);

      if (res.ok && data?.success) {
        localStorage.setItem("user", email);
        navigate("/welcome");
      } else {
        setError((data && data.message) || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login request failed:", err);
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
          {/* Email */}
          <div className="input-group">
            <FaUserAlt className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
