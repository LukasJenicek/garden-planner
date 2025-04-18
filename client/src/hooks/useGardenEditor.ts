import { useState } from "react";
import { GardenBed, Tool } from "@/types/garden";

interface UseGardenEditorProps {
  selectedTool: Tool;
  onAddGardenBed: (bed: GardenBed) => void;
  scale: number;
}

interface DrawingState {
  isDrawing: boolean;
  start: { x: number; y: number };
  current: { x: number; y: number };
  points: number[];
}

export function useGardenEditor({ selectedTool, onAddGardenBed, scale }: UseGardenEditorProps) {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    points: [],
  });

  // Start drawing operation
  const startDrawing = (position: { x: number; y: number }) => {
    if (selectedTool === "select") return;
    
    setDrawingState({
      isDrawing: true,
      start: position,
      current: position,
      points: selectedTool === "path" ? [position.x, position.y] : [],
    });
  };

  // Continue drawing operation as mouse moves
  const continueDrawing = (position: { x: number; y: number }) => {
    if (!drawingState.isDrawing) return;
    
    if (selectedTool === "path") {
      // For path, add points as we move
      setDrawingState(prev => ({
        ...prev,
        current: position,
        points: [...prev.points, position.x, position.y],
      }));
    } else {
      // For rectangle and circle, just update current position
      setDrawingState(prev => ({
        ...prev,
        current: position,
      }));
    }
  };

  // Finish drawing and create a garden bed
  const endDrawing = () => {
    if (!drawingState.isDrawing) return;
    
    // Only create bed if there's a meaningful area
    const minSize = 20 / scale; // Minimum 20px size
    
    switch (selectedTool) {
      case "rectangle": {
        const width = Math.abs(drawingState.current.x - drawingState.start.x);
        const height = Math.abs(drawingState.current.y - drawingState.start.y);
        
        if (width > minSize && height > minSize) {
          // Normalize coordinates to top-left origin
          const x = Math.min(drawingState.start.x, drawingState.current.x);
          const y = Math.min(drawingState.start.y, drawingState.current.y);
          
          const newBed: GardenBed = {
            id: Date.now(),
            type: "rectangle",
            x,
            y,
            width,
            height,
            name: "Garden Bed",
          };
          
          onAddGardenBed(newBed);
        }
        break;
      }
        
      case "circle": {
        const radius = Math.sqrt(
          Math.pow(drawingState.current.x - drawingState.start.x, 2) +
          Math.pow(drawingState.current.y - drawingState.start.y, 2)
        );
        
        if (radius > minSize) {
          const newBed: GardenBed = {
            id: Date.now(),
            type: "circle",
            x: drawingState.start.x,
            y: drawingState.start.y,
            radius,
            name: "Circular Garden",
          };
          
          onAddGardenBed(newBed);
        }
        break;
      }
        
      case "path": {
        if (drawingState.points.length >= 6) { // At least 3 points
          const newBed: GardenBed = {
            id: Date.now(),
            type: "path",
            points: drawingState.points,
            name: "Custom Garden",
          };
          
          onAddGardenBed(newBed);
        }
        break;
      }
    }
    
    // Reset drawing state
    setDrawingState({
      isDrawing: false,
      start: { x: 0, y: 0 },
      current: { x: 0, y: 0 },
      points: [],
    });
  };

  return {
    drawingState,
    startDrawing,
    continueDrawing,
    endDrawing,
  };
}
