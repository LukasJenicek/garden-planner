import { Plant, GardenBed, PlacedPlant } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedPlant: Plant | null;
  selectedBed: GardenBed | null;
  placedPlants: PlacedPlant[];
  plants: Plant[];
  isLoading: boolean;
}

export default function RightSidebar({ 
  isOpen, 
  onToggle, 
  selectedPlant, 
  selectedBed,
  placedPlants,
  plants,
  isLoading 
}: RightSidebarProps) {
  
  // Fetch companion relationships for the selected plant
  const { data: companions, isLoading: companionsLoading } = useQuery({
    queryKey: selectedPlant ? [`/api/companions/${selectedPlant.id}`] : null,
    enabled: !!selectedPlant
  });

  // Calculate number of plants in the selected bed
  const plantsInBed = selectedBed 
    ? placedPlants.filter(p => p.bedId === selectedBed.id)
    : [];
  
  const plantNames = plantsInBed.map(pp => {
    const plant = plants.find(p => p.id === pp.plantId);
    return plant ? plant.name : 'Unknown';
  });

  // Group companions by compatibility
  const goodCompanions = companions?.filter(c => c.compatibility === 'good') || [];
  const badCompanions = companions?.filter(c => c.compatibility === 'bad') || [];

  // Plant icon based on icon type
  const getPlantIcon = (iconType: string) => {
    switch (iconType) {
      case 'circle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="8" />
          </svg>
        );
      case 'line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" />
          </svg>
        );
      case 'triangle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 2a2 2 0 012-2h6a2 2 0 012 2v15l-5-3-5 3V2z" clipRule="evenodd" />
          </svg>
        );
      case 'square':
      case 'rectangle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        );
      case 'leaf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="8" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`bg-white shadow-lg w-64 md:w-72 flex-shrink-0 overflow-y-auto sidebar-transition transform md:transform-none 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 z-20 absolute md:relative h-full right-0`}
    >
      <div className="p-4">
        <h2 className="text-lg font-bold text-garden-green mb-4">Plant Information</h2>
        
        {/* Selected plant info */}
        {isLoading ? (
          <div className="mb-4 p-3 bg-light-soil rounded-lg">
            <div className="flex items-center mb-3">
              <Skeleton className="w-12 h-12 rounded-full mr-3" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : selectedPlant ? (
          <div className="mb-4 p-3 bg-light-soil rounded-lg">
            <div className="flex items-center mb-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-3`} style={{ backgroundColor: selectedPlant.color }}>
                {getPlantIcon(selectedPlant.icon)}
              </div>
              <div>
                <h3 className="font-semibold">{selectedPlant.name}</h3>
                <span className="text-sm text-gray-600">{selectedPlant.category.charAt(0).toUpperCase() + selectedPlant.category.slice(1)}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-sm mb-1">Growing Info</h4>
              <p className="text-sm text-gray-700">{selectedPlant.growingInfo}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-1">Harvest Time</h4>
              <p className="text-sm text-gray-700">{selectedPlant.harvestTime}</p>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-light-soil rounded-lg text-center text-gray-500">
            Select a plant to view details
          </div>
        )}
        
        {/* Companion planting info */}
        {selectedPlant && (
          <>
            <h3 className="text-md font-semibold mb-2">Companion Planting</h3>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-compatible mb-2">Good Companions</h4>
              {companionsLoading ? (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={`good-skeleton-${i}`} className="flex items-center bg-green-50 p-2 rounded-md">
                      <Skeleton className="w-8 h-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : goodCompanions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {goodCompanions.map(companion => (
                    <div key={companion.id} className="flex items-center bg-green-50 p-2 rounded-md">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-2`} style={{ backgroundColor: companion.plant?.color }}>
                        {companion.plant && getPlantIcon(companion.plant.icon)}
                      </div>
                      <span className="text-sm">{companion.plant?.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 mb-3 p-2">No good companions found</div>
              )}
              
              <h4 className="text-sm font-medium text-incompatible mb-2">Bad Companions</h4>
              {companionsLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={`bad-skeleton-${i}`} className="flex items-center bg-red-50 p-2 rounded-md">
                      <Skeleton className="w-8 h-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : badCompanions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {badCompanions.map(companion => (
                    <div key={companion.id} className="flex items-center bg-red-50 p-2 rounded-md">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-2`} style={{ backgroundColor: companion.plant?.color }}>
                        {companion.plant && getPlantIcon(companion.plant.icon)}
                      </div>
                      <span className="text-sm">{companion.plant?.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 p-2">No bad companions found</div>
              )}
            </div>
          </>
        )}
        
        {/* Garden bed info */}
        {selectedBed && (
          <>
            <h3 className="text-md font-semibold mb-2">Garden Bed</h3>
            <div className="p-3 bg-light-soil rounded-lg">
              <div className="mb-2">
                <h4 className="text-sm font-medium mb-1">Dimensions</h4>
                {selectedBed.shape === 'rectangle' ? (
                  <p className="text-sm text-gray-700">
                    {Math.round(selectedBed.width! / 20)}ft × {Math.round(selectedBed.height! / 20)}ft
                  </p>
                ) : selectedBed.shape === 'circle' ? (
                  <p className="text-sm text-gray-700">
                    Diameter: {Math.round((selectedBed.radius! * 2) / 20)}ft
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">Custom shape</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Plants</h4>
                <p className="text-sm text-gray-700">
                  {plantsInBed.length} plants{plantsInBed.length > 0 ? ` (${plantNames.join(', ')})` : ''}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Toggle button for mobile */}
      <button 
        onClick={onToggle}
        className="md:hidden absolute -left-10 top-1/2 transform -translate-y-1/2 bg-garden-green text-white p-2 rounded-l-md shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}
