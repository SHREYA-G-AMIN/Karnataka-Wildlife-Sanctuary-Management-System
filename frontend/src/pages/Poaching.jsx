import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import { API_BASE_URL } from "../config";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Helper function to get status badge
const getStatusBadge = (status) => {
  if (!status) return { label: "Unknown", color: "#6D8B74" };
  const lowerStatus = status.toLowerCase();

  if (lowerStatus === "open") {
    return { label: status, color: "#A94442" }; // Red
  }
  if (lowerStatus === "investigating") {
    return { label: status, color: "#C0A060" }; // Earth yellow
  }
  if (lowerStatus === "resolved") {
    return { label: status, color: "#2E7D32" }; // Green
  }
  return { label: status, color: "#6D8B74" }; // Default forest green
};

function Poaching() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [parks, setParks] = useState([]);
  const [park, setPark] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchParks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/parks`);
        const data = await res.json();

        if (!isMounted) return;
        if (res.ok && data?.success) {
          setParks(Array.isArray(data?.data) ? data.data : []);
        } else {
          setParks([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Parks request failed:", err);
        setParks([]);
      }
    };

    fetchParks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPoaching = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          park === "all"
            ? `${API_BASE_URL}/poaching`
            : `${API_BASE_URL}/poaching?sanctuary_id=${park}`;
        const res = await fetch(url);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid poaching response format");
        }
        const data = await res.json();

        if (!isMounted) return;
        if (res.ok && data?.success) {
          setIncidents(Array.isArray(data?.data) ? data.data : []);
        } else {
          setIncidents([]);
          setError(data?.message || "Failed to load poaching incidents");
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Poaching request failed:", err);
        setIncidents([]);
        setError(err?.message || "Unable to connect to the server");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPoaching();

    return () => {
      isMounted = false;
    };
  }, [park]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="logo">Wildlife</h2>

        <ul>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/species")}>Species</li>
          <li onClick={() => navigate("/animals")}>Animals</li>
          <li onClick={() => navigate("/officers")}>Officers</li>
          <li onClick={() => navigate("/health")}>Health</li>
          <li className="active">Poaching</li>
          <li
            className="logout"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("role");
              navigate("/login");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="main">
        <div className="navbar">
          <h2>Poaching Activities</h2>

          <select
            value={park}
            onChange={(e) => setPark(e.target.value)}
            className="park-select"
          >
            <option value="all">All Parks</option>
            {parks.map((parkOption) => (
              <option key={parkOption?.id} value={parkOption?.id}>
                {parkOption?.name}
              </option>
            ))}
          </select>

          <div className="user">
            <div className="avatar">T</div>
            <span>Tourist</span>
          </div>
        </div>

        <div className="activity">
          <h2>Poaching Incidents</h2>
          <div className="poaching-grid">
            {error ? (
              <div className="error-card">
                <p>{error}</p>
              </div>
            ) : null}
            {!error && loading ? (
              <div className="loading-card">
                <p>Loading poaching incidents...</p>
              </div>
            ) : null}
            {!error && !loading && incidents.length === 0 ? (
              <div className="empty-card">
                <p>No poaching incidents found.</p>
              </div>
            ) : null}
            {!error && !loading && incidents.map((incident) => {
              const statusBadge = getStatusBadge(incident?.status);
              return (
                <div key={incident?.incident_id} className="poaching-card">
                  <div className="card-header">
                    <h3>🚨 Poaching Incident</h3>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: statusBadge.color,
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {statusBadge.label}
                    </span>
                  </div>
                  <div className="card-content">
                    <div className="animal-target">
                      <span className="label">🐾 Animal Targeted:</span>
                      <span className="value">{incident?.animal_targeted || "Unknown"}</span>
                    </div>
                    <div className="location">
                      <span className="label">📍 Location:</span>
                      <span className="value">{incident?.location || "Unknown"}, {incident?.sanctuary_name || "Unknown Sanctuary"}</span>
                    </div>
                    <div className="date">
                      <span className="label">📅 Date:</span>
                      <span className="value">{formatDate(incident?.date)}</span>
                    </div>
                    <div className="description">
                      <span className="label">📝 Description:</span>
                      <p className="description-text">{incident?.description || "No description available"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Poaching;
