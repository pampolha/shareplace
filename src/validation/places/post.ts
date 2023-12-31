import { z } from "zod";

export const createPlaceSchema = z
  .object({
    body: z.object({
      title: z.string(),
      description: z.string(),
      location: z.object({ lat: z.number(), lng: z.number() }).optional(),
      address: z.string().optional(),
      userId: z.string().uuid(),
    }),
  })
  .refine(
    (schema) => schema.body.address || schema.body.location,
    "At least one of the following properties must be given to create a place: location, address"
  );
