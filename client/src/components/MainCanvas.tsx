import { useRef, useState, useEffect, MouseEvent } from "react";
import { Stage, Layer, Rect, Circle, Line, Group, RegularPolygon, Star } from "react-konva";
import Konva from "konva";
import { Plant, GardenBed, PlacedPlant, BedShape } from "@shared/schema";
import CanvasControls from "./CanvasControls";

interface MainCanvasProps {
  plants: Plant[];
  beds: GardenBed[];
  placedPlants: PlacedPlant[];
  onPlantSelect: (plantId: number) => void;
  onBedSelect: (bedId: string) => void;
  onAddBed: (bed: GardenBed) => void;
  onUpdateBed: (bed: GardenBed) => void;
  onDeleteBed: (bedId: string) => void;
  onAddPlant: (plant: PlacedPlant) => void;
  onUpdatePlant: (plant: PlacedPlant) => void;
  onDeletePlant: (plantId: string) => void;
  selectedPlantId: number | null;
  selectedBedId: string | null;
}

export default function MainCanvas({
  plants,
  beds,
  placedPlants,
  onPlantSelect,
  onBedSelect,
  onAddBed,
  onUpdateBed,
  onDeleteBed,
  onAddPlant,
  onUpdatePlant,
  onDeletePlant,
  selectedPlantId,
  selectedBedId
}: MainCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [tool, setTool] = useState<'select' | 'draw' | 'rectangle' | 'circle' | 'polygon'>('select');
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fillColor, setFillColor] = useState('#3E2723'); // dark soil
  const [borderColor, setBorderColor] = useState('#4CAF50'); // garden green
  const [scale, setScale] = useState(1);
  const [selectedPlantForDrop, setSelectedPlantForDrop] = useState<Plant | null>(null);
  const [draggedPlantPosition, setDraggedPlantPosition] = useState<{ x: number, y: number } | null>(null);
  const [companionLines, setCompanionLines] = useState<{ fromId: string; toId: string; compatibility: string }[]>([]);
  // We're using SVG-based icons instead of loading external images
  
  // Update container size when window resizes
  useEffect(() => {
    const updateSize = () => {
      if (canvasContainerRef.current) {
        setContainerSize({
          width: canvasContainerRef.current.clientWidth,
          height: canvasContainerRef.current.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Update companion lines whenever placed plants change
  useEffect(() => {
    // Generate companion lines for plants that are near each other
    const lines: { fromId: string; toId: string; compatibility: string }[] = [];
    
    // For simplicity, we'll just connect adjacent plants in the same bed
    // In a real app, this would use the companion data from the API
    placedPlants.forEach((plant, i) => {
      const plantBedId = plant.bedId;
      if (!plantBedId) return;
      
      // Find all other plants in the same bed
      placedPlants.forEach((otherPlant, j) => {
        if (i >= j || otherPlant.bedId !== plantBedId) return;
        
        // Determine compatibility based on distance (placeholder)
        // In a real app, this would be based on the actual companion data
        const distance = Math.sqrt(
          Math.pow(plant.x - otherPlant.x, 2) + 
          Math.pow(plant.y - otherPlant.y, 2)
        );
        
        let compatibility = 'neutral';
        if (distance < 70) compatibility = 'good';
        else if (distance < 150) compatibility = 'warning';
        else compatibility = 'bad';
        
        lines.push({
          fromId: plant.id,
          toId: otherPlant.id,
          compatibility
        });
      });
    });
    
    setCompanionLines(lines);
  }, [placedPlants]);

  // Draw grid
  const gridSize = 20;
  const gridLines = [];
  
  // Vertical lines
  for (let x = 0; x <= containerSize.width; x += gridSize) {
    gridLines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, containerSize.height]}
        stroke="#E2E8F0"
        strokeWidth={1}
      />
    );
  }
  
  // Horizontal lines
  for (let y = 0; y <= containerSize.height; y += gridSize) {
    gridLines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, containerSize.width, y]}
        stroke="#E2E8F0"
        strokeWidth={1}
      />
    );
  }

  // Handle mouse down for drawing
  const handleMouseDown = (e: any) => {
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
  const handleMouseMove = (e: any) => {
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
  const handleMouseUp = () => {
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

  // Handle plant drag from sidebar
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    
    // Update the position for the preview
    const stageRect = stage.container().getBoundingClientRect();
    const x = e.clientX - stageRect.left;
    const y = e.clientY - stageRect.top;
    
    setDraggedPlantPosition({ x, y });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const plantId = e.dataTransfer.getData('plant-id');
    if (!plantId) return;
    
    const plant = plants.find(p => p.id === parseInt(plantId));
    if (!plant) return;
    
    const stage = stageRef.current;
    if (!stage) return;
    
    // Get the position relative to the stage
    const stageRect = stage.container().getBoundingClientRect();
    const x = e.clientX - stageRect.left;
    const y = e.clientY - stageRect.top;
    
    // Find if the plant is being dropped in a garden bed
    const bedId = getBedAtPoint(x, y);
    
    // Add the placed plant
    onAddPlant({
      id: `plant-${Date.now()}`,
      plantId: plant.id,
      x,
      y,
      bedId
    });
    
    setSelectedPlantForDrop(null);
    setDraggedPlantPosition(null);
  };

  // Find which bed contains the given point
  const getBedAtPoint = (x: number, y: number): string | undefined => {
    for (const bed of beds) {
      if (bed.shape === 'rectangle') {
        if (
          x >= bed.x && 
          x <= bed.x + bed.width! && 
          y >= bed.y && 
          y <= bed.y + bed.height!
        ) {
          return bed.id;
        }
      } else if (bed.shape === 'circle') {
        const distance = Math.sqrt(
          Math.pow(x - bed.x, 2) + 
          Math.pow(y - bed.y, 2)
        );
        if (distance <= bed.radius!) {
          return bed.id;
        }
      } else if (bed.shape === 'polygon' && bed.points) {
        // This is a simplification. For production, you'd need a proper
        // point-in-polygon algorithm for non-convex polygons
        // Using ray casting algorithm would be more accurate
        let inside = false;
        for (let i = 0, j = bed.points.length / 2 - 1; i < bed.points.length / 2; j = i++) {
          const xi = bed.points[i * 2];
          const yi = bed.points[i * 2 + 1];
          const xj = bed.points[j * 2];
          const yj = bed.points[j * 2 + 1];
          
          const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        if (inside) return bed.id;
      }
    }
    return undefined;
  };

  // Zoom in/out
  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setScale(Math.min(scale + 0.1, 3));
    } else {
      setScale(Math.max(scale - 0.1, 0.5));
    }
  };

  // Get vegetable icon component based on plant type
  const getVegetableIcon = (plantType: string, isSelected: boolean) => {
    // Convert to lowercase for easier matching
    const type = plantType.toLowerCase();
    
    // More realistic vegetable icons using shapes
    if (type.includes('tomato')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Circle radius={10} fill="#e53935" />
        </Group>
      );
    } else if (type.includes('carrot')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <RegularPolygon
            sides={3}
            radius={12}
            fill="#ff7043"
            rotation={180}
          />
          <Circle radius={3} fill="#66bb6a" y={-12} />
        </Group>
      );
    } else if (type.includes('lettuce') || type.includes('cabbage')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <RegularPolygon
            sides={12}
            radius={10}
            fill="#66bb6a"
          />
        </Group>
      );
    } else if (type.includes('cucumber')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Rect
            width={18}
            height={8}
            cornerRadius={4}
            fill="#43a047"
            offsetX={9}
            offsetY={4}
          />
        </Group>
      );
    } else if (type.includes('pepper')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Circle radius={8} fill="#e53935" />
          <Rect width={3} height={5} fill="#4caf50" offsetX={1.5} offsetY={2.5} y={-10} />
        </Group>
      );
    } else if (type.includes('bean') || type.includes('pea')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Circle radius={3} fill="#7cb342" x={-5} y={-5} />
          <Circle radius={3} fill="#7cb342" x={0} y={-2} />
          <Circle radius={3} fill="#7cb342" x={5} y={0} />
          <Circle radius={3} fill="#7cb342" x={3} y={5} />
        </Group>
      );
    } else if (type.includes('onion')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Circle radius={10} fill="#d1c4e9" />
        </Group>
      );
    } else if (type.includes('potato')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Circle radius={10} fill="#a1887f" />
        </Group>
      );
    } else if (type.includes('corn')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Rect width={6} height={18} fill="#fdd835" offsetX={3} offsetY={9} cornerRadius={3} />
          <Rect width={3} height={8} fill="#4caf50" offsetX={1.5} offsetY={4} x={-6} y={-8} rotation={-20} />
          <Rect width={3} height={6} fill="#4caf50" offsetX={1.5} offsetY={3} x={7} y={-7} rotation={20} />
        </Group>
      );
    } else if (type.includes('herb')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Star
            numPoints={5}
            innerRadius={5}
            outerRadius={10}
            fill="#66bb6a"
          />
        </Group>
      );
    } else if (type.includes('flower')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Star
            numPoints={8}
            innerRadius={5}
            outerRadius={10}
            fill="#ffca28"
          />
        </Group>
      );
    } else if (type.includes('broccoli')) {
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <Circle radius={8} fill="#2e7d32" />
          <Rect width={4} height={8} fill="#a5d6a7" offsetX={2} offsetY={4} y={8} />
        </Group>
      );
    } else {
      // Default fallback shape for other vegetables
      return (
        <Group>
          <Circle radius={13} fill={isSelected ? "#FFCC80" : "transparent"} stroke={isSelected ? "#FF9800" : "transparent"} strokeWidth={2} />
          <RegularPolygon
            sides={6}
            radius={10}
            fill={type.includes('vegetable') ? "#4CAF50" : 
                  type.includes('herb') ? "#8BC34A" : "#FFC107"}
          />
        </Group>
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-light-soil">
      <CanvasControls 
        activeTool={tool} 
        onToolChange={setTool} 
        fillColor={fillColor}
        borderColor={borderColor}
        onFillColorChange={setFillColor}
        onBorderColorChange={setBorderColor}
        onZoom={handleZoom}
      />
      
      <div 
        className="flex-1 overflow-hidden relative"
        ref={canvasContainerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="canvas-container w-full h-full overflow-auto">
          <Stage
            ref={stageRef}
            width={containerSize.width}
            height={containerSize.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              {/* Grid */}
              {gridLines}
              
              {/* Garden beds */}
              {beds.map(bed => {
                const isSelected = bed.id === selectedBedId;
                
                if (bed.shape === 'rectangle') {
                  return (
                    <Rect
                      key={bed.id}
                      x={bed.x}
                      y={bed.y}
                      width={bed.width || 0}
                      height={bed.height || 0}
                      fill={bed.fill}
                      stroke={isSelected ? '#FF9800' : bed.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      cornerRadius={10}
                      onClick={() => onBedSelect(bed.id)}
                      onTap={() => onBedSelect(bed.id)}
                      draggable={tool === 'select'}
                      onDragEnd={(e) => {
                        onUpdateBed({
                          ...bed,
                          x: e.target.x(),
                          y: e.target.y()
                        });
                      }}
                      onContextMenu={(e) => {
                        // Show delete option on right click
                        e.evt.preventDefault();
                        if (window.confirm('Delete this garden bed?')) {
                          onDeleteBed(bed.id);
                        }
                      }}
                    />
                  );
                } else if (bed.shape === 'circle') {
                  return (
                    <Circle
                      key={bed.id}
                      x={bed.x}
                      y={bed.y}
                      radius={bed.radius || 0}
                      fill={bed.fill}
                      stroke={isSelected ? '#FF9800' : bed.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      onClick={() => onBedSelect(bed.id)}
                      onTap={() => onBedSelect(bed.id)}
                      draggable={tool === 'select'}
                      onDragEnd={(e) => {
                        onUpdateBed({
                          ...bed,
                          x: e.target.x(),
                          y: e.target.y()
                        });
                      }}
                      onContextMenu={(e) => {
                        // Show delete option on right click
                        e.evt.preventDefault();
                        if (window.confirm('Delete this garden bed?')) {
                          onDeleteBed(bed.id);
                        }
                      }}
                    />
                  );
                } else if (bed.shape === 'polygon' && bed.points) {
                  return (
                    <Line
                      key={bed.id}
                      points={bed.points}
                      fill={bed.fill}
                      stroke={isSelected ? '#FF9800' : bed.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      closed
                      onClick={() => onBedSelect(bed.id)}
                      onTap={() => onBedSelect(bed.id)}
                      draggable={tool === 'select'}
                      onDragEnd={(e) => {
                        // For polygons, we need to update all points
                        const newPoints = [...bed.points!];
                        const dx = e.target.x();
                        const dy = e.target.y();
                        
                        // Reset position and return to original spot
                        e.target.position({ x: 0, y: 0 });
                        
                        // Update all points
                        for (let i = 0; i < newPoints.length; i += 2) {
                          newPoints[i] += dx;
                          newPoints[i + 1] += dy;
                        }
                        
                        onUpdateBed({
                          ...bed,
                          points: newPoints
                        });
                      }}
                      onContextMenu={(e) => {
                        // Show delete option on right click
                        e.evt.preventDefault();
                        if (window.confirm('Delete this garden bed?')) {
                          onDeleteBed(bed.id);
                        }
                      }}
                    />
                  );
                }
                return null;
              })}
              
              {/* Companion lines */}
              {companionLines.map(line => {
                const fromPlant = placedPlants.find(p => p.id === line.fromId);
                const toPlant = placedPlants.find(p => p.id === line.toId);
                
                if (!fromPlant || !toPlant) return null;
                
                let strokeColor = '#000';
                if (line.compatibility === 'good') strokeColor = '#43A047';
                else if (line.compatibility === 'warning') strokeColor = '#FFC107';
                else if (line.compatibility === 'bad') strokeColor = '#E53935';
                
                return (
                  <Line
                    key={`${line.fromId}-${line.toId}`}
                    points={[fromPlant.x, fromPlant.y, toPlant.x, toPlant.y]}
                    stroke={strokeColor}
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.6}
                  />
                );
              })}
              
              {/* Plants */}
              {placedPlants.map(plant => {
                const plantInfo = plants.find(p => p.id === plant.plantId);
                if (!plantInfo) return null;
                
                const isSelected = plantInfo.id === selectedPlantId;
                let borderStyle = 'transparent';
                
                // Determine compatibility border
                const isInBed = !!plant.bedId;
                if (isInBed) {
                  // Check if this plant has any compatibility issues with nearby plants
                  const hasGoodCompanion = companionLines.some(
                    line => (line.fromId === plant.id || line.toId === plant.id) && line.compatibility === 'good'
                  );
                  
                  const hasBadCompanion = companionLines.some(
                    line => (line.fromId === plant.id || line.toId === plant.id) && line.compatibility === 'bad'
                  );
                  
                  const hasWarningCompanion = companionLines.some(
                    line => (line.fromId === plant.id || line.toId === plant.id) && line.compatibility === 'warning'
                  );
                  
                  if (hasBadCompanion) {
                    borderStyle = '#E53935'; // Incompatible
                  } else if (hasWarningCompanion) {
                    borderStyle = '#FFC107'; // Warning
                  } else if (hasGoodCompanion) {
                    borderStyle = '#43A047'; // Compatible
                  }
                }
                
                // We're now using vector graphics for plant icons
                
                return (
                  <Group
                    key={plant.id}
                    x={plant.x}
                    y={plant.y}
                    draggable={tool === 'select'}
                    onClick={() => onPlantSelect(plantInfo.id)}
                    onTap={() => onPlantSelect(plantInfo.id)}
                    onDragEnd={(e) => {
                      const newX = e.target.x();
                      const newY = e.target.y();
                      const newBedId = getBedAtPoint(newX, newY);
                      
                      onUpdatePlant({
                        ...plant,
                        x: newX,
                        y: newY,
                        bedId: newBedId
                      });
                    }}
                    onContextMenu={(e) => {
                      // Show a delete option on right-click
                      e.evt.preventDefault();
                      if (window.confirm('Delete this plant?')) {
                        onDeletePlant(plant.id);
                      }
                    }}
                  >
                    {/* Plant compatibility border */}
                    {borderStyle !== 'transparent' && (
                      <Circle
                        radius={17}
                        fill="transparent"
                        stroke={borderStyle}
                        strokeWidth={2}
                      />
                    )}
                    
                    {/* Use custom vegetable icons */}
                    {getVegetableIcon(plantInfo.name, isSelected)}
                  </Group>
                );
              })}
              
              {/* Preview of current drawing */}
              {isDrawing && (
                <>
                  {tool === 'rectangle' && drawingPoints.length === 4 && (
                    <Rect
                      x={Math.min(drawingPoints[0], drawingPoints[2])}
                      y={Math.min(drawingPoints[1], drawingPoints[3])}
                      width={Math.abs(drawingPoints[2] - drawingPoints[0])}
                      height={Math.abs(drawingPoints[3] - drawingPoints[1])}
                      fill={fillColor}
                      stroke={borderColor}
                      strokeWidth={2}
                      dash={[5, 5]}
                      cornerRadius={10}
                    />
                  )}
                  
                  {tool === 'circle' && drawingPoints.length === 4 && (
                    <Circle
                      x={drawingPoints[0]}
                      y={drawingPoints[1]}
                      radius={Math.sqrt(
                        Math.pow(drawingPoints[2] - drawingPoints[0], 2) +
                        Math.pow(drawingPoints[3] - drawingPoints[1], 2)
                      )}
                      fill={fillColor}
                      stroke={borderColor}
                      strokeWidth={2}
                      dash={[5, 5]}
                    />
                  )}
                  
                  {(tool === 'polygon' || tool === 'draw') && drawingPoints.length >= 2 && (
                    <Line
                      points={drawingPoints}
                      fill={tool === 'polygon' ? fillColor : undefined}
                      stroke={borderColor}
                      strokeWidth={2}
                      dash={[5, 5]}
                      closed={tool === 'polygon'}
                    />
                  )}
                </>
              )}
              
              {/* Preview of plant being dragged */}
              {draggedPlantPosition && selectedPlantForDrop && (
                <Circle
                  x={draggedPlantPosition.x}
                  y={draggedPlantPosition.y}
                  radius={14}
                  fill="#4CAF50"
                  opacity={0.6}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}