import { Link } from "react-router-dom";
import "../index.css";

function Welcome() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome</h1>
        <p className="tagline">
          Login successful. You are now in the Wildlife Management System.
        </p>
        <Link className="login-btn" to="/dashboard">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
