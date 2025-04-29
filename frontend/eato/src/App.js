
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
import CustomerRestaurantList from './pages/restaurant/CustomerRestaurantList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />


      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment" element={<StripeCheckout />} />
      </Routes>

          {/* Public route for all customers to see restaurants */}
          <Route path="/restaurants" element={<CustomerRestaurantList />} />


          <Route path="/" element={<ProtectedRoute />}>
            

            {/* Restaurant Routes */}
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            <Route path="/restaurant/add" element={<AddRestaurant />} />
            <Route path="/restaurant/edit/:id" element={<EditRestaurant />} />
            <Route path="/restaurant/dashboard/menu" element={<ManageMenuItems />} />
            <Route path="/menu/add" element={<AddMenuItem />} />
            <Route path="/menu/edit/:id" element={<EditMenuItem />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/restaurants"
            element={<ProtectedRoute allowedRoles={['admin']} />}
          >
            <Route index element={<RestaurantListAdmin />} />
          </Route>

          {/* Public Route for viewing menu by restaurant */}
          <Route path="/restaurant/:restaurantId/menu" element={<MenuItemList />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;