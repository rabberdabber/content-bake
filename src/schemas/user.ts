import { z } from "zod";

export const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(40),
  full_name: z.string(),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(40),
});

export const UserRecoverPasswordSchema = z.object({
  email: z.string().email(),
});

export const UserUpdatePasswordSchema = z.object({
  password: z.string().min(8).max(40),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserRecoverPassword = z.infer<typeof UserRecoverPasswordSchema>;
export type UserUpdatePassword = z.infer<typeof UserUpdatePasswordSchema>;
