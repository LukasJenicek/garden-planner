import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Plants table
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  scientificName: text("scientific_name").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  sunRequirement: text("sun_requirement").notNull(),
  waterNeeds: text("water_needs").notNull(),
  spacing: text("spacing").notNull(),
  harvestTime: text("harvest_time").notNull(),
  goodCompanions: text("good_companions").array().notNull(),
  badCompanions: text("bad_companions").array().notNull(),
  description: text("description"),
});

// Garden beds table
export const gardenBeds = pgTable("garden_beds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gardenId: integer("garden_id").notNull(),
  bedData: jsonb("bed_data").notNull(), // Store the shape, size, position as JSON
  sunExposure: text("sun_exposure"),
  soilType: text("soil_type"),
  notes: text("notes"),
});

// Garden plants table (plants placed in a garden)
export const gardenPlants = pgTable("garden_plants", {
  id: serial("id").primaryKey(),
  gardenId: integer("garden_id").notNull(),
  plantId: integer("plant_id").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  notes: text("notes"),
});

// Gardens table
export const gardens = pgTable("gardens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define Zod schemas for inserts
export const insertPlantSchema = createInsertSchema(plants);
export const insertGardenBedSchema = createInsertSchema(gardenBeds);
export const insertGardenPlantSchema = createInsertSchema(gardenPlants);
export const insertGardenSchema = createInsertSchema(gardens);

// Define the types for inserts
export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type InsertGardenBed = z.infer<typeof insertGardenBedSchema>;
export type InsertGardenPlant = z.infer<typeof insertGardenPlantSchema>;
export type InsertGarden = z.infer<typeof insertGardenSchema>;

// Define the types for selects
export type Plant = typeof plants.$inferSelect;
export type GardenBed = typeof gardenBeds.$inferSelect;
export type GardenPlant = typeof gardenPlants.$inferSelect;
export type Garden = typeof gardens.$inferSelect;

// Combined garden type for API responses
export interface CompleteGarden extends Garden {
  beds: GardenBed[];
  plants: (GardenPlant & { plant: Plant })[];
}
