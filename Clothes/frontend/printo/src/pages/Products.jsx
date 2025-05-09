import { useState } from "react";
import { Link } from "react-router-dom";

export function Products() {
  const [filter, setFilter] = useState("all");

  const products = [
    {
      id: "tshirt-men",
      name: "Men's Classic T-Shirt",
      image: "/images/products/mens-tshirt.jpg",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format",
      ],
      category: "mens",
      basePrice: 24.99,
      description: "Premium cotton crew neck t-shirt",
      colors: ["white", "black", "navy", "gray", "red"],
      isNew: true
    },
    {
      id: "tshirt-women",
      name: "Women's Classic T-Shirt",
      image: "/images/products/womens-tshirt.jpg",
      images: [
        "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&auto=format",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format",
      ],
      category: "womens",
      basePrice: 24.99,
      description: "Soft cotton fitted t-shirt",
      colors: ["white", "black", "pink", "purple", "blue"],
      isBestSeller: true
    },
    // Add more products...
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "mens", label: "Men's", count: products.filter(p => p.category === "mens").length },
    { id: "womens", label: "Women's", count: products.filter(p => p.category === "womens").length },
    { id: "hoodies", label: "Hoodies", count: products.filter(p => p.category === "hoodies").length },
    { id: "sweaters", label: "Sweaters", count: products.filter(p => p.category === "sweaters").length }
  ];

  const filteredProducts = filter === "all" 
    ? products 
    : products.filter(product => product.category === filter);

  return (
    <div className="min-h-screen bg-white">
      {/* Category Nav */}
      <div className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-8 py-4 -mb-px">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`whitespace-nowrap px-1 py-2 border-b-2 font-medium text-sm transition-colors
                  ${filter === cat.id 
                    ? "border-black text-black" 
                    : "border-transparent text-gray-500 hover:text-black"
                  }`}
              >
                {cat.label}
                {cat.count && <span className="ml-1 text-gray-400">({cat.count})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="group">
              <div className="relative">
                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover object-center group-hover:opacity-75"
                  />
                  <img
                    src={product.images[1]}
                    alt={product.name}
                    className="absolute inset-0 object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                {product.isNew && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-black text-white rounded">
                    New
                  </div>
                )}
                {product.isBestSeller && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-yellow-400 text-black rounded">
                    Best Seller
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">From ${product.basePrice}</p>
              </div>
              <div className="mt-2 flex gap-1">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
