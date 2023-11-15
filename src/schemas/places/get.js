const { z } = require("zod");

const getPlaceSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { getPlaceSchema };
