import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";

interface ControlBarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSelectTemplate: (template: string) => void;
  isSaving: boolean;
}

export default function ControlBar({
  onSave,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onSelectTemplate,
  isSaving
}: ControlBarProps) {
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  return (
    <div className="bg-white p-3 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button 
          variant="default" 
          className="bg-primary hover:bg-primary-dark flex items-center gap-1" 
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <i className="far fa-save mr-1"></i>
          )}
          <span>Save</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onUndo}
            className="text-dark hover:text-primary"
          >
            <i className="fas fa-undo"></i>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRedo}
            className="text-dark hover:text-primary"
          >
            <i className="fas fa-redo"></i>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex border rounded overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm"
            className="px-2 py-1 border-r hover:bg-gray-100 rounded-none h-8"
            onClick={onZoomOut}
          >
            <i className="fas fa-search-minus text-sm"></i>
          </Button>
          
          <span className="px-3 py-1 flex items-center text-sm">{zoom}%</span>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="px-2 py-1 border-l hover:bg-gray-100 rounded-none h-8"
            onClick={onZoomIn}
          >
            <i className="fas fa-search-plus text-sm"></i>
          </Button>
        </div>
        
        <DropdownMenu 
          open={isTemplateMenuOpen} 
          onOpenChange={setIsTemplateMenuOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Templates</span>
              <i className="fas fa-chevron-down text-xs"></i>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-48">
            <div className="p-2 border-b text-xs text-gray-500">
              Select garden template
            </div>
            <DropdownMenuItem onClick={() => onSelectTemplate("raised-bed")}>
              Raised Bed (4x8)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectTemplate("square-foot")}>
              Square Foot Garden
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectTemplate("circular")}>
              Circular Garden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
