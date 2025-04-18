import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ControlBar from "@/components/ControlBar";
import GardenCanvas from "@/components/GardenCanvas";
import GardenInfoPanel from "@/components/GardenInfoPanel";
import PlantInfoPanel from "@/components/PlantInfoPanel";
import CompatibilityPopup from "@/components/CompatibilityPopup";
import { Garden, Plant, GardenBed, Tool } from "@/types/garden";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GardenPlanner() {
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [zoom, setZoom] = useState(100);
  const [showCompatibilityPopup, setShowCompatibilityPopup] = useState(false);
  const [selectedGardenBed, setSelectedGardenBed] = useState<GardenBed | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Fetch plants library from the server
  const { data: plants, isLoading: plantsLoading } = useQuery({
    queryKey: ['/api/plants'],
  });

  // Fetch gardens from the server
  const { data: gardens, isLoading: gardensLoading } = useQuery({
    queryKey: ['/api/gardens'],
  });

  // Get the current garden (we'll start with the first one or create a default)
  const [currentGarden, setCurrentGarden] = useState<Garden | null>(null);

  // Initialize garden when data is loaded
  useEffect(() => {
    if (gardens && gardens.length > 0) {
      setCurrentGarden(gardens[0]);
    } else if (!gardensLoading) {
      // Create a default empty garden
      setCurrentGarden({
        id: 0,
        name: "My Garden",
        beds: [],
        plants: []
      });
    }
  }, [gardens, gardensLoading]);

  // Save garden mutation
  const saveGardenMutation = useMutation({
    mutationFn: async (garden: Garden) => {
      return await apiRequest('POST', '/api/gardens', garden);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gardens'] });
      toast({
        title: "Success",
        description: "Garden saved successfully!",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save garden: ${error}`,
        variant: "destructive",
      });
    }
  });

  const handleSaveGarden = () => {
    if (currentGarden) {
      saveGardenMutation.mutate(currentGarden);
    }
  };

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleUndoAction = () => {
    // Implementation will depend on the history tracking system
    toast({
      title: "Undo",
      description: "Action undone",
    });
  };

  const handleRedoAction = () => {
    // Implementation will depend on the history tracking system
    toast({
      title: "Redo",
      description: "Action redone",
    });
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSelectTemplate = (templateType: string) => {
    // Would create a predefined garden bed based on template type
    toast({
      title: "Template Applied",
      description: `Created ${templateType} template`,
    });
  };

  const handleAddGardenBed = (bed: GardenBed) => {
    if (currentGarden) {
      setCurrentGarden({
        ...currentGarden,
        beds: [...currentGarden.beds, bed]
      });
    }
  };

  const handleAddPlant = (plant: Plant) => {
    if (currentGarden) {
      setCurrentGarden({
        ...currentGarden,
        plants: [...currentGarden.plants, plant]
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background font-['Open_Sans'] text-dark">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-['Montserrat'] font-bold text-xl">Garden Planner</h1>
        <button 
          onClick={toggleMobileSidebar}
          className="text-white focus:outline-none"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar 
        plants={plants || []} 
        selectedTool={selectedTool}
        onSelectTool={handleSelectTool}
        isMobileOpen={isMobileSidebarOpen}
        isLoading={plantsLoading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen md:h-auto">
        {/* Control Bar */}
        <ControlBar 
          onSave={handleSaveGarden}
          onUndo={handleUndoAction}
          onRedo={handleRedoAction}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onSelectTemplate={handleSelectTemplate}
          isSaving={saveGardenMutation.isPending}
        />
        
        {/* Canvas Container */}
        <div className="flex-1 relative bg-gray-100 overflow-hidden">
          {!gardensLoading && currentGarden && (
            <GardenCanvas 
              garden={currentGarden}
              selectedTool={selectedTool}
              zoom={zoom}
              onAddGardenBed={handleAddGardenBed}
              onAddPlant={handleAddPlant}
              onSelectGardenBed={setSelectedGardenBed}
              onSelectPlant={setSelectedPlant}
            />
          )}
          
          {/* Garden Info Panel - Only show when a garden bed is selected */}
          {selectedGardenBed && (
            <GardenInfoPanel 
              gardenBed={selectedGardenBed}
              onClose={() => setSelectedGardenBed(null)}
              onUpdate={(updated) => {
                if (currentGarden) {
                  setCurrentGarden({
                    ...currentGarden,
                    beds: currentGarden.beds.map(bed => 
                      bed.id === updated.id ? updated : bed
                    )
                  });
                }
              }}
            />
          )}
          
          {/* Plant Info Panel - Only show when a plant is selected */}
          {selectedPlant && (
            <PlantInfoPanel 
              plant={selectedPlant}
              onClose={() => setSelectedPlant(null)}
              onShowCompatibility={() => setShowCompatibilityPopup(true)}
            />
          )}
        </div>
      </div>

      {/* Compatibility Popup - Only show when requested */}
      {showCompatibilityPopup && (
        <CompatibilityPopup 
          plants={plants || []}
          onClose={() => setShowCompatibilityPopup(false)}
        />
      )}
    </div>
  );
}
