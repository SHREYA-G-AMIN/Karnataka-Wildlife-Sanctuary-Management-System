import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const parksData = {
    "Bandipur National Park": {
      location: "Karnataka",
      area: "874 sq km",
      famous: "Tigers & Elephants",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
      animals: 120,
      species: 45,
      endangered: 10,
      poaching: 5,
      activity: [
        "🚨 Poaching reported in Zone A",
        "🐅 Tiger treated for injury",
        "🐘 Elephant migration tracked",
        "🌿 New species recorded in Zone B",
      ],
    },
    "Nagarhole National Park": {
      location: "Karnataka",
      area: "643 sq km",
      famous: "Leopards & Deer",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
      animals: 95,
      species: 38,
      endangered: 8,
      poaching: 3,
      activity: [
        "🐆 Leopard spotted in Zone C",
        "🌿 Forest regeneration program started",
        "🚨 Illegal entry detected",
      ],
    }
  };

  const [park, setPark] = useState("Bandipur National Park");
  const selectedPark = parksData[park];

  // 🔐 Protect route
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) navigate("/login");
  }, [navigate]);

  // 🚪 Logout
  const handleLogout = () => {
    const confirm = window.confirm("Logout?");
    if (confirm) {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">🌿 Wildlife</h2>

        <ul>
          <li className="active">🏠 Dashboard</li>
          <li>🐾 Species</li>
          <li>🦁 Animals</li>
          <li>👮 Officers</li>
          <li>💉 Health</li>
          <li>🚨 Poaching</li>

          {/* LOGOUT */}
          <li className="logout" onClick={handleLogout}>
            🚪 Logout
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* NAVBAR */}
        <div className="navbar">
          <h2>🌿 Wildlife Management</h2>

          <select
            value={park}
            onChange={(e) => setPark(e.target.value)}
            className="park-select"
          >
            {Object.keys(parksData).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <div className="user">
            <div className="avatar">T</div>
            <span>Tourist</span>
          </div>
        </div>

        {/* HERO */}
        <div
          className="hero"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${selectedPark.image}) center/cover`,
          }}
        >
          <h1>{park}</h1>
          <p>Famous for {selectedPark.famous}</p>

          <div className="hero-details">
            <span>📍 {selectedPark.location}</span>
            <span>🌳 {selectedPark.area}</span>
            <span>🐅 {selectedPark.famous}</span>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="card"><h3>🐾 Animals</h3><p>{selectedPark.animals}</p></div>
          <div className="card"><h3>🌿 Species</h3><p>{selectedPark.species}</p></div>
          <div className="card"><h3>⚠️ Endangered</h3><p>{selectedPark.endangered}</p></div>
          <div className="card"><h3>🚨 Poaching</h3><p>{selectedPark.poaching}</p></div>
        </div>

        {/* ACTIVITY */}
        <div className="activity">
          <h2>🔥 Recent Activity</h2>
          {selectedPark.activity.map((item, i) => (
            <div key={i} className="activity-item">{item}</div>
          ))}
        </div>

        {/* FOOTER (FIXED POSITION) */}
        <div className="footer">
          <div className="footer-content">
            <div>
              <h3>Wildlife Protection System</h3>
              <p>Protecting biodiversity 🌍</p>
            </div>
            <div>
              <p>© 2026</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
