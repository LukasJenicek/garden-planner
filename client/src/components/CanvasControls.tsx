import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface CanvasControlsProps {
  activeTool: string;
  onToolChange: (tool: 'select' | 'draw' | 'rectangle' | 'circle' | 'polygon') => void;
  fillColor: string;
  borderColor: string;
  onFillColorChange: (color: string) => void;
  onBorderColorChange: (color: string) => void;
  onZoom: (direction: 'in' | 'out') => void;
}

export default function CanvasControls({
  activeTool,
  onToolChange,
  fillColor,
  borderColor,
  onFillColorChange,
  onBorderColorChange,
  onZoom
}: CanvasControlsProps) {
  const [showFillColorPicker, setShowFillColorPicker] = useState(false);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const fillPickerRef = useRef<HTMLDivElement>(null);
  const borderPickerRef = useRef<HTMLDivElement>(null);
  
  // Close the color picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        fillPickerRef.current && 
        !fillPickerRef.current.contains(event.target as Node)
      ) {
        setShowFillColorPicker(false);
      }
      if (
        borderPickerRef.current && 
        !borderPickerRef.current.contains(event.target as Node)
      ) {
        setShowBorderColorPicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const colorOptions = [
    { name: 'Dark Soil', value: '#3E2723' },
    { name: 'Light Soil', value: '#795548' },
    { name: 'Garden Green', value: '#4CAF50' },
    { name: 'Leaf Green', value: '#8BC34A' },
    { name: 'Harvest Orange', value: '#FF9800' },
  ];

  return (
    <div className="bg-white shadow-sm p-2 flex items-center space-x-2 overflow-x-auto">
      {/* Select tool */}
      <button 
        className={`tool-btn p-2 rounded-md hover:bg-opacity-90 focus:outline-none ${
          activeTool === 'select' 
            ? 'bg-leaf-green text-white' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
        onClick={() => onToolChange('select')}
        title="Select Tool"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Draw tool */}
      <button 
        className={`tool-btn p-2 rounded-md hover:bg-opacity-90 focus:outline-none ${
          activeTool === 'draw' 
            ? 'bg-leaf-green text-white' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
        onClick={() => onToolChange('draw')}
        title="Draw Tool"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
      
      {/* Rectangle tool */}
      <button 
        className={`tool-btn p-2 rounded-md hover:bg-opacity-90 focus:outline-none ${
          activeTool === 'rectangle' 
            ? 'bg-leaf-green text-white' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
        onClick={() => onToolChange('rectangle')}
        title="Rectangle Tool"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
        </svg>
      </button>
      
      {/* Circle tool */}
      <button 
        className={`tool-btn p-2 rounded-md hover:bg-opacity-90 focus:outline-none ${
          activeTool === 'circle' 
            ? 'bg-leaf-green text-white' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
        onClick={() => onToolChange('circle')}
        title="Circle Tool"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="10" r="8" />
        </svg>
      </button>
      
      {/* Polygon tool */}
      <button 
        className={`tool-btn p-2 rounded-md hover:bg-opacity-90 focus:outline-none ${
          activeTool === 'polygon' 
            ? 'bg-leaf-green text-white' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`}
        onClick={() => onToolChange('polygon')}
        title="Polygon Tool"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
        </svg>
      </button>
      
      <div className="h-6 border-l border-gray-300 mx-1"></div>
      
      {/* Zoom out */}
      <button 
        className="bg-white text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none border border-gray-300"
        onClick={() => onZoom('out')}
        title="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Zoom in */}
      <button 
        className="bg-white text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none border border-gray-300"
        onClick={() => onZoom('in')}
        title="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div className="h-6 border-l border-gray-300 mx-1"></div>
      
      {/* Fill color picker */}
      <div className="flex items-center relative">
        <span className="text-sm mr-2">Fill:</span>
        <div 
          className="w-6 h-6 rounded-md cursor-pointer border border-gray-400"
          style={{ backgroundColor: fillColor }}
          onClick={() => setShowFillColorPicker(!showFillColorPicker)}
        ></div>
        
        {showFillColorPicker && (
          <div 
            ref={fillPickerRef} 
            className="color-picker-popup z-50"
            style={{ 
              position: 'fixed', 
              top: '50px', 
              left: '50%', 
              transform: 'translateX(-50%)'
            }}
          >
            <HexColorPicker 
              color={fillColor} 
              onChange={onFillColorChange} 
            />
            <div className="mt-2">
              <div className="text-center mb-2 text-sm font-medium">Preset Colors</div>
              <div className="grid grid-cols-5 gap-1">
                {colorOptions.map(color => (
                  <div 
                    key={color.value}
                    className="w-6 h-6 rounded-md cursor-pointer border border-gray-300 hover:border-gray-600"
                    style={{ backgroundColor: color.value }}
                    onClick={() => {
                      onFillColorChange(color.value);
                      setShowFillColorPicker(false);
                    }}
                    title={color.name}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Border color picker */}
      <div className="flex items-center relative">
        <span className="text-sm mr-2">Border:</span>
        <div 
          className="w-6 h-6 rounded-md cursor-pointer border border-gray-400"
          style={{ backgroundColor: borderColor }}
          onClick={() => setShowBorderColorPicker(!showBorderColorPicker)}
        ></div>
        
        {showBorderColorPicker && (
          <div 
            ref={borderPickerRef} 
            className="color-picker-popup z-50"
            style={{ 
              position: 'fixed', 
              top: '50px', 
              left: '50%', 
              transform: 'translateX(-50%)'
            }}
          >
            <HexColorPicker 
              color={borderColor} 
              onChange={onBorderColorChange} 
            />
            <div className="mt-2">
              <div className="text-center mb-2 text-sm font-medium">Preset Colors</div>
              <div className="grid grid-cols-5 gap-1">
                {colorOptions.map(color => (
                  <div 
                    key={color.value}
                    className="w-6 h-6 rounded-md cursor-pointer border border-gray-300 hover:border-gray-600"
                    style={{ backgroundColor: color.value }}
                    onClick={() => {
                      onBorderColorChange(color.value);
                      setShowBorderColorPicker(false);
                    }}
                    title={color.name}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
