import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templateData";

export function Templates() {
  const navigate = useNavigate();

  const handleTemplateClick = (template) => {
    navigate(`/customize/${template.baseProduct}`, {
      state: {
        templateId: template.id,
        templateImages: template.images,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Design Templates</h1>
        <p className="text-gray-600">Choose a template to start customizing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={template.images.front}
                alt={template.name}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              <img
                src={template.images.back}
                alt={`${template.name} back`}
                className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <Button
                className="w-full"
                onClick={() => handleTemplateClick(template)}
              >
                Use This Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
