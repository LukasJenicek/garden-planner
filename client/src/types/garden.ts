// Tool types
export type Tool = 
  | "select" 
  | "rectangle" 
  | "circle" 
  | "path" 
  | "eraser"
  | "text" 
  | "measure" 
  | "zoom";

// Plant compatibility types
export type Compatibility = "good" | "fair" | "poor";

// Plant categories
export type PlantCategory = "vegetables" | "herbs" | "flowers";

// Base Plant type (as defined in the database)
export interface Plant {
  id: number;
  name: string;
  scientificName: string;
  category: PlantCategory;
  imageUrl: string;
  sunRequirement: string;
  waterNeeds: string;
  spacing: string;         // Legacy spacing field (text format)
  spacingCm: number;       // Spacing in centimeters
  diameterCm: number;      // Plant diameter in centimeters
  harvestTime: string;
  goodCompanions: string[];
  badCompanions: string[];
  description?: string;
  compatibility?: Compatibility;
}

// Plant instance (when placed in a garden)
export interface PlantInstance extends Plant {
  instanceId: number;
  x: number;
  y: number;
}

// Garden Bed types
export interface BaseGardenBed {
  id: number;
  name: string;
  sunExposure?: string;
  soilType?: string;
  notes?: string;
}

export interface RectangleGardenBed extends BaseGardenBed {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleGardenBed extends BaseGardenBed {
  type: "circle";
  x: number;
  y: number;
  radius: number;
}

export interface PathGardenBed extends BaseGardenBed {
  type: "path";
  points: number[];
}

export type GardenBed = RectangleGardenBed | CircleGardenBed | PathGardenBed;

// Garden type
export interface Garden {
  id: number;
  name: string;
  beds: GardenBed[];
  plants: PlantInstance[];
  createdAt?: Date;
  updatedAt?: Date;
}
