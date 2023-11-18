import { z } from "zod";

export const deletePlaceSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
