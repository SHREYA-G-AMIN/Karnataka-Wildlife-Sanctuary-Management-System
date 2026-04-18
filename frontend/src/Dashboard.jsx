import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { API_BASE_URL } from "./config";

function Dashboard() {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [park, setPark] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchParks = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE_URL}/parks`);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid parks response format");
        }
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data?.success) {
          const list = Array.isArray(data?.data) ? data.data : [];
          setParks(list);
          if (list.length > 0) {
            setPark((prev) => prev || list[0]?.name || "");
          }
        } else {
          setParks([]);
          setError(data?.message || "Failed to load parks");
        }
      } catch (err) {
        if (!isMounted) return;

        console.log("Parks request failed:", err);
        setParks([]);
        setError(err?.message || "Unable to connect to the server");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchParks();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedPark = parks.find((p) => p?.name === park) || parks[0];

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">Wildlife</h2>

        <ul>
  <li className="active">Dashboard</li>
  <li onClick={() => navigate("/species")}>Species</li>
  <li onClick={() => navigate("/animals")}>Animals</li>
  <li onClick={() => navigate("/officers")}>Officers</li>
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
            disabled={loading || parks.length === 0}
          >
            {parks.map((p) => (
              <option key={p?.id || p?.name} value={p?.name}>
                {p?.name}
              </option>
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
          <h1>{selectedPark?.name || "Wildlife Park"}</h1>
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
            <p>{loading ? "..." : selectedPark?.animals ?? "-"}</p>
          </div>

          <div className="card">
            <h3>Total Species</h3>
            <p>{loading ? "..." : selectedPark?.species ?? "-"}</p>
          </div>

          <div className="card">
            <h3>Endangered</h3>
            <p>{loading ? "..." : selectedPark?.endangered ?? "-"}</p>
          </div>

          <div className="card">
            <h3>Poaching Cases</h3>
            <p>{loading ? "..." : selectedPark?.poaching ?? "-"}</p>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="activity">
          <h2>Recent Activity</h2>

          {error ? <div className="status-message error-message">{error}</div> : null}
          {!error && loading ? <div className="status-message">Loading park data...</div> : null}
          {!error && !loading && (selectedPark?.activity || []).length === 0 ? (
            <div className="status-message">No recent activity available.</div>
          ) : null}

          {!error &&
            !loading &&
            (selectedPark?.activity || []).map((item, index) => (
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
