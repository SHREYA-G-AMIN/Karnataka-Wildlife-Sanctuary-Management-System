import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      {/* 🔹 Navbar */}
      <div className="navbar">
        <h2>🌿 Wildlife System</h2>
        <div>
          <span>Welcome, Admin</span>
          <button onClick={() => navigate("/")}>Logout</button>
        </div>
      </div>

      {/* 🔹 Dashboard */}
      <div className="dashboard">

        {/* 📊 Cards */}
        <div className="cards">
          <div className="card">
            <h3>🐅 Animals</h3>
            <p>120</p>
          </div>

          <div className="card">
            <h3>🧬 Species</h3>
            <p>25</p>
          </div>

          <div className="card">
            <h3>🌱 Programs</h3>
            <p>5</p>
          </div>

          <div className="card">
            <h3>🚨 Incidents</h3>
            <p>8</p>
          </div>
        </div>

        {/* 📌 Modules */}
        <div className="modules">
          <h3>📌 Modules</h3>

          <div className="module-grid">
            <div className="module">Animals</div>
            <div className="module">Species</div>
            <div className="module">Forest Officers</div>
            <div className="module">Health Records</div>
            <div className="module">Poaching Incidents</div>
            <div className="module">Conservation Programs</div>
            <div className="module">Tourist Permits</div>
            <div className="module">Plants</div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Welcome;