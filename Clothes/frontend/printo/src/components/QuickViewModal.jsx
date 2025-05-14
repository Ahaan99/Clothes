import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

export function QuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    addItem(product, selectedSize, selectedColor);
    toast.success("Added to cart!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[400px] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Select Size</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "hover:border-indigo-600 hover:text-indigo-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Select Color</h4>
              <div className="flex gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.hex
                        ? "ring-2 ring-indigo-600 scale-110"
                        : ""
                    }`}
                    style={{ 
                      backgroundColor: color.hex,
                      borderColor: color.hex === "#ffffff" ? "#e2e8f0" : color.hex
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onClose();
                  navigate(`/customize/${product._id}`);
                }}
              >
                Customize
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
