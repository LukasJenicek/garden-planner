import { useState, useRef, useEffect } from "react";
import Konva from "konva";
import { GardenBed, BedShape } from "@shared/schema";

export function useCanvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [tool, setTool] = useState<'select' | 'draw' | 'rectangle' | 'circle' | 'polygon'>('select');
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fillColor, setFillColor] = useState('#3E2723'); // dark soil
  const [borderColor, setBorderColor] = useState('#4CAF50'); // garden green
  const [scale, setScale] = useState(1);

  // Update container size
  const updateContainerSize = (container: HTMLElement) => {
    setContainerSize({
      width: container.clientWidth,
      height: container.clientHeight
    });
  };

  // Handle mouse down for drawing
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>, onAddBed: (bed: GardenBed) => void) => {
    if (tool === 'select') return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    setIsDrawing(true);
    
    if (tool === 'rectangle' || tool === 'circle') {
      setDrawingPoints([pos.x, pos.y, pos.x, pos.y]);
    } else if (tool === 'polygon' || tool === 'draw') {
      setDrawingPoints([pos.x, pos.y]);
    }
  };

  // Handle mouse move for drawing
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;
    
    if (tool === 'rectangle' || tool === 'circle') {
      setDrawingPoints([drawingPoints[0], drawingPoints[1], pos.x, pos.y]);
    } else if (tool === 'draw' || tool === 'polygon') {
      setDrawingPoints([...drawingPoints, pos.x, pos.y]);
    }
  };

  // Handle mouse up for drawing
  const handleMouseUp = (onAddBed: (bed: GardenBed) => void) => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (tool === 'rectangle') {
      const x = Math.min(drawingPoints[0], drawingPoints[2]);
      const y = Math.min(drawingPoints[1], drawingPoints[3]);
      const width = Math.abs(drawingPoints[2] - drawingPoints[0]);
      const height = Math.abs(drawingPoints[3] - drawingPoints[1]);
      
      if (width > 20 && height > 20) {
        onAddBed({
          id: `bed-${Date.now()}`,
          shape: 'rectangle',
          x,
          y,
          width,
          height,
          fill: fillColor,
          stroke: borderColor
        });
      }
    } else if (tool === 'circle') {
      const x = drawingPoints[0];
      const y = drawingPoints[1];
      const radius = Math.sqrt(
        Math.pow(drawingPoints[2] - drawingPoints[0], 2) +
        Math.pow(drawingPoints[3] - drawingPoints[1], 2)
      );
      
      if (radius > 10) {
        onAddBed({
          id: `bed-${Date.now()}`,
          shape: 'circle',
          x,
          y,
          radius,
          fill: fillColor,
          stroke: borderColor
        });
      }
    } else if (tool === 'polygon' || tool === 'draw') {
      if (drawingPoints.length >= 6) { // at least 3 points
        onAddBed({
          id: `bed-${Date.now()}`,
          shape: 'polygon',
          x: 0,
          y: 0,
          points: drawingPoints,
          fill: fillColor,
          stroke: borderColor
        });
      }
    }
    
    setDrawingPoints([]);
    setTool('select'); // Reset to select tool after drawing
  };

  // Zoom in/out
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setScale(Math.min(scale + 0.1, 3));
    } else {
      setScale(Math.max(scale - 0.1, 0.5));
    }
  };

  return {
    stageRef,
    containerSize,
    tool,
    setTool,
    drawingPoints,
    isDrawing,
    fillColor,
    setFillColor,
    borderColor,
    setBorderColor,
    scale,
    updateContainerSize,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoom
  };
}
