const { z } = require("zod");

const modifyPlaceSchema = z
  .object({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({
      title: z.string(),
      description: z.string(),
      location: z.object({ lat: z.number(), lng: z.number() }),
      address: z.string(),
    }),
  })
  .partial()
  .refine(
    (schema) => Object.values(schema).some((val) => val),
    "No valid place properties were given"
  );

module.exports = { modifyPlaceSchema };
