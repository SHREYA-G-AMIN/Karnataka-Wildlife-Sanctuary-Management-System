import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Animals from "./pages/Animals";
import Dashboard from "./Dashboard";
import Species from "./pages/Species.jsx";
import Officers from "./pages/Officers.jsx";
import Health from "./pages/Health.jsx";
import Poaching from "./pages/Poaching.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/species" element={<Species />} />
        <Route path="/officers" element={<Officers />} />
        <Route path="/health" element={<Health />} />
        <Route path="/poaching" element={<Poaching />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
