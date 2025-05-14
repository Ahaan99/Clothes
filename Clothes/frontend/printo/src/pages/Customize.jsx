import { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import {
  Palette,
  Type,
  Image as ImageIcon,
  Undo,
  Redo,
  Save,
  Upload,
  Layers,
  Move,
  Trash2,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Copy,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { designTemplates } from "@/data/designTemplates";

const fonts = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Trebuchet MS",
  "Verdana",
];

const colorPalette = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Navy", hex: "#000080" },
  { name: "Red", hex: "#FF0000" },
  { name: "Green", hex: "#008000" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Purple", hex: "#800080" },
  { name: "Orange", hex: "#FFA500" },
];

export function Customize() {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [layers, setLayers] = useState([]);
  const [templates] = useState(designTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas("tshirt-canvas", {
      width: 500,
      height: 600,
      backgroundColor: "#f8f9fa",
    });

    setCanvas(newCanvas);

    // Load product image if ID is provided
    if (id) {
      // Load product image logic here
    }

    return () => {
      newCanvas.dispose();
    };
  }, [id]);

  const addText = () => {
    const text = new fabric.IText("Click to edit", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#000000",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    updateHistory();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        fabric.Image.fromURL(f.target.result, (img) => {
          img.scaleToWidth(canvas.width * 0.8);
          img.center();

          canvas.clear();
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

          if (selectedTemplate) {
            applyTemplateToImage(selectedTemplate.id);
          }

          updateHistory();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplateToImage = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const backgroundImage = canvas.backgroundImage;
    canvas.clear();
    canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas));

    template.elements.forEach((element) => {
      if (element.type === "text") {
        const text = new fabric.IText(element.options.text, {
          ...element.options,
          selectable: true,
          left: canvas.width * (element.options.left / 500),
          top: canvas.height * (element.options.top / 600),
        });
        canvas.add(text);
      }
    });

    canvas.renderAll();
    updateHistory();
    toast.success(`Applied ${template.name} template to image`);
  };

  const updateHistory = () => {
    const json = canvas.toJSON();
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), json]);
    setHistoryIndex((prev) => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      canvas.loadFromJSON(history[historyIndex - 1], canvas.renderAll.bind(canvas));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      canvas.loadFromJSON(history[historyIndex + 1], canvas.renderAll.bind(canvas));
    }
  };

  const handleAlignText = (alignment) => {
    if (selectedObject && selectedObject.type === "i-text") {
      selectedObject.set("textAlign", alignment);
      canvas.renderAll();
      updateHistory();
    }
  };

  const handleStyleText = (style) => {
    if (selectedObject && selectedObject.type === "i-text") {
      switch (style) {
        case "bold":
          selectedObject.set(
            "fontWeight",
            selectedObject.fontWeight === "bold" ? "normal" : "bold"
          );
          break;
        case "italic":
          selectedObject.set(
            "fontStyle",
            selectedObject.fontStyle === "italic" ? "normal" : "italic"
          );
          break;
        case "underline":
          selectedObject.set("underline", !selectedObject.underline);
          break;
      }
      canvas.renderAll();
      updateHistory();
    }
  };

  const handleDuplicate = () => {
    if (selectedObject) {
      selectedObject.clone((cloned) => {
        cloned.set({
          left: cloned.left + 20,
          top: cloned.top + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        updateHistory();
      });
    }
  };

  const applyTemplate = async (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    canvas.clear();

    for (const element of template.elements) {
      if (element.type === "text") {
        const text = new fabric.IText(element.options.text, {
          ...element.options,
          selectable: true,
        });
        canvas.add(text);
      } else if (element.type === "image") {
        fabric.Image.fromURL(element.options.src, (img) => {
          img.set(element.options);
          canvas.add(img);
        });
      }
    }

    canvas.renderAll();
    updateHistory();
    toast.success(`Applied ${template.name} template`);
  };

  const applyRandomTemplate = () => {
    const randomIndex = Math.floor(Math.random() * templates.length);
    applyTemplate(templates[randomIndex].id);
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template);

    if (canvas.backgroundImage) {
      applyTemplateToImage(templateId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">Design Tools</h2>

            <div className="space-y-4">
              <Button
                onClick={addText}
                className="w-full flex items-center gap-2"
                aria-label="Add text"
              >
                <Type className="w-4 h-4" />
                Add Text
              </Button>

              {selectedObject?.type === "i-text" && (
                <div className="space-y-4">
                  <Select
                    value={selectedObject.fontFamily}
                    onValueChange={(value) => {
                      selectedObject.set("fontFamily", value);
                      canvas.renderAll();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div>
                    <label className="text-sm font-medium">Font Size</label>
                    <Slider
                      value={[selectedObject.fontSize]}
                      onValueChange={(value) => {
                        selectedObject.set("fontSize", value[0]);
                        canvas.renderAll();
                      }}
                      min={8}
                      max={72}
                      step={1}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAlignText("left")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAlignText("center")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAlignText("right")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleStyleText("bold")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleStyleText("italic")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleStyleText("underline")}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Colors</label>
              <div className="grid grid-cols-8 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color.hex}
                    className="w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: color.hex,
                      borderColor: color.hex === "#FFFFFF" ? "#e2e8f0" : color.hex,
                    }}
                    onClick={() => {
                      if (selectedObject) {
                        selectedObject.set("fill", color.hex);
                        canvas.renderAll();
                      }
                    }}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Button
                onClick={() => fileInputRef.current.click()}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={undo}
                disabled={historyIndex <= 0}
                aria-label="Undo"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                aria-label="Redo"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Layers</Label>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {layers.map((layer, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer ${
                      selectedLayer === layer ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      canvas.setActiveObject(layer);
                      setSelectedLayer(layer);
                    }}
                  >
                    <span>{layer.type}</span>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDuplicate()}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          canvas.remove(layer);
                          updateHistory();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Templates</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={selectedTemplate?.id || ""}
                  onValueChange={handleTemplateSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    const randomTemplate =
                      templates[Math.floor(Math.random() * templates.length)];
                    handleTemplateSelect(randomTemplate.id);
                  }}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Random Template
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                const json = canvas.toJSON();
                localStorage.setItem("savedDesign", JSON.stringify(json));
                toast.success("Design saved successfully!");
              }}
            >
              Save Design
            </Button>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="relative aspect-[3/4] max-w-2xl mx-auto">
                <canvas
                  id="tshirt-canvas"
                  className="border border-gray-200 rounded-lg"
                  ref={canvasRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
