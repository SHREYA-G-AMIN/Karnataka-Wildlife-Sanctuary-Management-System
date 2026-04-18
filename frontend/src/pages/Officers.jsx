import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import { API_BASE_URL } from "../config";

function Officers() {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
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

    const fetchOfficers = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          park === "all"
            ? `${API_BASE_URL}/officers`
            : `${API_BASE_URL}/officers?sanctuary_id=${park}`;
        const res = await fetch(url);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid officers response format");
        }
        const data = await res.json();

        if (!isMounted) return;
        if (res.ok && data?.success) {
          setOfficers(Array.isArray(data?.data) ? data.data : []);
        } else {
          setOfficers([]);
          setError(data?.message || "Failed to load officers");
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Officers request failed:", err);
        setOfficers([]);
        setError(err?.message || "Unable to connect to the server");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOfficers();

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
          <li className="active">Officers</li>
          <li>Health</li>
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
          <h2>Forest Officers</h2>

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
          <h2>Officer Directory</h2>
          <div className="table-wrap">
            <table className="animals-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Experience</th>
                  <th>Sanctuary</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan="4" className="table-feedback error-message">
                      {error}
                    </td>
                  </tr>
                ) : null}
                {!error && loading ? (
                  <tr>
                    <td colSpan="4" className="table-feedback">
                      Loading officers...
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && officers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="table-feedback">
                      No officers found for the selected sanctuary.
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && officers.map((officer) => (
                  <tr key={officer?.officer_id}>
                    <td>{officer?.name || "-"}</td>
                    <td>{officer?.designation || "-"}</td>
                    <td>{officer?.experience ?? 0} yrs</td>
                    <td>{officer?.sanctuary_name || "-"}</td>
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

export default Officers;
