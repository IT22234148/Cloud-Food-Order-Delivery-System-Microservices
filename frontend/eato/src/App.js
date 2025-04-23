import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
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
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<div>Home Page (Protected)</div>} />

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