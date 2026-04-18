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

// Helper function to get animal emoji based on name
const getAnimalEmoji = (animalName) => {
  if (!animalName) return "🐾";
  const name = animalName.toLowerCase();
  if (name.includes("tiger")) return "🐯";
  if (name.includes("lion")) return "🦁";
  if (name.includes("elephant")) return "🐘";
  if (name.includes("leopard")) return "🐆";
  if (name.includes("deer")) return "🦌";
  if (name.includes("bear")) return "🐻";
  if (name.includes("python")) return "🐍";
  if (name.includes("langur")) return "🐵";
  if (name.includes("bison")) return "🐂";
  if (name.includes("peacock")) return "🦚";
  return "🐾";
};

// Helper function to get condition badge with wildlife theme colors
const getConditionBadge = (condition) => {
  if (!condition) return { label: "Unknown", color: "#6D8B74" };
  const lowerCondition = condition.toLowerCase();
  
  // Healthy conditions - dark green
  if (lowerCondition.includes("healthy") || lowerCondition === "healthy") {
    return { label: condition, color: "#2E7D32" };
  }
  
  // Minor issues - earth yellow
  if (
    lowerCondition.includes("minor") ||
    lowerCondition.includes("checkup") ||
    lowerCondition.includes("monitoring") ||
    lowerCondition.includes("routine") ||
    lowerCondition.includes("vaccination") ||
    lowerCondition.includes("update")
  ) {
    return { label: condition, color: "#C0A060" };
  }
  
  // Serious issues - soft red
  if (
    lowerCondition.includes("serious") ||
    lowerCondition.includes("infection") ||
    lowerCondition.includes("disorder") ||
    lowerCondition.includes("stress") ||
    lowerCondition.includes("parasitic") ||
    lowerCondition.includes("inflammation") ||
    lowerCondition.includes("injury") ||
    lowerCondition.includes("issues") ||
    lowerCondition.includes("pain") ||
    lowerCondition.includes("management")
  ) {
    return { label: condition, color: "#A94442" };
  }
  
  // Default - forest green (informational)
  return { label: condition, color: "#6D8B74" };
};

function Health() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
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

    const fetchHealth = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          park === "all"
            ? `${API_BASE_URL}/health`
            : `${API_BASE_URL}/health?sanctuary_id=${park}`;
        const res = await fetch(url);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid health response format");
        }
        const data = await res.json();

        if (!isMounted) return;
        if (res.ok && data?.success) {
          setRecords(Array.isArray(data?.data) ? data.data : []);
        } else {
          setRecords([]);
          setError(data?.message || "Failed to load health records");
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Health request failed:", err);
        setRecords([]);
        setError(err?.message || "Unable to connect to the server");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHealth();

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
          <li className="active">Health</li>
          <li>Poaching</li>
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
          <h2>Health Records</h2>

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
          <h2>Health Records</h2>
          <div className="table-wrap">
            <table className="animals-table">
              <thead>
                <tr>
                  <th>Animal & Sanctuary</th>
                  <th>Checkup Date</th>
                  <th>Condition</th>
                  <th>Treatment</th>
                  <th>Veterinarian</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan="5" className="table-feedback error-message">
                      {error}
                    </td>
                  </tr>
                ) : null}
                {!error && loading ? (
                  <tr>
                    <td colSpan="5" className="table-feedback">
                      Loading health records...
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && records.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-feedback">
                      No health records found.
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && records.map((record) => {
                  const conditionBadge = getConditionBadge(record?.condition);
                  const animalDisplay = record?.animal_name ? record.animal_name : "Unknown Animal";
                  const sanctuaryDisplay = record?.sanctuary_name || "Unknown Sanctuary";
                  
                  return (
                    <tr key={record?.health_id}>
                      <td>
                        <div className="animal-info">
                          <div className="animal-details">
                            <div className="animal-name">{animalDisplay}</div>
                            <div className="sanctuary-name">{sanctuaryDisplay}</div>
                          </div>
                        </div>
                      </td>
                      <td className="date-cell">{formatDate(record?.checkup_date)}</td>
                      <td>
                        <span
                          className="condition-badge"
                          style={{
                            backgroundColor: conditionBadge.color,
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            display: "inline-block",
                          }}
                        >
                          {conditionBadge.label}
                        </span>
                      </td>
                      <td>{record?.treatment || "-"}</td>
                      <td>{record?.vet_name || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Health;
