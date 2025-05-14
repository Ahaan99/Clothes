import { useState, useEffect } from "react";
import axios from "@/services/axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { sampleProducts } from "@/data/sampleProducts";
import { QuickViewModal } from "@/components/QuickViewModal";
import { CartDialog } from "@/components/CartDialog"; // Update this line

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [gender, setGender] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const navigate = useNavigate();

  const categories = {
    men: [
      { value: "t-shirts", label: "T-Shirts" },
      { value: "hoodies", label: "Hoodies" },
      { value: "shirts", label: "Shirts" },
      { value: "polo", label: "Polo T-Shirts" },
      { value: "tank-tops", label: "Tank Tops" },
      { value: "jackets", label: "Jackets" },
      { value: "sweaters", label: "Sweaters" },
    ],
    women: [
      { value: "t-shirts", label: "T-Shirts" },
      { value: "hoodies", label: "Hoodies" },
      { value: "tops", label: "Tops" },
      { value: "blouses", label: "Blouses" },
      { value: "tank-tops", label: "Tank Tops" },
      { value: "dresses", label: "Dresses" },
      { value: "sweaters", label: "Sweaters" },
    ],
    all: [
      { value: "t-shirts", label: "T-Shirts" },
      { value: "hoodies", label: "Hoodies" },
      { value: "tops", label: "Tops" },
      { value: "shirts", label: "Shirts" },
      { value: "tank-tops", label: "Tank Tops" },
      { value: "jackets", label: "Jackets & Outerwear" },
      { value: "sweaters", label: "Sweaters & Cardigans" },
    ],
  };

  const getCloudinaryUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder-product.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `https://res.cloudinary.com/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload/v1/${imageUrl}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/products");
        if (data && data.length > 0) {
          console.log("API products:", data);
          setProducts(data);
        } else {
          console.log("Using sample products");
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Using sample products as fallback");
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sortProducts = (products) => {
    return products.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "popular":
        default:
          return b.popularity - a.popularity;
      }
    });
  };

  const filteredAndSortedProducts = sortProducts(
    products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesGender = gender === "all" || product.gender === gender;
      const matchesPrice =
        product.price >= priceRange[0] &&
        product.price <= (priceRange[1] === 100 ? Infinity : priceRange[1]);
      return matchesCategory && matchesGender && matchesPrice;
    })
  );

  const handleQuickView = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setSelectedProduct(product);
      setQuickViewOpen(true);
    }
  };

  const handleCustomizeClick = (productId) => {
    navigate(`/customize/${productId}`);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop Collection
          </h1>
          <p className="text-gray-600">
            Discover and customize your perfect style
          </p>
        </div>
        <CartDialog /> {/* Update this line */}
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories[gender].map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-[200px] space-y-2">
            <label className="text-sm font-medium">Price Range</label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Category Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {categories[gender].map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`p-3 rounded-lg text-center transition-colors ${
              category === cat.value
                ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-600"
                : "bg-white border border-gray-200 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 overflow-hidden group">
                <img
                  src={getCloudinaryUrl(product.images[0]?.url)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    {product.inStock ? (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                    {product.isNew && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <span className="font-bold text-lg text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.sizes?.map((size) => (
                    <span
                      key={size}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                {product.colors?.length > 0 && (
                  <div className="flex gap-1 mb-3">
                    {product.colors.map((color) => (
                      <div
                        key={color.hex}
                        className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
                        style={{
                          backgroundColor: color.hex,
                          borderColor:
                            color.hex === "#ffffff" ? "#e2e8f0" : "transparent",
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleQuickView(product._id)}
                  >
                    Quick View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCustomizeClick(product._id)}
                  >
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )}

      {/* Active Filters Display */}
      {(gender !== "all" || category !== "all") && (
        <div className="flex gap-2 mb-6">
          {gender !== "all" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-600">
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
              <button
                onClick={() => setGender("all")}
                className="ml-2 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
          {category !== "all" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-600">
              {categories[gender].find((cat) => cat.value === category)?.label}
              <button
                onClick={() => setCategory("all")}
                className="ml-2 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Add QuickView Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={() => {
          setQuickViewOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
