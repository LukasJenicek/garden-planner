import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Plant } from "@/types/garden";

interface PlantInfoPanelProps {
  plant: Plant;
  onClose: () => void;
  onShowCompatibility: () => void;
}

export default function PlantInfoPanel({ plant, onClose, onShowCompatibility }: PlantInfoPanelProps) {
  return (
    <div className="absolute bottom-0 left-0 bg-white shadow-lg rounded-tr-lg w-72 transform transition-transform">
      <div className="bg-secondary text-white p-3 rounded-tr-lg flex justify-between items-center">
        <h3 className="font-['Montserrat'] font-medium">Plant Details</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="text-white hover:text-gray-200 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex gap-3 mb-4">
          <div 
            className="w-16 h-16 rounded bg-cover bg-center" 
            style={{ backgroundImage: `url(${plant.imageUrl})` }}
          />
          <div>
            <h3 className="font-medium">{plant.name}</h3>
            <p className="text-xs text-gray-500">{plant.scientificName}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Growing Information</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-100 p-2 rounded">
              <span className="block font-medium">Sun</span>
              {plant.sunRequirement}
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <span className="block font-medium">Water</span>
              {plant.waterNeeds}
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <span className="block font-medium">Spacing</span>
              {plant.spacing}
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <span className="block font-medium">Harvest</span>
              {plant.harvestTime}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Companion Planting</h4>
          
          <div className="mb-2">
            <div className="text-xs font-medium mb-1 text-compatible">
              Good Companions
            </div>
            <div className="flex flex-wrap gap-1">
              {plant.goodCompanions.map((companion, index) => (
                <span 
                  key={`good-${index}`} 
                  className="bg-compatible text-white text-xs py-0.5 px-1.5 rounded-full"
                >
                  {companion}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs font-medium mb-1 text-incompatible">
              Poor Companions
            </div>
            <div className="flex flex-wrap gap-1">
              {plant.badCompanions.map((companion, index) => (
                <span 
                  key={`bad-${index}`} 
                  className="bg-incompatible text-white text-xs py-0.5 px-1.5 rounded-full"
                >
                  {companion}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <Button 
            className="bg-secondary hover:bg-secondary-light text-white text-sm flex items-center gap-1"
            onClick={onShowCompatibility}
          >
            <i className="fas fa-info-circle mr-1"></i>
            <span>Compatibility Chart</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
