import { z } from "zod";

// Plant validation schema for use with forms
export const plantFormSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  category: z.enum(["vegetable", "herb", "fruit", "flower"]),
  icon: z.string(),
  color: z.string(),
  growingInfo: z.string().min(1, "Growing info is required"),
  harvestTime: z.string().min(1, "Harvest time is required")
});

// Companion relationship validation schema
export const companionRelationshipFormSchema = z.object({
  plantId: z.number().positive(),
  companionId: z.number().positive(),
  compatibility: z.enum(["good", "bad", "neutral"]),
  notes: z.string().optional()
});

// Garden layout validation schema
export const gardenLayoutFormSchema = z.object({
  name: z.string().min(1, "Garden name is required"),
  beds: z.array(
    z.object({
      id: z.string(),
      shape: z.enum(["rectangle", "circle", "polygon"]),
      x: z.number(),
      y: z.number(),
      width: z.number().optional(),
      height: z.number().optional(),
      radius: z.number().optional(),
      points: z.array(z.number()).optional(),
      fill: z.string(),
      stroke: z.string(),
      name: z.string().optional()
    })
  ),
  plants: z.array(
    z.object({
      id: z.string(),
      plantId: z.number(),
      x: z.number(),
      y: z.number(),
      bedId: z.string().optional()
    })
  )
});

// Compatibility utility functions
export const getCompatibilityColor = (compatibility: string) => {
  switch (compatibility) {
    case 'good':
      return '#43A047'; // Compatible green
    case 'warning':
    case 'neutral':
      return '#FFC107'; // Warning yellow
    case 'bad':
      return '#E53935'; // Incompatible red
    default:
      return '#8BC34A'; // Default leaf green
  }
};

export const getCompatibilityLabel = (compatibility: string) => {
  switch (compatibility) {
    case 'good':
      return 'Good Companions';
    case 'warning':
    case 'neutral':
      return 'Neutral Companions';
    case 'bad':
      return 'Bad Companions';
    default:
      return 'Unknown Compatibility';
  }
};
