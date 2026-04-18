import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import { API_BASE_URL } from "../config";

function Animals() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
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

    const fetchAnimals = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          park === "all"
            ? `${API_BASE_URL}/animals`
            : `${API_BASE_URL}/animals?sanctuary_id=${park}`;
        const res = await fetch(url);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid animals response format");
        }
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data?.success) {
          setAnimals(Array.isArray(data?.data) ? data.data : []);
        } else {
          setAnimals([]);
          setError(data?.message || "Failed to load animals");
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Animals request failed:", err);
        setAnimals([]);
        setError(err?.message || "Unable to connect to the server");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnimals();

    return () => {
      isMounted = false;
    };
  }, [park]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">Wildlife</h2>

        <ul>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/species")}>Species</li>
          <li className="active">Animals</li>
          <li onClick={() => navigate("/officers")}>Officers</li>
          <li onClick={() => navigate("/health")}>Health</li>
          <li onClick={() => navigate("/poaching")}>Poaching</li>
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

      {/* MAIN */}
      <div className="main">
        <div className="navbar">
          <h2>Animals</h2>

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
          <h2>Animals Table</h2>
          <div className="table-wrap">
            <table className="animals-table">
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Species</th>
                  <th>Category</th>
                  <th>Sanctuary</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan="7" className="table-feedback error-message">
                      {error}
                    </td>
                  </tr>
                ) : null}
                {!error && loading ? (
                  <tr>
                    <td colSpan="7" className="table-feedback">
                      Loading animals...
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && animals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="table-feedback">
                      No animals found for the selected park.
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && animals.map((a) => (
                  <tr key={a.animal_id}>
                    <td>{a?.animal_name || "-"}</td>
                    <td>{a?.species_name || "-"}</td>
                    <td>{a?.species_category || "-"}</td>
                    <td>{a?.sanctuary_name || "-"}</td>
                    <td>{a?.age ?? "-"}</td>
                    <td>{a?.gender || "-"}</td>
                    <td>{a?.health_status || "-"}</td>
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

export default Animals;
