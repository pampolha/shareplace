const { z } = require("zod");

const getUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

module.exports = { getUserSchema };
