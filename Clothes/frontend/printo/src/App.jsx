import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useSelector } from "react-redux";
import { Navbar } from "@/components/layout/Navbar";
import { Home } from "@/pages/Home";
import { AdminLogin } from "@/pages/admin/Login";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { AddProduct } from "@/pages/admin/AddProduct";
import { Products } from "@/pages/Products";
import { Customize } from "@/pages/Customize";
import { Auth } from "@/pages/Auth";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { Orders } from "@/pages/Orders";
import { EditProduct } from "@/pages/admin/EditProduct";
import { ProductsList } from "@/pages/admin/ProductsList";
import { OrdersList } from "@/pages/admin/OrdersList";
import { UsersList } from "@/pages/admin/UsersList";
import { Categories } from "@/pages/admin/Categories";
import { Templates } from "@/pages/Templates";
import { TemplatesList } from "@/pages/admin/TemplatesList";
import { Pricing } from "@/pages/Pricing";
import { HowItWorks } from "@/pages/HowItWorks";
import { Profile } from "@/pages/Profile";

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
    <Router>
      <Toaster position="top-center" richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customize/:id?" element={<Customize />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products">
                  <Route index element={<ProductsList />} />
                  <Route path="add" element={<AddProduct />} />
                  <Route path="edit/:id" element={<EditProduct />} />
                  <Route path="categories" element={<Categories />} />
                </Route>
                <Route path="orders" element={<OrdersList />} />
                <Route path="users" element={<UsersList />} />
                <Route path="templates" element={<TemplatesList />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
