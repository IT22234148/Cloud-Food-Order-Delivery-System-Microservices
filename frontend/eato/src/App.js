import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StripeCheckout from "./components/StripeCheckout";

function App() {
  return (
    <Router>
      {/* <nav style={{ marginBottom: "30px", textAlign: "center" }}>
        <Link to="/register" style={{ marginRight: "20px", textDecoration: "none", color: "#ff69b4" }}>Register</Link>
        <Link to="/login" style={{ textDecoration: "none", color: "#ff69b4" }}>Login</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<StripeCheckout />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

//Done
