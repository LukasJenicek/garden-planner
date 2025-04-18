import { useState, useEffect } from "react";
import { Plant, PlantInstance } from "@/types/garden";

export function useDragDrop() {
  const [draggedPlant, setDraggedPlant] = useState<Plant | null>(null);
  const [dropTarget, setDropTarget] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Reset dragging state when component unmounts
  useEffect(() => {
    return () => {
      setDraggedPlant(null);
      setDropTarget(null);
      setIsDragging(false);
    };
  }, []);

  // Handler for when a plant drag starts
  const handleDragStart = (plant: Plant) => {
    setDraggedPlant(plant);
    setIsDragging(true);
  };

  // Handler for when a plant is dropped
  const handleDrop = (x: number, y: number, onPlantAdded: (plant: PlantInstance) => void) => {
    if (draggedPlant) {
      const plantInstance: PlantInstance = {
        ...draggedPlant,
        instanceId: Date.now(),
        x,
        y,
      };
      
      onPlantAdded(plantInstance);
      
      // Reset drag state
      setDraggedPlant(null);
      setDropTarget(null);
      setIsDragging(false);
    }
  };

  // Update the drop target position
  const updateDropPosition = (x: number, y: number) => {
    if (isDragging) {
      setDropTarget({ x, y });
    }
  };

  // Cancel dragging
  const cancelDrag = () => {
    setDraggedPlant(null);
    setDropTarget(null);
    setIsDragging(false);
  };

  return {
    draggedPlant,
    dropTarget,
    isDragging,
    handleDragStart,
    handleDrop,
    updateDropPosition,
    cancelDrag,
  };
}
