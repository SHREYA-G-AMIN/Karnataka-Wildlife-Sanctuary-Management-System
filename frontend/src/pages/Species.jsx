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

  const extraSpecies = [
    {
      species_id: "extra-1",
      species_name: "Gaur",
      category: "Mammal",
      image_url:
        "https://images.unsplash.com/photo-1607649266416-a77a215d23c8?auto=format&fit=crop&w=900&q=80",
    },
    {
      species_id: "extra-2",
      species_name: "Sambar Deer",
      category: "Mammal",
      image_url:
        "https://images.unsplash.com/photo-1522441815190-34a3d3ddbb84?auto=format&fit=crop&w=900&q=80",
    },
    {
      species_id: "extra-3",
      species_name: "King Cobra",
      category: "Reptile",
      image_url:
        "https://images.unsplash.com/photo-1586287011602-530d223fa0b5?auto=format&fit=crop&w=900&q=80",
    },
    {
      species_id: "extra-4",
      species_name: "Hornbill",
      category: "Bird",
      image_url:
        "https://images.unsplash.com/photo-1496345961004-90fa4ecbd7a9?auto=format&fit=crop&w=900&q=80",
    },
    {
      species_id: "extra-5",
      species_name: "Cheetah",
      category: "Mammal",
      image_url:
        "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const displayedSpecies = [
    ...species,
    ...extraSpecies.filter(
      (item) => !species.some((existing) => existing.species_name === item.species_name)
    ),
  ];

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
          <h2>Species Gallery</h2>

          {error ? (
            <div className="status-message error-message">{error}</div>
          ) : null}

          {!error && loading ? (
            <div className="status-message">Loading species...</div>
          ) : null}

          {!error && !loading && species.length === 0 ? (
            <div className="status-message">
              No species found for the selected park.
            </div>
          ) : null}

          {!error && !loading && displayedSpecies.length > 0 ? (
            <div className="species-grid">
              {displayedSpecies.map((item) => (
                <div key={item?.species_id} className="species-card">
                  <div className="species-image-wrapper">
                    <img
                      src={
                        item?.image_url ||
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={item?.species_name || "Species"}
                    />
                  </div>
                  <div className="species-content">
                    <h3>{item?.species_name || "Unknown"}</h3>
                    <p>{item?.category || "Unknown category"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Species;
