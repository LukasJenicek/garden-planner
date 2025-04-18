import {
  Plant,
  InsertPlant,
  CompanionRelationship,
  InsertCompanionRelationship,
  GardenLayout,
  InsertGardenLayout,
  GardenBed,
  PlacedPlant
} from "@shared/schema";

export interface IStorage {
  // Plant methods
  getAllPlants(): Promise<Plant[]>;
  getPlant(id: number): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
  
  // Companion relationship methods
  getCompanionRelationships(plantId: number): Promise<CompanionRelationship[]>;
  createCompanionRelationship(relationship: InsertCompanionRelationship): Promise<CompanionRelationship>;
  
  // Garden layout methods
  getAllGardenLayouts(): Promise<GardenLayout[]>;
  getGardenLayout(id: number): Promise<GardenLayout | undefined>;
  createGardenLayout(layout: InsertGardenLayout): Promise<GardenLayout>;
  updateGardenLayout(id: number, layout: Partial<InsertGardenLayout>): Promise<GardenLayout | undefined>;
  deleteGardenLayout(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private plants: Map<number, Plant>;
  private companionRelationships: Map<number, CompanionRelationship>;
  private gardenLayouts: Map<number, GardenLayout>;
  private currentPlantId: number;
  private currentRelationshipId: number;
  private currentLayoutId: number;

  constructor() {
    this.plants = new Map();
    this.companionRelationships = new Map();
    this.gardenLayouts = new Map();
    this.currentPlantId = 1;
    this.currentRelationshipId = 1;
    this.currentLayoutId = 1;
    
    // Initialize with default plants
    this.initializePlants();
    this.initializeCompanionRelationships();
  }

  // Plant methods
  async getAllPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const id = this.currentPlantId++;
    const plant: Plant = { ...insertPlant, id };
    this.plants.set(id, plant);
    return plant;
  }

  // Companion relationship methods
  async getCompanionRelationships(plantId: number): Promise<CompanionRelationship[]> {
    return Array.from(this.companionRelationships.values())
      .filter(rel => rel.plantId === plantId);
  }

  async createCompanionRelationship(insertRelationship: InsertCompanionRelationship): Promise<CompanionRelationship> {
    const id = this.currentRelationshipId++;
    const relationship: CompanionRelationship = { 
      ...insertRelationship, 
      id,
      notes: insertRelationship.notes || null 
    };
    this.companionRelationships.set(id, relationship);
    return relationship;
  }

  // Garden layout methods
  async getAllGardenLayouts(): Promise<GardenLayout[]> {
    return Array.from(this.gardenLayouts.values());
  }

  async getGardenLayout(id: number): Promise<GardenLayout | undefined> {
    return this.gardenLayouts.get(id);
  }

  async createGardenLayout(insertLayout: InsertGardenLayout): Promise<GardenLayout> {
    const id = this.currentLayoutId++;
    const layout: GardenLayout = { ...insertLayout, id };
    this.gardenLayouts.set(id, layout);
    return layout;
  }

  async updateGardenLayout(id: number, updates: Partial<InsertGardenLayout>): Promise<GardenLayout | undefined> {
    const layout = this.gardenLayouts.get(id);
    if (!layout) return undefined;
    
    const updatedLayout: GardenLayout = { 
      ...layout, 
      ...updates 
    };
    
    this.gardenLayouts.set(id, updatedLayout);
    return updatedLayout;
  }

  async deleteGardenLayout(id: number): Promise<boolean> {
    return this.gardenLayouts.delete(id);
  }

  // Initialize default data
  private initializePlants() {
    const defaultPlants: InsertPlant[] = [
      {
        name: 'Tomato',
        category: 'vegetable',
        icon: 'circle',
        color: '#E53E3E', // red-600
        growingInfo: 'Full sun, water regularly. Grows 4-6 feet tall.',
        harvestTime: '70-85 days from transplant',
        spacingCm: 60, // 60 cm spacing between plants
        diameterCm: 45  // 45 cm plant diameter
      },
      {
        name: 'Carrot',
        category: 'vegetable',
        icon: 'line',
        color: '#ED8936', // orange-500
        growingInfo: 'Full sun to partial shade, water consistently.',
        harvestTime: '60-80 days from seed',
        spacingCm: 8,  // 8 cm spacing between plants
        diameterCm: 5  // 5 cm plant diameter
      },
      {
        name: 'Lettuce',
        category: 'vegetable',
        icon: 'leaf',
        color: '#8BC34A', // leaf-green
        growingInfo: 'Partial shade, water regularly.',
        harvestTime: '45-60 days from seed',
        spacingCm: 20, // 20 cm spacing between plants
        diameterCm: 15 // 15 cm plant diameter
      },
      {
        name: 'Cucumber',
        category: 'vegetable',
        icon: 'rectangle',
        color: '#276749', // green-800
        growingInfo: 'Full sun, water deeply.',
        harvestTime: '50-70 days from seed',
        spacingCm: 90, // 90 cm spacing between plants
        diameterCm: 60 // 60 cm plant diameter for vining varieties
      },
      {
        name: 'Onion',
        category: 'vegetable',
        icon: 'circle',
        color: '#B794F4', // purple-400
        growingInfo: 'Full sun, regular water.',
        harvestTime: '90-110 days from transplant',
        spacingCm: 12, // 12 cm spacing between plants
        diameterCm: 8  // 8 cm plant diameter
      },
      {
        name: 'Bell Pepper',
        category: 'vegetable',
        icon: 'square',
        color: '#C53030', // red-700
        growingInfo: 'Full sun, consistent moisture.',
        harvestTime: '60-90 days from transplant',
        spacingCm: 50, // 50 cm spacing between plants
        diameterCm: 30 // 30 cm plant diameter
      },
      {
        name: 'Basil',
        category: 'herb',
        icon: 'triangle',
        color: '#2F855A', // green-700
        growingInfo: 'Full sun, moderate water.',
        harvestTime: '30-60 days from seed for usable leaves',
        spacingCm: 30, // 30 cm spacing between plants
        diameterCm: 20 // 20 cm plant diameter
      },
      {
        name: 'Mint',
        category: 'herb',
        icon: 'triangle',
        color: '#38A169', // green-600
        growingInfo: 'Partial shade, regular water, grows aggressively - consider containers.',
        harvestTime: '30 days from planting for usable leaves',
        spacingCm: 45, // 45 cm spacing between plants (if not contained)
        diameterCm: 30 // 30 cm plant diameter
      },
      {
        name: 'Rosemary',
        category: 'herb',
        icon: 'triangle',
        color: '#285E61', // teal-800
        growingInfo: 'Full sun, well-drained soil, drought tolerant once established.',
        harvestTime: '70-80 days from transplant for usable leaves',
        spacingCm: 60, // 60 cm spacing between plants
        diameterCm: 40 // 40 cm plant diameter (for mature plant)
      },
      {
        name: 'Thyme',
        category: 'herb',
        icon: 'triangle',
        color: '#319795', // teal-600
        growingInfo: 'Full sun, well-drained soil, drought tolerant.',
        harvestTime: '40-60 days from planting for usable leaves',
        spacingCm: 25, // 25 cm spacing between plants
        diameterCm: 15 // 15 cm plant diameter
      }
    ];

    defaultPlants.forEach(plant => {
      const id = this.currentPlantId++;
      // Ensure spacingCm and diameterCm values are set
      const spacingCm = plant.spacingCm || 30;
      const diameterCm = plant.diameterCm || 20;
      this.plants.set(id, { ...plant, id, spacingCm, diameterCm });
    });
  }

  private initializeCompanionRelationships() {
    // For this simplified version, we'll add companion relationships for the first few plants
    // In a real app, this would be more comprehensive
    
    // Get plant IDs
    const tomato = 1;
    const carrot = 2;
    const lettuce = 3;
    const cucumber = 4;
    const onion = 5;
    const bellPepper = 6;
    const basil = 7;
    const mint = 8;
    const rosemary = 9;
    const thyme = 10;

    const relationships: InsertCompanionRelationship[] = [
      // Tomato companions
      { plantId: tomato, companionId: basil, compatibility: 'good', notes: 'Basil repels certain insects and can enhance tomato flavor.' },
      { plantId: tomato, companionId: onion, compatibility: 'good', notes: 'Onions help deter pests that affect tomatoes.' },
      { plantId: tomato, companionId: thyme, compatibility: 'good', notes: 'Thyme serves as a general pest deterrent.' },
      { plantId: tomato, companionId: cucumber, compatibility: 'bad', notes: 'Both are susceptible to similar diseases.' },
      { plantId: tomato, companionId: bellPepper, compatibility: 'bad', notes: 'Both are vulnerable to the same pests and diseases.' },
      { plantId: tomato, companionId: carrot, compatibility: 'neutral', notes: 'No significant positive or negative effects.' },
      
      // Carrot companions
      { plantId: carrot, companionId: onion, compatibility: 'bad', notes: 'Onions can inhibit carrot growth.' },
      { plantId: carrot, companionId: rosemary, compatibility: 'good', notes: 'Rosemary helps repel carrot flies.' },
      { plantId: carrot, companionId: lettuce, compatibility: 'good', notes: 'Good use of garden space with different root depths.' },
      
      // Cucumber companions
      { plantId: cucumber, companionId: lettuce, compatibility: 'good', notes: 'Lettuce provides ground cover for cucumber roots.' },
      { plantId: cucumber, companionId: onion, compatibility: 'bad', notes: 'Onions can inhibit cucumber growth.' },
      
      // Basil companions (in addition to tomato)
      { plantId: basil, companionId: bellPepper, compatibility: 'good', notes: 'Basil can enhance pepper growth and flavor.' },
      
      // Additional relationships would be added here...
    ];

    relationships.forEach(rel => {
      const id = this.currentRelationshipId++;
      this.companionRelationships.set(id, { 
        ...rel, 
        id,
        notes: rel.notes || null 
      });
    });
  }
}

export const storage = new MemStorage();
