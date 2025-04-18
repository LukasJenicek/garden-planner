import { Garden, Plant, GardenBed, Tool } from "@/types/garden";

interface UseGardenToolsProps {
  selectedTool: Tool;
  garden: Garden;
  onSelectGardenBed: (bed: GardenBed | null) => void;
  onSelectPlant: (plant: Plant | null) => void;
}

export function useGardenTools({
  selectedTool,
  garden,
  onSelectGardenBed,
  onSelectPlant
}: UseGardenToolsProps) {
  // Handle mouse interaction with garden elements based on current tool
  const handleToolOperation = (target: GardenBed | Plant) => {
    switch (selectedTool) {
      case "select":
        // When select tool is active, select the target
        if ('type' in target) {
          // Target is a garden bed
          onSelectGardenBed(target);
          onSelectPlant(null);
        } else {
          // Target is a plant
          onSelectPlant(target);
          onSelectGardenBed(null);
        }
        break;
        
      case "eraser":
        // Delete the target
        if ('type' in target) {
          // Target is a garden bed - would remove from garden
          console.log('Erasing garden bed', target);
        } else {
          // Target is a plant - would remove from garden
          console.log('Erasing plant', target);
        }
        break;
        
      case "text":
        // Add a text label near the target
        if ('type' in target) {
          // Add text near garden bed
          console.log('Adding text to garden bed', target);
        } else {
          // Add text near plant
          console.log('Adding text to plant', target);
        }
        break;
        
      case "measure":
        // Measure size or distance of target
        if ('type' in target) {
          // Measure garden bed dimensions
          const { width, height, radius } = target;
          if (width && height) {
            console.log(`Dimensions: ${width}ft × ${height}ft`);
          } else if (radius) {
            console.log(`Radius: ${radius}ft, Diameter: ${radius * 2}ft`);
          }
        } else {
          // Measure distance between plants or area
          console.log('Measuring from plant', target);
        }
        break;
        
      default:
        // For other tools, clear any selection
        onSelectGardenBed(null);
        onSelectPlant(null);
        break;
    }
  };

  return {
    handleToolOperation
  };
}
