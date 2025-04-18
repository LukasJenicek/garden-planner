import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plant } from "@/types/garden";

interface CompatibilityPopupProps {
  plants: Plant[];
  onClose: () => void;
}

export default function CompatibilityPopup({ plants, onClose }: CompatibilityPopupProps) {
  // Get unique plant names for the table
  const plantNames = plants.length > 0 
    ? Array.from(new Set(plants.map(p => p.name))).slice(0, 6) 
    : ["Tomato", "Basil", "Carrot", "Lettuce", "Pepper"];
  
  // Function to determine compatibility between two plants
  const getCompatibility = (plant1: string, plant2: string): 'good' | 'fair' | 'poor' => {
    if (plant1 === plant2) return 'fair'; // Same plant
    
    // Find plant1 in our data
    const plantData = plants.find(p => p.name === plant1);
    if (!plantData) return 'fair';
    
    // Check if plant2 is a good companion
    if (plantData.goodCompanions.includes(plant2)) return 'good';
    
    // Check if plant2 is a bad companion
    if (plantData.badCompanions.includes(plant2)) return 'poor';
    
    // Default to fair
    return 'fair';
  };
  
  // Get appropriate background color based on compatibility
  const getCompatibilityClass = (compatibility: 'good' | 'fair' | 'poor'): string => {
    switch (compatibility) {
      case 'good':
        return 'bg-compatible text-white';
      case 'fair':
        return 'bg-warning text-white';
      case 'poor':
        return 'bg-incompatible text-white';
      default:
        return 'bg-gray-100';
    }
  };
  
  // Get text label for compatibility
  const getCompatibilityLabel = (compatibility: 'good' | 'fair' | 'poor'): string => {
    switch (compatibility) {
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'poor':
        return 'Poor';
      default:
        return '-';
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-['Montserrat'] font-semibold text-primary">
            Plant Compatibility Chart
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 bg-gray-100 rounded mb-4 text-sm">
          <p>
            This chart shows the compatibility between different plants in your garden. 
            Use it to plan optimal companion planting arrangements.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-2 border bg-gray-50"></th>
                {plantNames.map(name => (
                  <th key={name} className="p-2 border bg-gray-50">{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plantNames.map(rowPlant => (
                <tr key={rowPlant}>
                  <th className="p-2 border bg-gray-50">{rowPlant}</th>
                  {plantNames.map(colPlant => {
                    const compatibility = rowPlant === colPlant 
                      ? 'fair' 
                      : getCompatibility(rowPlant, colPlant);
                    return (
                      <td 
                        key={`${rowPlant}-${colPlant}`} 
                        className={`p-2 border ${
                          rowPlant === colPlant 
                            ? 'bg-gray-100' 
                            : getCompatibilityClass(compatibility)
                        }`}
                      >
                        {rowPlant === colPlant 
                          ? '-' 
                          : getCompatibilityLabel(compatibility)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-compatible rounded-full mr-1"></div>
            <span className="text-xs">Good</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-warning rounded-full mr-1"></div>
            <span className="text-xs">Fair</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-incompatible rounded-full mr-1"></div>
            <span className="text-xs">Poor</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
