import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import { API_BASE_URL } from "../config";

function Species() {
  const navigate = useNavigate();
  const [species, setSpecies] = useState([]);
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

    const fetchSpecies = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          park === "all"
            ? `${API_BASE_URL}/species`
            : `${API_BASE_URL}/species?sanctuary_id=${park}`;
        const res = await fetch(url);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid species response format");
        }

        const data = await res.json();
        if (!isMounted) return;

        if (res.ok && data?.success) {
          setSpecies(Array.isArray(data?.data) ? data.data : []);
        } else {
          setSpecies([]);
          setError(data?.message || "Failed to load species");
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Species request failed:", err);
        setSpecies([]);
        setError(err?.message || "Unable to connect to the server");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSpecies();

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
          <li className="active">Species</li>
          <li onClick={() => navigate("/animals")}>Animals</li>
          <li>Officers</li>
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
          <h2>Species</h2>

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
          <h2>Species Table</h2>
          <div className="table-wrap">
            <table className="animals-table">
              <thead>
                <tr>
                  <th>Species</th>
                  <th>Category</th>
                  <th>Sanctuary</th>
                  <th>Animals Count</th>
                  <th>Under Care</th>
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
                      Loading species...
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && species.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-feedback">
                      No species found for the selected park.
                    </td>
                  </tr>
                ) : null}
                {!error && !loading && species.map((item) => (
                  <tr key={`${item?.species_id}-${item?.sanctuary_id}`}>
                    <td>{item?.species_name || "-"}</td>
                    <td>{item?.category || "-"}</td>
                    <td>{item?.sanctuary_name || "-"}</td>
                    <td>{item?.animal_count ?? 0}</td>
                    <td>{item?.under_care ?? 0}</td>
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

export default Species;
