import { useState } from "react";
import { Link } from "react-router-dom";

export function ProductLayout() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const categories = [
    { id: "all", label: "All Products" },
    { id: "men", label: "Men's Apparel" },
    { id: "women", label: "Women's Apparel" },
    { id: "accessories", label: "Accessories" }
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full ${
                    activeCategory === cat.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-0 text-sm text-gray-600 focus:ring-0"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Product Card Template */}
          <div className="group">
            <Link to="/customize" className="block">
              <div className="relative aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.jpg"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-white px-2 py-1 text-xs font-medium rounded-full">New</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Product Name</h3>
                <p className="mt-1 text-sm text-gray-500">From $24.99</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
