import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [park, setPark] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchParks = async () => {
      try {
        const res = await fetch("http://localhost:5000/parks");
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          console.log("Parks response is not JSON");
          return;
        }
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data?.success) {
          const list = Array.isArray(data.data) ? data.data : [];
          setParks(list);
          if (list.length > 0) {
            setPark((prev) => prev || list[0].name);
          }
        } else {
          console.log("Failed to load parks");
        }
      } catch (err) {
        console.log("Parks request failed:", err);
      }
    };

    fetchParks();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPark = parks.find((p) => p.name === park);

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">Wildlife</h2>

        <ul>
  <li className="active">Dashboard</li>
  <li>Species</li>
  <li onClick={() => navigate("/animals")}>Animals</li>
  <li>Officers</li>
  <li>Health</li>
  <li>Poaching</li>
  <li className="logout" onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("role"); navigate("/login"); }}>Logout</li>
</ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* NAVBAR */}
        <div className="navbar">
          <h2>Wildlife Management</h2>

          <select
            value={park}
            onChange={(e) => setPark(e.target.value)}
            className="park-select"
          >
            {parks.map((p) => (
              <option key={p.id || p.name}>{p.name}</option>
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
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${selectedPark?.image || ""}) center/cover`,
          }}
        >
          <h1>{park || "Wildlife Park"}</h1>
          <p>
            Famous for {selectedPark?.famous || "wildlife"} and rich biodiversity.
          </p>

          <div className="hero-details">
            <span>{selectedPark?.location || "-"}</span>
            <span>{selectedPark?.area || "-"}</span>
            <span>{selectedPark?.famous || "-"}</span>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="card">
            <h3>Total Animals</h3>
            <p>{selectedPark?.animals ?? "-"}</p>
          </div>

          <div className="card">
            <h3>Total Species</h3>
            <p>{selectedPark?.species ?? "-"}</p>
          </div>

          <div className="card">
            <h3>Endangered</h3>
            <p>{selectedPark?.endangered ?? "-"}</p>
          </div>

          <div className="card">
            <h3>Poaching Cases</h3>
            <p>{selectedPark?.poaching ?? "-"}</p>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="activity">
          <h2>Recent Activity</h2>

          {(selectedPark?.activity || []).map((item, index) => (
            <div key={index} className="activity-item">
              {item}
            </div>
          ))}
        </div>
        

      </div>
      
  </div>

      
    
  );
}

export default Dashboard;
