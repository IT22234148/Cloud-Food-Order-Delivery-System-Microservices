import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import StripeCheckout from "./components/StripeCheckout";
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import AddRestaurant from './pages/restaurant/AddRestaurant';
import EditRestaurant from './pages/restaurant/EditRestaurant';
import RestaurantListAdmin from './pages/restaurant/RestaurantListAdmin';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ManageMenuItems from './pages/menu/ManageMenuItems';
import AddMenuItem from './pages/menu/AddMenuItem';
import EditMenuItem from './pages/menu/EditMenuItem';
import MenuItemList from './pages/menu/MenuItemList'; // For public view

function App() {
  return (
    <Router>
      {/* <nav style={{ marginBottom: "30px", textAlign: "center" }}>
        <Link to="/register" style={{ marginRight: "20px", textDecoration: "none", color: "#ff69b4" }}>Register</Link>
        <Link to="/login" style={{ textDecoration: "none", color: "#ff69b4" }}>Login</Link>
      </nav> */}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment" element={<StripeCheckout />} />
      </Routes>
    </Router>
  );
}

export default App;

//Done
