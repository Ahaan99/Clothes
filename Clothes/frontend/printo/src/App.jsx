import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { Navbar } from "@/components/layout/Navbar";
import { Home } from "@/pages/Home";
import { AdminLogin } from "@/pages/admin/Login";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AddProduct } from "@/pages/admin/AddProduct";
import { Products } from "./pages/Products";
import { Customize } from "./pages/Customize";
import { Auth } from "@/pages/Auth";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Templates } from "./pages/Templates";
import { Cart } from "./pages/Cart";
import { CartProvider } from "./contexts/CartContext";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { Orders } from "./pages/Orders";
import { OrderProvider } from "./contexts/OrderContext";
import { ProductLayout } from "./components/ProductLayout";
import { ProductDetails } from "./pages/ProductDetails";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user?.isAdmin) {
    toast.error("Admin access required");
    return <Navigate to="/admin/login" />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default function App() {
  return (
    <OrderProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-center" richColors />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductLayout />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/customize/:id?" element={<Customize />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products/add" element={<AddProduct />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </OrderProvider>
  );
}
