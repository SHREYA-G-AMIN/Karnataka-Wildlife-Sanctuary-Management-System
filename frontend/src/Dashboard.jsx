import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { API_BASE_URL } from "./config";

function Dashboard() {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [park, setPark] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(false);

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

  // Get hero background with fallback
  const getHeroBackground = () => {
    const imageUrl = selectedPark?.image;
    if (imageUrl && imageUrl.trim() !== "") {
      return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imageUrl}) center/cover`;
    }
    // Fallback to a nature-themed gradient
    return `linear-gradient(135deg, rgba(46, 125, 50, 0.8), rgba(76, 175, 80, 0.8)), linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))`;
  };

  // Fetch Conservation Programs when park changes
  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      if (!selectedPark?.id) {
        setPrograms([]);
        return;
      }

      setProgramsLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/programs?sanctuary_id=${selectedPark.id}`);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid programs response format");
        }
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data?.success) {
          const list = Array.isArray(data?.data) ? data.data : [];
          setPrograms(list);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        if (!isMounted) return;

        console.log("Programs request failed:", err);
        setPrograms([]);
      } finally {
        if (isMounted) {
          setProgramsLoading(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, [selectedPark?.id]);

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
  <li onClick={() => navigate("/health")}>Health</li>
  <li onClick={() => navigate("/poaching")}>Poaching</li>
  <li className="logout" onClick={(e) => { e.preventDefault(); localStorage.removeItem("user"); localStorage.removeItem("role"); navigate("/login"); }}>Logout</li>
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
            background: getHeroBackground(),
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

        {/* CONSERVATION PROGRAMS */}
        <div className="activity" style={{ marginTop: "25px" }}>
          <h2>🌱 Conservation Programs</h2>

          {programsLoading ? (
            <div className="status-message">Loading programs...</div>
          ) : programs.length === 0 ? (
            <div className="status-message">No programs available for this sanctuary.</div>
          ) : (
            <div className="programs-list">
              {programs.map((program) => (
                <div key={program.id} className="program-card">
                  <div className="program-header">
                    <h3>{program.name}</h3>
                    <span className={`program-status status-${program.status.toLowerCase()}`}>
                      {program.status}
                    </span>
                  </div>
                  <p className="program-date">
                    📅 Started: {new Date(program.start_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        

      </div>
      
  </div>

      
    
  );
}

export default Dashboard;
