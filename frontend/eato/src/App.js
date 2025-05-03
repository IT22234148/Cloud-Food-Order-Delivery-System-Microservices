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
import MenuItemList from './pages/menu/MenuItemList';
import CustomerRestaurantList from './pages/restaurant/CustomerRestaurantList';
import CashOnDelivery from "./pages/CashOnDelivery";
import PaymentPage from './pages/PaymentPage';
import AdminPaymentList from "./components/AdminPaymentList";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/paymentcard" element={<StripeCheckout />} />
          <Route path="/payment/cod" element={<CashOnDelivery />} />
          <Route path="/restaurants" element={<CustomerRestaurantList />} />
          <Route path="/restaurant/:restaurantId/menu" element={<MenuItemList />} />
          {/* <PaymentPage orderId="ORD999" amount={2500} /> */}
          <Route path="/paymentchoose" element={<PaymentPage orderId="ORD999" amount={2500}  />} />
          {/* <Route path="/paylist" element={<AdminPaymentList />} /> */}


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
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
            element={<ProtectedRoute allowedRoles={['admin']} />}
          >
            <Route path="/admin/restaurants" element={<RestaurantListAdmin />} />
            <Route path="/paylist" element={<AdminPaymentList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
