import { 
  Plant, 
  Garden, 
  GardenBed, 
  GardenPlant, 
  CompleteGarden 
} from "@shared/schema";

export interface IStorage {
  // Plant-related methods
  getAllPlants(): Promise<Plant[]>;
  getPlant(id: number): Promise<Plant | undefined>;
  
  // Garden-related methods
  getAllGardens(): Promise<CompleteGarden[]>;
  getGarden(id: number): Promise<CompleteGarden | undefined>;
  saveGarden(garden: any): Promise<CompleteGarden>;
  deleteGarden(id: number): Promise<void>;
  
  // Compatibility-related methods
  getCompatibilityMatrix(): Promise<Record<string, Record<string, string>>>;
}

export class MemStorage implements IStorage {
  private plants: Map<number, Plant>;
  private gardens: Map<number, Garden>;
  private gardenBeds: Map<number, GardenBed>;
  private gardenPlants: Map<number, GardenPlant>;
  private nextPlantId: number;
  private nextGardenId: number;
  private nextBedId: number;
  private nextPlantInstanceId: number;

  constructor() {
    this.plants = new Map();
    this.gardens = new Map();
    this.gardenBeds = new Map();
    this.gardenPlants = new Map();
    this.nextPlantId = 1;
    this.nextGardenId = 1;
    this.nextBedId = 1;
    this.nextPlantInstanceId = 1;
    
    // Initialize with some sample plants
    this.initializeSampleData();
  }

  // Initialize sample data
  private initializeSampleData() {
    // Sample plants
    const samplePlants: Plant[] = [
      {
        id: this.nextPlantId++,
        name: "Tomato",
        scientificName: "Solanum lycopersicum",
        category: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1524593166156-312f362cada0?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9tYXRvJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D",
        sunRequirement: "Full Sun",
        waterNeeds: "Regular",
        spacing: "18-24 inches",
        harvestTime: "60-85 days",
        goodCompanions: ["Basil", "Marigold", "Onion", "Carrot"],
        badCompanions: ["Potato", "Corn", "Fennel"],
        description: "Tomatoes are the most popular garden vegetable crop."
      },
      {
        id: this.nextPlantId++,
        name: "Basil",
        scientificName: "Ocimum basilicum",
        category: "herbs",
        imageUrl: "https://images.unsplash.com/photo-1585666679415-aa69c93cd907?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFzaWwlMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D",
        sunRequirement: "Full Sun",
        waterNeeds: "Moderate",
        spacing: "8-12 inches",
        harvestTime: "30-60 days",
        goodCompanions: ["Tomato", "Pepper", "Oregano"],
        badCompanions: ["Rue", "Sage"],
        description: "Basil is a culinary herb prominently featured in Italian cuisine."
      },
      {
        id: this.nextPlantId++,
        name: "Carrot",
        scientificName: "Daucus carota",
        category: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnJvdCUyMHBsYW50fGVufDB8fDB8fHww",
        sunRequirement: "Full Sun/Partial Shade",
        waterNeeds: "Consistent",
        spacing: "2-3 inches",
        harvestTime: "70-80 days",
        goodCompanions: ["Rosemary", "Onion", "Tomato"],
        badCompanions: ["Dill", "Celery"],
        description: "Carrots are root vegetables, usually orange in color."
      },
      {
        id: this.nextPlantId++,
        name: "Lettuce",
        scientificName: "Lactuca sativa",
        category: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1595864866705-36b891d07969?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGV0dHVjZXxlbnwwfHwwfHx8MA%3D%3D",
        sunRequirement: "Partial Shade",
        waterNeeds: "Regular",
        spacing: "6-12 inches",
        harvestTime: "45-60 days",
        goodCompanions: ["Radish", "Carrot", "Cucumber"],
        badCompanions: ["Broccoli", "Cabbage"],
        description: "Lettuce is an annual plant of the daisy family, Asteraceae."
      },
      {
        id: this.nextPlantId++,
        name: "Pepper",
        scientificName: "Capsicum annuum",
        category: "vegetables",
        imageUrl: "https://images.unsplash.com/photo-1635910160061-4dd803628db9?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVwcGVyJTIwcGxhbnR8ZW58MHx8MHx8fDA%3D",
        sunRequirement: "Full Sun",
        waterNeeds: "Moderate",
        spacing: "12-18 inches",
        harvestTime: "60-90 days",
        goodCompanions: ["Basil", "Onion", "Carrot"],
        badCompanions: ["Fennel", "Kohlrabi"],
        description: "Peppers are native to Mexico, Central America, and northern South America."
      },
      {
        id: this.nextPlantId++,
        name: "Marigold",
        scientificName: "Tagetes",
        category: "flowers",
        imageUrl: "https://images.unsplash.com/photo-1596716587659-0099a88a3d06?w=80&h=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFyaWdvbGR8ZW58MHx8MHx8fDA%3D",
        sunRequirement: "Full Sun",
        waterNeeds: "Moderate",
        spacing: "8-12 inches",
        harvestTime: "50-60 days",
        goodCompanions: ["Tomato", "Cucumber", "Squash"],
        badCompanions: ["Bean", "Cabbage"],
        description: "Marigolds are used in companion planting for many vegetables."
      }
    ];
    
    // Add plants to storage
    for (const plant of samplePlants) {
      this.plants.set(plant.id, plant);
    }

    // Create a sample garden
    const sampleGarden: Garden = {
      id: this.nextGardenId++,
      name: "My Garden",
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.gardens.set(sampleGarden.id, sampleGarden);
    
    // Add a sample garden bed
    const sampleBed: GardenBed = {
      id: this.nextBedId++,
      name: "Raised Bed",
      gardenId: sampleGarden.id,
      bedData: {
        type: "rectangle",
        x: 100,
        y: 100,
        width: 400,
        height: 200
      },
      sunExposure: "Full Sun",
      soilType: "Loam"
    };
    
    this.gardenBeds.set(sampleBed.id, sampleBed);
    
    // Add sample plants to the garden
    const plantPositions = [
      { plantId: 1, x: 150, y: 140 }, // Tomato
      { plantId: 2, x: 250, y: 140 }, // Basil
      { plantId: 5, x: 350, y: 140 }, // Pepper
      { plantId: 3, x: 250, y: 220 }  // Carrot
    ];
    
    for (const pos of plantPositions) {
      const gardenPlant: GardenPlant = {
        id: this.nextPlantInstanceId++,
        gardenId: sampleGarden.id,
        plantId: pos.plantId,
        x: pos.x,
        y: pos.y,
        notes: ""
      };
      
      this.gardenPlants.set(gardenPlant.id, gardenPlant);
    }
  }

  // Plant-related methods
  async getAllPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }
  
  async getPlant(id: number): Promise<Plant | undefined> {
    return this.plants.get(id);
  }
  
  // Garden-related methods
  async getAllGardens(): Promise<CompleteGarden[]> {
    const gardens = Array.from(this.gardens.values());
    const completeGardens: CompleteGarden[] = [];
    
    for (const garden of gardens) {
      completeGardens.push(await this.getGarden(garden.id) as CompleteGarden);
    }
    
    return completeGardens;
  }
  
  async getGarden(id: number): Promise<CompleteGarden | undefined> {
    const garden = this.gardens.get(id);
    if (!garden) return undefined;
    
    // Get all beds for this garden
    const beds = Array.from(this.gardenBeds.values())
      .filter(bed => bed.gardenId === id);
    
    // Get all plants for this garden with their details
    const gardenPlantInstances = Array.from(this.gardenPlants.values())
      .filter(gp => gp.gardenId === id);
    
    const plants = gardenPlantInstances.map(gp => {
      const plant = this.plants.get(gp.plantId);
      return {
        ...gp,
        plant: plant as Plant
      };
    });
    
    return {
      ...garden,
      beds,
      plants
    };
  }
  
  async saveGarden(gardenData: any): Promise<CompleteGarden> {
    let garden: Garden;
    
    if (gardenData.id && this.gardens.has(gardenData.id)) {
      // Update existing garden
      garden = {
        ...this.gardens.get(gardenData.id) as Garden,
        name: gardenData.name,
        updatedAt: new Date()
      };
      this.gardens.set(garden.id, garden);
      
      // Delete existing beds and plants for this garden
      for (const [id, bed] of this.gardenBeds.entries()) {
        if (bed.gardenId === garden.id) {
          this.gardenBeds.delete(id);
        }
      }
      
      for (const [id, plant] of this.gardenPlants.entries()) {
        if (plant.gardenId === garden.id) {
          this.gardenPlants.delete(id);
        }
      }
    } else {
      // Create new garden
      garden = {
        id: this.nextGardenId++,
        name: gardenData.name,
        userId: 1, // Default user ID
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.gardens.set(garden.id, garden);
    }
    
    // Add beds
    if (gardenData.beds && Array.isArray(gardenData.beds)) {
      for (const bedData of gardenData.beds) {
        const bed: GardenBed = {
          id: this.nextBedId++,
          name: bedData.name || "Garden Bed",
          gardenId: garden.id,
          bedData: {
            type: bedData.type,
            x: bedData.x,
            y: bedData.y,
            width: bedData.type === 'rectangle' ? bedData.width : undefined,
            height: bedData.type === 'rectangle' ? bedData.height : undefined,
            radius: bedData.type === 'circle' ? bedData.radius : undefined,
            points: bedData.type === 'path' ? bedData.points : undefined
          },
          sunExposure: bedData.sunExposure,
          soilType: bedData.soilType,
          notes: bedData.notes
        };
        
        this.gardenBeds.set(bed.id, bed);
      }
    }
    
    // Add plants
    if (gardenData.plants && Array.isArray(gardenData.plants)) {
      for (const plantData of gardenData.plants) {
        // Check if it's a full plant instance or just a reference
        const plantId = plantData.id || plantData.plantId;
        
        const gardenPlant: GardenPlant = {
          id: this.nextPlantInstanceId++,
          gardenId: garden.id,
          plantId,
          x: plantData.x,
          y: plantData.y,
          notes: plantData.notes || ""
        };
        
        this.gardenPlants.set(gardenPlant.id, gardenPlant);
      }
    }
    
    return this.getGarden(garden.id) as Promise<CompleteGarden>;
  }
  
  async deleteGarden(id: number): Promise<void> {
    // Delete garden
    this.gardens.delete(id);
    
    // Delete garden beds
    for (const [bedId, bed] of this.gardenBeds.entries()) {
      if (bed.gardenId === id) {
        this.gardenBeds.delete(bedId);
      }
    }
    
    // Delete garden plants
    for (const [plantId, plant] of this.gardenPlants.entries()) {
      if (plant.gardenId === id) {
        this.gardenPlants.delete(plantId);
      }
    }
  }
  
  // Compatibility matrix
  async getCompatibilityMatrix(): Promise<Record<string, Record<string, string>>> {
    const plants = await this.getAllPlants();
    const matrix: Record<string, Record<string, string>> = {};
    
    for (const plant1 of plants) {
      matrix[plant1.name] = {};
      
      for (const plant2 of plants) {
        if (plant1.name === plant2.name) {
          matrix[plant1.name][plant2.name] = "fair";
        } else if (plant1.goodCompanions.includes(plant2.name)) {
          matrix[plant1.name][plant2.name] = "good";
        } else if (plant1.badCompanions.includes(plant2.name)) {
          matrix[plant1.name][plant2.name] = "poor";
        } else {
          matrix[plant1.name][plant2.name] = "fair";
        }
      }
    }
    
    return matrix;
  }
}

export const storage = new MemStorage();
