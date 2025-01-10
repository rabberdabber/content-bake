import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(9, "Password must be at least 9 characters long"),
});

export type LoginData = z.infer<typeof loginSchema>;
