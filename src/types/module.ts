import { z } from "zod";

const moduleSchema = z.object({
    name: z.string()
});
  
export type Module = z.infer<typeof moduleSchema>;