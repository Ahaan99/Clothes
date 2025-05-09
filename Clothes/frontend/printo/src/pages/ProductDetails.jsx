import { useState } from "react";
import { useParams, Link } from "react-router-dom";

export function ProductDetails() {
  const [selectedColor, setSelectedColor] = useState("white");
  const [selectedSize, setSelectedSize] = useState("M");
  const { id } = useParams();

  const productData = {
    tshirt: {
      name: "Classic T-Shirt",
      price: 24.99,
      colors: [
        { name: "White", hex: "#ffffff", border: true },
        { name: "Black", hex: "#000000" },
        { name: "Navy", hex: "#1e3a8a" }
      ],
      sizes: ["S", "M", "L", "XL", "2XL"],
      categories: ["Men", "Women"],
      mockupImages: [
        `data:image/svg+xml,...`, // Your SVG mockups here
      ]
    },
    hoodie: {
      name: "Premium Hoodie",
      price: 39.99,
      colors: [
        { name: "White", hex: "#ffffff", border: true },
        { name: "Black", hex: "#000000" },
        { name: "Gray", hex: "#4b5563" }
      ],
      sizes: ["S", "M", "L", "XL", "2XL"],
      categories: ["Men", "Women"],
      mockupImages: [
        `data:image/svg+xml,...`, // Your SVG mockups here
      ]
    }
  };

  const product = productData[id] || productData.tshirt;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.mockupImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <button
                  key={index}
                  className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={product.mockupImages[0]}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl mb-6">${product.price}</p>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.name.toLowerCase())}
                    className={`w-10 h-10 rounded-full ${
                      selectedColor === color.name.toLowerCase()
                        ? "ring-2 ring-indigo-600 ring-offset-2"
                        : ""
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      border: color.border ? "1px solid #e5e7eb" : "none",
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 border rounded-md ${
                      selectedSize === size
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-300 text-gray-900 hover:border-indigo-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Available For</h3>
              <div className="flex space-x-4">
                {product.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition">
              Customize Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
