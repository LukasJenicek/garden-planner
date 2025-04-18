import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GardenBed } from "@/types/garden";
import { X } from "lucide-react";

interface GardenInfoPanelProps {
  gardenBed: GardenBed;
  onClose: () => void;
  onUpdate: (updated: GardenBed) => void;
}

export default function GardenInfoPanel({ gardenBed, onClose, onUpdate }: GardenInfoPanelProps) {
  const [name, setName] = useState(gardenBed.name || "Garden Bed");
  const [width, setWidth] = useState(gardenBed.width?.toString() || "4");
  const [height, setHeight] = useState(gardenBed.height?.toString() || "8");
  const [sunExposure, setSunExposure] = useState(gardenBed.sunExposure || "Full Sun");
  const [soilType, setSoilType] = useState(gardenBed.soilType || "Loam");
  const [notes, setNotes] = useState(gardenBed.notes || "");

  const handleSave = () => {
    const updated = {
      ...gardenBed,
      name,
      width: parseFloat(width),
      height: parseFloat(height),
      sunExposure,
      soilType,
      notes
    };
    onUpdate(updated);
  };

  return (
    <div className="absolute bottom-0 right-0 bg-white shadow-lg rounded-tl-lg w-72 transform transition-transform">
      <div className="bg-primary text-white p-3 rounded-tl-lg flex justify-between items-center">
        <h3 className="font-['Montserrat'] font-medium">Garden Bed Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-gray-200 h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">Bed Name</Label>
          <Input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2 border rounded text-sm"
          />
        </div>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">Dimensions</Label>
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={width} 
              onChange={(e) => setWidth(e.target.value)} 
              className="w-full p-2 border rounded text-sm"
            />
            <span className="flex items-center">×</span>
            <Input 
              type="text" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              className="w-full p-2 border rounded text-sm"
            />
            <span className="flex items-center text-sm">ft</span>
          </div>
        </div>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">Sun Exposure</Label>
          <Select value={sunExposure} onValueChange={setSunExposure}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sun exposure" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Sun">Full Sun</SelectItem>
              <SelectItem value="Partial Sun">Partial Sun</SelectItem>
              <SelectItem value="Shade">Shade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">Soil Type</Label>
          <Select value={soilType} onValueChange={setSoilType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select soil type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Loam">Loam</SelectItem>
              <SelectItem value="Clay">Clay</SelectItem>
              <SelectItem value="Sandy">Sandy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1">Notes</Label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            className="w-full p-2 border rounded text-sm"
            rows={2}
          />
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary-dark"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
