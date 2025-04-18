import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Plant schema
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // vegetable, herb, fruit, etc.
  icon: text("icon").notNull(), // SVG path or icon identifier
  color: text("color").notNull(), // color for the plant icon
  growingInfo: text("growing_info").notNull(),
  harvestTime: text("harvest_time").notNull(),
});

export const insertPlantSchema = createInsertSchema(plants).pick({
  name: true,
  category: true,
  icon: true,
  color: true,
  growingInfo: true,
  harvestTime: true,
});

// Companion planting relationships
export const companionRelationships = pgTable("companion_relationships", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull().references(() => plants.id),
  companionId: integer("companion_id").notNull().references(() => plants.id),
  compatibility: text("compatibility").notNull(), // good, bad, neutral
  notes: text("notes"),
});

export const insertCompanionRelationshipSchema = createInsertSchema(companionRelationships).pick({
  plantId: true,
  companionId: true,
  compatibility: true,
  notes: true,
});

// Garden layout schema
export const gardenLayouts = pgTable("garden_layouts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  beds: jsonb("beds").notNull(), // array of garden bed objects with coordinates, dimensions
  plants: jsonb("plants").notNull(), // array of placed plants with coordinates and references to plant ids
});

export const insertGardenLayoutSchema = createInsertSchema(gardenLayouts).pick({
  name: true,
  beds: true,
  plants: true,
});

// Types
export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;

export type CompanionRelationship = typeof companionRelationships.$inferSelect;
export type InsertCompanionRelationship = z.infer<typeof insertCompanionRelationshipSchema>;

export type GardenLayout = typeof gardenLayouts.$inferSelect;
export type InsertGardenLayout = z.infer<typeof insertGardenLayoutSchema>;

// Garden Bed Types (used in the frontend and for JSON storage)
export type BedShape = "rectangle" | "circle" | "polygon";

export type GardenBed = {
  id: string;
  shape: BedShape;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  fill: string;
  stroke: string;
  name?: string;
};

export type PlacedPlant = {
  id: string;
  plantId: number;
  x: number;
  y: number;
  bedId?: string; // The garden bed this plant is placed in, if any
};
