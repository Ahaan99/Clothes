import { Link, useLocation } from "react-router-dom";

export function AdminLayout({ children }) {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/products/add", label: "Add Product" },
    { path: "/admin/products", label: "Products" },
    { path: "/admin/orders", label: "Orders" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="p-4">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-2 mb-2 rounded ${
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-600"
                  : "hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
