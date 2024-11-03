import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "L'adresse email est invalide." }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au minimum 8 caratères." })
  });

export const registrationSchema = z.object({
  lastName: z.string().min(3, { message: "Le nom de famille doit contenir au minimum 3 caratères." }),
  firstName: z.string().min(3 , { message: "Le prénom doit contenir au minimum 3 caratères." }),
  email: z.string().email({ message: "L'adresse email est invalide." }),  
  password: z.string().min(8, { message: "Le mot de passe doit contenir au minimum 8 caratères." })
});

export type UserLoginDto = z.infer<typeof loginSchema>;

export type SelfUser = {
    email: string;
    id: string;
}

export type UserRegisterDto = z.infer<typeof registrationSchema>;

