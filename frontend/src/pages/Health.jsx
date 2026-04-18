import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import { API_BASE_URL } from "../config";

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
                  <th>Animal ID / Name</th>
                  <th>Checkup Date</th>
                  <th>Condition</th>
                  <th>Treatment</th>
                  <th>Vet Name</th>
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
                {!error && !loading && records.map((record) => (
                  <tr key={record?.health_id}>
                    <td>
                      {record?.animal_id || "-"} / {record?.animal_name || "-"}
                    </td>
                    <td>{record?.checkup_date || "-"}</td>
                    <td>{record?.condition || "-"}</td>
                    <td>{record?.treatment || "-"}</td>
                    <td>{record?.vet_name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Health;
