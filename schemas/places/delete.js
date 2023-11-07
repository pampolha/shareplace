const { z } = require("zod");

const deletePlaceSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { deletePlaceSchema };
