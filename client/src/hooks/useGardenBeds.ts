import { useState, useEffect } from "react";
import { GardenBed, PlacedPlant } from "@shared/schema";
import { nanoid } from "nanoid";
import { useQuery } from "@tanstack/react-query";

export function useGardenBeds() {
  const [beds, setBeds] = useState<GardenBed[]>([]);
  const [placedPlants, setPlacedPlants] = useState<PlacedPlant[]>([]);
  
  // We would typically fetch this from the API
  // For now, we'll manage it in local state and work with the API 
  // when saving/loading garden layouts
  const { data: layouts, isLoading } = useQuery({ 
    queryKey: ['/api/garden-layouts'],
    // This will be null initially since we have no layouts
    enabled: false
  });

  // Load any saved layouts
  useEffect(() => {
    if (layouts && layouts.length > 0) {
      // Use the most recent layout
      const latestLayout = layouts[layouts.length - 1];
      setBeds(latestLayout.beds);
      setPlacedPlants(latestLayout.plants);
    }
  }, [layouts]);

  // Add new garden bed
  const addBed = (bed: GardenBed) => {
    const newBed = {
      ...bed,
      id: bed.id || nanoid()
    };
    setBeds(prevBeds => [...prevBeds, newBed]);
    return newBed;
  };

  // Update garden bed
  const updateBed = (bed: GardenBed) => {
    setBeds(prevBeds => 
      prevBeds.map(b => b.id === bed.id ? bed : b)
    );
    return bed;
  };

  // Delete garden bed
  const deleteBed = (bedId: string) => {
    setBeds(prevBeds => prevBeds.filter(b => b.id !== bedId));
    
    // Also remove any plants from the deleted bed
    setPlacedPlants(prevPlants => 
      prevPlants.filter(p => p.bedId !== bedId)
    );
    
    return true;
  };

  // Add placed plant
  const addPlacedPlant = (plant: PlacedPlant) => {
    const newPlant = {
      ...plant,
      id: plant.id || nanoid()
    };
    setPlacedPlants(prevPlants => [...prevPlants, newPlant]);
    return newPlant;
  };

  // Update placed plant
  const updatePlacedPlant = (plant: PlacedPlant) => {
    setPlacedPlants(prevPlants => 
      prevPlants.map(p => p.id === plant.id ? plant : p)
    );
    return plant;
  };

  // Delete placed plant
  const deletePlacedPlant = (plantId: string) => {
    setPlacedPlants(prevPlants => 
      prevPlants.filter(p => p.id !== plantId)
    );
    return true;
  };

  return {
    beds,
    placedPlants,
    addBed,
    updateBed,
    deleteBed,
    addPlacedPlant,
    updatePlacedPlant,
    deletePlacedPlant,
    isLoading
  };
}
