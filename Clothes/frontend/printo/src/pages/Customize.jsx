import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export function Customize() {
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);
  const [design, setDesign] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [color, setColor] = useState("#ffffff");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const colors = [
    { hex: "#ffffff", name: "White", border: true },
    { hex: "#000000", name: "Black" },
    { hex: "#ef4444", name: "Red" },
    { hex: "#3b82f6", name: "Blue" },
    { hex: "#10b981", name: "Green" },
    { hex: "#f59e0b", name: "Yellow" },
    { hex: "#8b5cf6", name: "Purple" },
    { hex: "#ec4899", name: "Pink" },
  ];

  const resizeImage = (imageData, maxWidth = 200, maxHeight = 200) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageData;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate the width and height, maintaining the aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
    });
  };

  // Get product type and template from URL params
  const productType = searchParams.get("product") || "t-shirt";
  const templateId = searchParams.get("template");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw product mockup with selected color
    const mockup = new Image();
    mockup.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23ffffff' /%3E%3Cpath d='M100,50 L300,50 L330,120 L400,90 L360,200 L330,200 L330,450 L70,450 L70,200 L40,200 L0,90 L70,120 L100,50' fill='${color.replace('#', '%23')}' stroke='%23e2e8f0' stroke-width='2' /%3E%3C/svg%3E`;
    
    mockup.onload = () => {
      ctx.drawImage(mockup, 0, 0, canvas.width, canvas.height);
      
      if (design) {
        const designImage = new Image();
        designImage.src = design;
        designImage.onload = () => {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 3;
          const scaledWidth = 200 * zoom;
          const scaledHeight = (designImage.height / designImage.width) * scaledWidth;
          
          ctx.save();
          ctx.translate(centerX + position.x, centerY + position.y);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.translate(-scaledWidth/2, -scaledHeight/2);
          ctx.drawImage(designImage, 0, 0, scaledWidth, scaledHeight);
          ctx.restore();
        };
      }
    };
  }, [design, zoom, rotation, position, color]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const resizedImage = await resizeImage(e.target?.result);
        setDesign(resizedImage);
        // Reset position and zoom when new image is uploaded
        setPosition({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleDrag = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleAddToCart = () => {
    const item = {
      productType,
      color,
      size: "M", // Assuming size is fixed for now
      quantity: 1, // Assuming quantity is fixed for now
      price: 20, // Assuming price is fixed for now
      design,
      preview: canvasRef.current.toDataURL()
    };
    
    addToCart(item);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Area */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={500}
                className="w-full border rounded-lg"
                onMouseDown={handleDragStart}
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              />
              
              <div className="mt-4 flex justify-center gap-4">
                <button 
                  onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setRotation(prev => prev - 90)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={() => setRotation(prev => prev + 90)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M15.99 2a1 1 0 011 1v2.101a7.002 7.002 0 00-11.601 2.566 1 1 0 11-1.885-.666A9.002 9.002 0 0114.001 3H11a1 1 0 110-2h5zm-.008 9.057a1 1 0 00-1.276.61A5.002 5.002 0 015.999 13H9a1 1 0 100-2H4a1 1 0 00-1 1v5a1 1 0 002 0v-2.101a7.002 7.002 0 0011.601-2.566 1 1 0 00-.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Controls */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Customize Your Design</h2>
              
              <div className="space-y-6">
                {/* Add color selection before upload design */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((colorOption) => (
                      <button
                        key={colorOption.hex}
                        onClick={() => setColor(colorOption.hex)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          color === colorOption.hex
                            ? "scale-110 ring-2 ring-indigo-600 ring-offset-2"
                            : ""
                        }`}
                        style={{
                          backgroundColor: colorOption.hex,
                          border: colorOption.border
                            ? "1px solid #e2e8f0"
                            : "none",
                        }}
                        title={colorOption.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Design
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <p className="text-sm text-gray-500">
                    Drag the design to position it on the product
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rotation
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
