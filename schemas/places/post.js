const { z } = require("zod");
const createPlaceSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
    address: z.string(),
    creatorId: z.string().uuid(),
  }),
});

module.exports =  { createPlaceSchema };
