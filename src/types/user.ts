import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "L'adresse email est invalide." }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au minimum 8 caratères." })
  });

export type UserLoginDto = z.infer<typeof loginSchema>;

export type SelfUser = {
    email: string;
    id: string;
}

