import { useState } from "react";
import { Plant } from "@shared/schema";
import PlantItem from "./PlantItem";
import { Skeleton } from "@/components/ui/skeleton";

interface LeftSidebarProps {
  plants: Plant[];
  isOpen: boolean;
  onToggle: () => void;
  isLoading: boolean;
}

export default function LeftSidebar({ plants, isOpen, onToggle, isLoading }: LeftSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter plants by category and search term
  const vegetables = plants
    .filter(plant => plant.category === "vegetable")
    .filter(plant => plant.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const herbs = plants
    .filter(plant => plant.category === "herb")
    .filter(plant => plant.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div 
      className={`bg-white shadow-lg w-64 md:w-72 flex-shrink-0 overflow-y-auto sidebar-transition transform md:transform-none 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-20 absolute md:relative h-full`}
    >
      <div className="p-4">
        <h2 className="text-lg font-bold text-garden-green mb-4">Plant Library</h2>
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Search plants..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-9 border rounded-md focus:outline-none focus:ring-1 focus:ring-garden-green"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-2 top-2.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h3 className="text-md font-semibold mb-2">Vegetables</h3>
        <div className="grid grid-cols-2 gap-2 mb-4 max-h-72 overflow-y-auto no-scrollbar">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={`veg-skeleton-${index}`} className="bg-light-soil rounded-lg p-2">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-14 h-14 rounded-full mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          ) : vegetables.length > 0 ? (
            vegetables.map(plant => (
              <PlantItem key={`veg-${plant.id}`} plant={plant} />
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No vegetables found
            </div>
          )}
        </div>
        
        <h3 className="text-md font-semibold mb-2">Herbs</h3>
        <div className="grid grid-cols-2 gap-2 mb-4 max-h-72 overflow-y-auto no-scrollbar">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={`herb-skeleton-${index}`} className="bg-light-soil rounded-lg p-2">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-14 h-14 rounded-full mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))
          ) : herbs.length > 0 ? (
            herbs.map(plant => (
              <PlantItem key={`herb-${plant.id}`} plant={plant} />
            ))
          ) : (
            <div className="col-span-2 text-center py-4 text-gray-500">
              No herbs found
            </div>
          )}
        </div>
      </div>
      
      {/* Toggle button for mobile */}
      <button 
        onClick={onToggle}
        className="md:hidden absolute -right-10 top-1/2 transform -translate-y-1/2 bg-garden-green text-white p-2 rounded-r-md shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
