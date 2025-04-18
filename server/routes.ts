import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix all with /api
  
  // Get all plants
  app.get("/api/plants", async (req, res) => {
    try {
      const plants = await storage.getAllPlants();
      res.json(plants);
    } catch (error) {
      console.error("Error fetching plants:", error);
      res.status(500).json({ message: "Failed to fetch plants" });
    }
  });
  
  // Get a specific plant by ID
  app.get("/api/plants/:id", async (req, res) => {
    try {
      const plant = await storage.getPlant(parseInt(req.params.id));
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }
      res.json(plant);
    } catch (error) {
      console.error("Error fetching plant:", error);
      res.status(500).json({ message: "Failed to fetch plant" });
    }
  });
  
  // Get all gardens
  app.get("/api/gardens", async (req, res) => {
    try {
      const gardens = await storage.getAllGardens();
      res.json(gardens);
    } catch (error) {
      console.error("Error fetching gardens:", error);
      res.status(500).json({ message: "Failed to fetch gardens" });
    }
  });
  
  // Get a specific garden by ID
  app.get("/api/gardens/:id", async (req, res) => {
    try {
      const garden = await storage.getGarden(parseInt(req.params.id));
      if (!garden) {
        return res.status(404).json({ message: "Garden not found" });
      }
      res.json(garden);
    } catch (error) {
      console.error("Error fetching garden:", error);
      res.status(500).json({ message: "Failed to fetch garden" });
    }
  });
  
  // Create or update a garden
  app.post("/api/gardens", async (req, res) => {
    try {
      const garden = req.body;
      const result = await storage.saveGarden(garden);
      res.json(result);
    } catch (error) {
      console.error("Error saving garden:", error);
      res.status(500).json({ message: "Failed to save garden" });
    }
  });
  
  // Delete a garden
  app.delete("/api/gardens/:id", async (req, res) => {
    try {
      await storage.deleteGarden(parseInt(req.params.id));
      res.status(200).json({ message: "Garden deleted successfully" });
    } catch (error) {
      console.error("Error deleting garden:", error);
      res.status(500).json({ message: "Failed to delete garden" });
    }
  });
  
  // Get plant compatibility 
  app.get("/api/compatibility", async (req, res) => {
    try {
      const compatibility = await storage.getCompatibilityMatrix();
      res.json(compatibility);
    } catch (error) {
      console.error("Error fetching compatibility matrix:", error);
      res.status(500).json({ message: "Failed to fetch compatibility data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
