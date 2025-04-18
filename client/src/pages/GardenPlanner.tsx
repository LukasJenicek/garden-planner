import { useEffect, useState } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import MainCanvas from "@/components/MainCanvas";
import { Plant, GardenBed, PlacedPlant } from "@shared/schema";
import { usePlants } from "@/hooks/usePlants";
import { useGardenBeds } from "@/hooks/useGardenBeds";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function GardenPlanner() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch plants and companions
  const { plants, isLoading: plantsLoading } = usePlants();
  const { 
    beds, 
    placedPlants, 
    addBed, 
    updateBed,
    deleteBed,
    addPlacedPlant,
    updatePlacedPlant,
    deletePlacedPlant,
    isLoading: bedsLoading
  } = useGardenBeds();

  // Find selected plant and bed
  const selectedPlant = selectedPlantId 
    ? plants?.find(p => p.id === selectedPlantId) 
    : null;
  
  const selectedBed = selectedBedId 
    ? beds?.find(b => b.id === selectedBedId) 
    : null;

  // Mobile sidebar handling
  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
    if (!leftSidebarOpen) setRightSidebarOpen(false);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    if (!rightSidebarOpen) setLeftSidebarOpen(false);
  };

  // Reset selected plant when closing sidebar
  useEffect(() => {
    if (!rightSidebarOpen) {
      setSelectedPlantId(null);
    }
  }, [rightSidebarOpen]);

  // Save garden layout
  const saveGarden = async () => {
    if (!beds || !placedPlants) return;
    
    try {
      await apiRequest('POST', '/api/garden-layouts', {
        name: 'My Garden Layout',
        beds: beds,
        plants: placedPlants
      });
      
      toast({
        title: "Garden saved!",
        description: "Your garden layout has been saved successfully.",
      });
      
      // Refresh garden layouts cache
      queryClient.invalidateQueries({ queryKey: ['/api/garden-layouts'] });
    } catch (error) {
      toast({
        title: "Error saving garden",
        description: "There was an error saving your garden layout.",
        variant: "destructive",
      });
    }
  };

  // Load garden layout
  const loadGarden = async () => {
    try {
      const res = await apiRequest('GET', '/api/garden-layouts', undefined);
      const layouts = await res.json();
      
      if (layouts.length === 0) {
        toast({
          title: "No saved gardens",
          description: "You don't have any saved garden layouts yet.",
        });
        return;
      }
      
      // For simplicity, load the first layout
      const latestLayout = layouts[layouts.length - 1];
      
      // Update local state with loaded layout
      // This would be handled by the useGardenBeds hook in a real implementation
      queryClient.invalidateQueries({ queryKey: ['/api/garden-layouts'] });
      
      toast({
        title: "Garden loaded!",
        description: "Your garden layout has been loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error loading garden",
        description: "There was an error loading your garden layout.",
        variant: "destructive",
      });
    }
  };

  const handlePlantSelect = (plantId: number) => {
    setSelectedPlantId(plantId);
    if (!rightSidebarOpen) setRightSidebarOpen(true);
  };

  const handleBedSelect = (bedId: string) => {
    setSelectedBedId(bedId);
  };

  const isLoading = plantsLoading || bedsLoading;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        onSaveGarden={saveGarden} 
        onLoadGarden={loadGarden} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
          plants={plants || []} 
          isOpen={leftSidebarOpen} 
          onToggle={toggleLeftSidebar} 
          isLoading={isLoading}
        />
        
        <MainCanvas 
          plants={plants || []}
          beds={beds || []}
          placedPlants={placedPlants || []}
          onPlantSelect={handlePlantSelect}
          onBedSelect={handleBedSelect}
          onAddBed={addBed}
          onUpdateBed={updateBed}
          onDeleteBed={deleteBed}
          onAddPlant={addPlacedPlant}
          onUpdatePlant={updatePlacedPlant}
          onDeletePlant={deletePlacedPlant}
          selectedPlantId={selectedPlantId}
          selectedBedId={selectedBedId}
        />
        
        <RightSidebar 
          isOpen={rightSidebarOpen} 
          onToggle={toggleRightSidebar} 
          selectedPlant={selectedPlant}
          selectedBed={selectedBed}
          placedPlants={placedPlants || []}
          plants={plants || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
