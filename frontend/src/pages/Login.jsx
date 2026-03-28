import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      navigate("/welcome");
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>🌿 Bandipur Wildlife</h1>
        <p className="tagline">
          Empowering Wildlife Conservation Through Data
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default Login;