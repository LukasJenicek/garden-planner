import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertGardenLayoutSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for plants
  app.get("/api/plants", async (_req, res) => {
    try {
      const plants = await storage.getAllPlants();
      res.json(plants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plants" });
    }
  });

  app.get("/api/plants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }

      const plant = await storage.getPlant(id);
      if (!plant) {
        return res.status(404).json({ message: "Plant not found" });
      }

      res.json(plant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant" });
    }
  });

  // API routes for companion relationships
  app.get("/api/companions/:plantId", async (req, res) => {
    try {
      const plantId = parseInt(req.params.plantId);
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }

      const relationships = await storage.getCompanionRelationships(plantId);
      
      // For each relationship, get the companion plant details
      const companions = await Promise.all(
        relationships.map(async (rel) => {
          const plant = await storage.getPlant(rel.companionId);
          return {
            ...rel,
            plant
          };
        })
      );

      res.json(companions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companion relationships" });
    }
  });

  // API routes for garden layouts
  app.get("/api/garden-layouts", async (_req, res) => {
    try {
      const layouts = await storage.getAllGardenLayouts();
      res.json(layouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch garden layouts" });
    }
  });

  app.get("/api/garden-layouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid layout ID" });
      }

      const layout = await storage.getGardenLayout(id);
      if (!layout) {
        return res.status(404).json({ message: "Garden layout not found" });
      }

      res.json(layout);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch garden layout" });
    }
  });

  app.post("/api/garden-layouts", async (req, res) => {
    try {
      const result = insertGardenLayoutSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid garden layout data", 
          errors: result.error.errors 
        });
      }

      const layout = await storage.createGardenLayout(result.data);
      res.status(201).json(layout);
    } catch (error) {
      res.status(500).json({ message: "Failed to create garden layout" });
    }
  });

  app.put("/api/garden-layouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid layout ID" });
      }

      const validator = insertGardenLayoutSchema.partial();
      const result = validator.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid garden layout data", 
          errors: result.error.errors 
        });
      }

      const updatedLayout = await storage.updateGardenLayout(id, result.data);
      if (!updatedLayout) {
        return res.status(404).json({ message: "Garden layout not found" });
      }

      res.json(updatedLayout);
    } catch (error) {
      res.status(500).json({ message: "Failed to update garden layout" });
    }
  });

  app.delete("/api/garden-layouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid layout ID" });
      }

      const success = await storage.deleteGardenLayout(id);
      if (!success) {
        return res.status(404).json({ message: "Garden layout not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete garden layout" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
