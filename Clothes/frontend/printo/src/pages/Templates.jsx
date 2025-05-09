import { useState } from "react";
import { Link } from "react-router-dom";

export function Templates() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Minimalist",
    "Vintage",
    "Typography",
    "Illustration",
    "Abstract",
    "Nature",
    "Sports",
    "Custom",
  ];

  const templates = [
    {
      id: 1,
      name: "Minimalist Mountain",
      category: "minimalist",
      designer: "Jane Cooper",
      likes: 234,
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M50,150 L100,50 L150,150 Z' fill='%23333'/%3E%3C/svg%3E",
    },
    {
      id: 2,
      name: "Retro Waves",
      category: "vintage",
      designer: "John Smith",
      likes: 189,
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M0,100 Q50,50 100,100 T200,100' fill='none' stroke='%23333' stroke-width='2'/%3E%3C/svg%3E",
    },
    // Add more templates as needed
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = category === "all" || template.category === category.toLowerCase();
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.designer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Design Templates</h1>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex-shrink-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.toLowerCase()} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-gray-600 text-sm">By {template.designer}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-600">{template.likes}</span>
                  </div>
                  <Link
                    to={`/customize?template=${template.id}`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
