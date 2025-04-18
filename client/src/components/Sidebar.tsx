import { useState } from "react";
import PlantCard from "./PlantCard";
import ToolItem from "./ToolItem";
import { Plant, Tool } from "@/types/garden";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  plants: Plant[];
  selectedTool: Tool;
  onSelectTool: (tool: Tool) => void;
  isMobileOpen: boolean;
  isLoading: boolean;
}

export default function Sidebar({ 
  plants,
  selectedTool,
  onSelectTool,
  isMobileOpen,
  isLoading 
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("vegetables");

  // Filter plants based on search term and category
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || plant.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toolOptions: { id: Tool; icon: string; label: string }[] = [
    { id: "select", icon: "fas fa-mouse-pointer", label: "Select" },
    { id: "rectangle", icon: "far fa-square", label: "Garden" },
    { id: "circle", icon: "far fa-circle", label: "Circle" },
    { id: "path", icon: "fas fa-draw-polygon", label: "Freeform" },
    { id: "eraser", icon: "fas fa-eraser", label: "Eraser" },
    { id: "text", icon: "fas fa-font", label: "Text" },
    { id: "measure", icon: "fas fa-ruler", label: "Measure" },
    { id: "zoom", icon: "fas fa-search-plus", label: "Zoom" }
  ];

  return (
    <div 
      className={`w-full md:w-64 bg-white shadow-lg md:min-h-screen z-40 ${
        isMobileOpen ? "transform-none" : "transform -translate-x-full"
      } md:transform-none transition-transform duration-300`}
    >
      {/* Sidebar Header */}
      <div className="hidden md:block bg-primary text-white p-4">
        <h1 className="font-['Montserrat'] font-bold text-xl">Garden Planner</h1>
      </div>
      
      {/* Tool selection section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-['Montserrat'] font-semibold text-lg mb-3">Tools</h2>
        <div className="grid grid-cols-4 gap-2">
          {toolOptions.map((tool) => (
            <ToolItem
              key={tool.id}
              id={tool.id}
              icon={tool.icon}
              label={tool.label}
              isActive={selectedTool === tool.id}
              onClick={() => onSelectTool(tool.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Plant Library section */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-['Montserrat'] font-semibold text-lg">Plant Library</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search plants..." 
              className="pl-8 pr-2 py-1 text-sm border rounded w-full focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>
        </div>
        
        {/* Plant categories tabs */}
        <div className="flex border-b mb-4">
          <button 
            className={`text-sm py-2 px-3 ${
              selectedCategory === "vegetables" 
                ? "border-b-2 border-primary font-medium text-primary" 
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setSelectedCategory("vegetables")}
          >
            Vegetables
          </button>
          <button 
            className={`text-sm py-2 px-3 ${
              selectedCategory === "herbs" 
                ? "border-b-2 border-primary font-medium text-primary" 
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setSelectedCategory("herbs")}
          >
            Herbs
          </button>
          <button 
            className={`text-sm py-2 px-3 ${
              selectedCategory === "flowers" 
                ? "border-b-2 border-primary font-medium text-primary" 
                : "text-gray-500 hover:text-primary"
            }`}
            onClick={() => setSelectedCategory("flowers")}
          >
            Flowers
          </button>
        </div>
        
        {/* Plant cards container with scrolling */}
        <div className="custom-scrollbar overflow-y-auto h-[calc(100vh-350px)] md:h-[calc(100vh-280px)]">
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="mb-3 flex gap-3">
                <Skeleton className="w-16 h-16 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-12 rounded-full" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No plants found. Try adjusting your search.
              </div>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
