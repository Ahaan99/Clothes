import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "@/services/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    gender: "",
    inStock: true,
    sizes: [],
    colors: [],
  });

  const categories = {
    men: ["t-shirts", "hoodies", "shirts", "polo", "tank-tops", "jackets", "sweaters"],
    women: ["t-shirts", "hoodies", "tops", "blouses", "tank-tops", "dresses", "sweaters"],
  };

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = [
    { name: "White", hex: "#ffffff" },
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#000080" },
    { name: "Red", hex: "#ff0000" },
    { name: "Gray", hex: "#808080" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct({
          ...data,
          colors: data.colors || [],
          sizes: data.sizes || [],
          price: Number(data.price),
        });
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch product");
        navigate("/admin/products");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedProduct = {
        ...product,
        price: Number(product.price),
        inStock: Boolean(product.inStock),
      };

      console.log("Sending product data:", formattedProduct);

      const { data } = await axios.put(`/products/${id}`, formattedProduct);

      console.log("Response:", data);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleSizeToggle = (size) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorToggle = (color) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.find((c) => c.hex === color.hex)
        ? prev.colors.filter((c) => c.hex !== color.hex)
        : [...prev.colors, color],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={product.gender}
              onValueChange={(value) => setProduct({ ...product, gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={product.category}
            onValueChange={(value) => setProduct({ ...product, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories[product.gender || "men"]?.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={product.sizes.includes(size) ? "default" : "outline"}
                onClick={() => handleSizeToggle(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Colors</Label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  product.colors.find((c) => c.hex === color.hex)
                    ? "ring-2 ring-primary scale-110"
                    : ""
                }`}
                style={{
                  backgroundColor: color.hex,
                  borderColor: color.hex === "#ffffff" ? "#e2e8f0" : color.hex,
                }}
                onClick={() => handleColorToggle(color)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
