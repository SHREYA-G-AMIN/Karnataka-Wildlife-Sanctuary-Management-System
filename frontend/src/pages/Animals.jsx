import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

function Animals() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [park, setPark] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchAnimals = async () => {
      try {
        const url =
          park === "all"
            ? "http://localhost:5000/animals"
            : `http://localhost:5000/animals?sanctuary_id=${park}`;
        const res = await fetch(url);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return;
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data?.success) {
          setAnimals(Array.isArray(data.data) ? data.data : []);
        } else {
          setAnimals([]);
        }
      } catch (err) {
        console.log("Animals request failed:", err);
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
          <li>Species</li>
          <li className="active">Animals</li>
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
            <option value="1">Bandipur</option>
            <option value="2">Nagarhole</option>
            <option value="3">Bannerghatta</option>
            <option value="4">Kudremukh</option>
            <option value="5">Anshi</option>
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
                  <th>Animal ID</th>
                  <th>Species</th>
                  <th>Sanctuary</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((a) => (
                  <tr key={a.animal_id}>
                    <td>{a.animal_name}</td>
                    <td>{a.species_name}</td>
                    <td>{a.sanctuary_name}</td>
                    <td>{a.age}</td>
                    <td>{a.gender}</td>
                    <td>{a.health_status}</td>
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
