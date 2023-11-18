import { z } from "zod";

export const getPlaceSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
