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
        growingInfo: 'Full sun, water regularly, space 18-24" apart. Grows 4-6 feet tall.',
        harvestTime: '70-85 days from transplant'
      },
      {
        name: 'Carrot',
        category: 'vegetable',
        icon: 'line',
        color: '#ED8936', // orange-500
        growingInfo: 'Full sun to partial shade, water consistently, space 2-3" apart.',
        harvestTime: '60-80 days from seed'
      },
      {
        name: 'Lettuce',
        category: 'vegetable',
        icon: 'leaf',
        color: '#8BC34A', // leaf-green
        growingInfo: 'Partial shade, water regularly, space 6-8" apart.',
        harvestTime: '45-60 days from seed'
      },
      {
        name: 'Cucumber',
        category: 'vegetable',
        icon: 'rectangle',
        color: '#276749', // green-800
        growingInfo: 'Full sun, water deeply, space 36-60" apart for vining varieties.',
        harvestTime: '50-70 days from seed'
      },
      {
        name: 'Onion',
        category: 'vegetable',
        icon: 'circle',
        color: '#B794F4', // purple-400
        growingInfo: 'Full sun, regular water, space 4-5" apart.',
        harvestTime: '90-110 days from transplant'
      },
      {
        name: 'Bell Pepper',
        category: 'vegetable',
        icon: 'square',
        color: '#C53030', // red-700
        growingInfo: 'Full sun, consistent moisture, space 18-24" apart.',
        harvestTime: '60-90 days from transplant'
      },
      {
        name: 'Basil',
        category: 'herb',
        icon: 'triangle',
        color: '#2F855A', // green-700
        growingInfo: 'Full sun, moderate water, space 12-18" apart.',
        harvestTime: '30-60 days from seed for usable leaves'
      },
      {
        name: 'Mint',
        category: 'herb',
        icon: 'triangle',
        color: '#38A169', // green-600
        growingInfo: 'Partial shade, regular water, grows aggressively - consider containers.',
        harvestTime: '30 days from planting for usable leaves'
      },
      {
        name: 'Rosemary',
        category: 'herb',
        icon: 'triangle',
        color: '#285E61', // teal-800
        growingInfo: 'Full sun, well-drained soil, drought tolerant once established.',
        harvestTime: '70-80 days from transplant for usable leaves'
      },
      {
        name: 'Thyme',
        category: 'herb',
        icon: 'triangle',
        color: '#319795', // teal-600
        growingInfo: 'Full sun, well-drained soil, drought tolerant.',
        harvestTime: '40-60 days from planting for usable leaves'
      }
    ];

    defaultPlants.forEach(plant => {
      const id = this.currentPlantId++;
      this.plants.set(id, { ...plant, id });
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
