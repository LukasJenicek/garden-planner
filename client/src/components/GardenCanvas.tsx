import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Image, Text, Group } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Garden, GardenBed, Plant, PlantInstance, Tool } from "@/types/garden";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrop } from "react-dnd";
import { useGardenEditor } from "@/hooks/useGardenEditor";
import { useGardenTools } from "@/hooks/useGardenTools";
import useImage from "use-image";

interface GardenCanvasProps {
  garden: Garden;
  selectedTool: Tool;
  zoom: number;
  onAddGardenBed: (bed: GardenBed) => void;
  onAddPlant: (plant: Plant) => void;
  onSelectGardenBed: (bed: GardenBed | null) => void;
  onSelectPlant: (plant: Plant | null) => void;
}

// The actual Konva Canvas component
function Canvas({
  garden,
  selectedTool,
  zoom,
  onAddGardenBed,
  onAddPlant,
  onSelectGardenBed,
  onSelectPlant
}: GardenCanvasProps) {
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Import custom hooks
  const { 
    startDrawing, 
    continueDrawing, 
    endDrawing,
    drawingState 
  } = useGardenEditor({
    selectedTool,
    onAddGardenBed,
    scale
  });
  
  const { handleToolOperation } = useGardenTools({
    selectedTool,
    garden,
    onSelectGardenBed,
    onSelectPlant,
  });

  // Set up drop target for plants
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "PLANT",
    drop: (item: Plant, monitor) => {
      if (stageRef.current) {
        const stageBox = stageRef.current.container().getBoundingClientRect();
        const coords = monitor.getClientOffset();
        
        if (coords) {
          // Convert to stage coordinates
          const stageCoords = stageRef.current.getPointerPosition();
          const plantInstance: PlantInstance = {
            ...item,
            instanceId: Date.now(),
            x: stageCoords.x,
            y: stageCoords.y
          };
          
          // Add plant to garden
          onAddPlant(plantInstance);
        }
      }
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Update canvas size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Update scale when zoom changes
  useEffect(() => {
    setScale(zoom / 100);
  }, [zoom]);

  // Render garden beds 
  const renderGardenBeds = () => {
    return garden.beds.map((bed) => {
      switch (bed.type) {
        case 'rectangle':
          return (
            <Rect
              key={bed.id}
              x={bed.x}
              y={bed.y}
              width={bed.width}
              height={bed.height}
              fill="#c7e2b2"
              stroke="#8BC34A"
              strokeWidth={2}
              draggable={selectedTool === "select"}
              onClick={() => handleToolOperation(bed)}
              perfectDrawEnabled={false}
            />
          );
        case 'circle':
          return (
            <Circle
              key={bed.id}
              x={bed.x}
              y={bed.y}
              radius={bed.radius}
              fill="#c7e2b2"
              stroke="#8BC34A"
              strokeWidth={2}
              draggable={selectedTool === "select"}
              onClick={() => handleToolOperation(bed)}
              perfectDrawEnabled={false}
            />
          );
        case 'path':
          return (
            <Line
              key={bed.id}
              points={bed.points}
              fill="#c7e2b2"
              stroke="#8BC34A"
              strokeWidth={2}
              closed={true}
              draggable={selectedTool === "select"}
              onClick={() => handleToolOperation(bed)}
              perfectDrawEnabled={false}
            />
          );
        default:
          return null;
      }
    });
  };

  // Render plants
  const renderPlants = () => {
    return garden.plants.map((plant) => {
      // Show plant image or placeholder
      return (
        <PlantNode 
          key={plant.instanceId} 
          plant={plant}
          onClick={() => handleToolOperation(plant)}
          draggable={selectedTool === "select"}
        />
      );
    });
  };

  // Mouse event handlers
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      if (selectedTool === "select" && e.evt.button === 0) {
        // Panning the canvas with left mouse button
        setIsDragging(true);
      } else {
        // Start drawing with current tool
        const pointerPos = stageRef.current.getPointerPosition();
        startDrawing(pointerPos);
      }
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (isDragging && selectedTool === "select") {
      // Handle panning
      const dx = e.evt.movementX / scale;
      const dy = e.evt.movementY / scale;
      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
    } else if (drawingState.isDrawing) {
      // Continue drawing
      const pointerPos = stageRef.current.getPointerPosition();
      continueDrawing(pointerPos);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
    
    if (drawingState.isDrawing) {
      endDrawing();
    }
  };

  // Render the grid background
  const renderGrid = () => {
    const gridSize = 20;
    const gridColor = "#e5e7eb";
    const gridLines = [];
    
    // Calculate how many lines based on stage size
    const xLines = Math.ceil(stageSize.width / gridSize) + 10;
    const yLines = Math.ceil(stageSize.height / gridSize) + 10;
    
    // Create vertical grid lines
    for (let i = 0; i <= xLines; i++) {
      gridLines.push(
        <Line
          key={`vline-${i}`}
          points={[i * gridSize, 0, i * gridSize, stageSize.height]}
          stroke={gridColor}
          strokeWidth={1}
          perfectDrawEnabled={false}
        />
      );
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= yLines; i++) {
      gridLines.push(
        <Line
          key={`hline-${i}`}
          points={[0, i * gridSize, stageSize.width, i * gridSize]}
          stroke={gridColor}
          strokeWidth={1}
          perfectDrawEnabled={false}
        />
      );
    }
    
    return gridLines;
  };

  // Render temporary drawing elements based on current tool
  const renderDrawingPreview = () => {
    if (!drawingState.isDrawing) return null;
    
    switch (selectedTool) {
      case 'rectangle':
        return (
          <Rect
            x={drawingState.start.x}
            y={drawingState.start.y}
            width={drawingState.current.x - drawingState.start.x}
            height={drawingState.current.y - drawingState.start.y}
            fill="rgba(199, 226, 178, 0.5)"
            stroke="#8BC34A"
            strokeWidth={2}
            dash={[5, 5]}
            perfectDrawEnabled={false}
          />
        );
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(drawingState.current.x - drawingState.start.x, 2) +
          Math.pow(drawingState.current.y - drawingState.start.y, 2)
        );
        return (
          <Circle
            x={drawingState.start.x}
            y={drawingState.start.y}
            radius={radius}
            fill="rgba(199, 226, 178, 0.5)"
            stroke="#8BC34A"
            strokeWidth={2}
            dash={[5, 5]}
            perfectDrawEnabled={false}
          />
        );
      case 'path':
        return (
          <Line
            points={drawingState.points}
            fill="rgba(199, 226, 178, 0.5)"
            stroke="#8BC34A"
            strokeWidth={2}
            dash={[5, 5]}
            closed={false}
            perfectDrawEnabled={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={(node) => {
        containerRef.current = node;
        drop(node);
      }} 
      className="canvas-container w-full h-full relative"
      style={{ cursor: isOver ? 'copy' : 'default' }}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Grid Layer */}
        <Layer>
          {renderGrid()}
        </Layer>
        
        {/* Garden beds layer */}
        <Layer>
          {renderGardenBeds()}
          {renderDrawingPreview()}
        </Layer>
        
        {/* Plants layer */}
        <Layer>
          {renderPlants()}
        </Layer>
      </Stage>
      
      {/* Drop indicator for when dragging plants */}
      {isOver && (
        <div 
          className="absolute w-16 h-16 pointer-events-none border-2 border-dashed border-primary rounded-full bg-primary bg-opacity-10"
          style={{
            left: 
              stageRef.current ? 
              stageRef.current.getPointerPosition().x - 32 : 0,
            top: 
              stageRef.current ? 
              stageRef.current.getPointerPosition().y - 32 : 0,
          }}
        />
      )}
    </div>
  );
}

// Component to render a plant node with image
function PlantNode({ plant, onClick, draggable }: { 
  plant: PlantInstance; 
  onClick: () => void;
  draggable: boolean;
}) {
  const [image] = useImage(plant.imageUrl);
  
  return (
    <Group
      x={plant.x}
      y={plant.y}
      draggable={draggable}
      onClick={onClick}
    >
      <Circle
        radius={32}
        fill={plant.category === 'vegetables' ? '#fee8e8' : 
              plant.category === 'herbs' ? '#e8f5e9' : '#fff8e1'}
        stroke={plant.category === 'vegetables' ? '#ffcdd2' : 
                plant.category === 'herbs' ? '#c8e6c9' : '#ffecb3'}
        strokeWidth={2}
      />
      
      <Circle
        radius={24}
        fillPatternImage={image}
        fillPatternScale={{ x: 48/image?.width || 1, y: 48/image?.height || 1 }}
        fillPatternOffset={{ x: image?.width/2 || 0, y: image?.height/2 || 0 }}
      />
      
      {/* Compatibility indicator */}
      <Circle
        x={16}
        y={-16}
        radius={10}
        fill={plant.compatibility === 'good' ? '#43A047' : 
              plant.compatibility === 'fair' ? '#FFC107' : '#E53935'}
        stroke="white"
        strokeWidth={2}
      />
      
      <Text
        text={plant.name}
        fill="black"
        fontSize={12}
        fontStyle="bold"
        align="center"
        width={80}
        offsetX={40}
        offsetY={-24}
        y={40}
      />
    </Group>
  );
}

// Wrap canvas with DndProvider
export default function GardenCanvas(props: GardenCanvasProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Canvas {...props} />
    </DndProvider>
  );
}
