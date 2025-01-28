"use server";

import {
  UserRegister,
  UserLogin,
  UserRecoverPassword,
  UserUpdatePassword,
  UserRegisterSchema,
  UserLoginSchema,
  UserRecoverPasswordSchema,
} from "@/schemas/user";
import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

export async function signup(user: UserRegister) {
  const userPayload = await UserRegisterSchema.parseAsync(user);

  console.log(userPayload);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to signup");
  }

  return response.json();
}

export async function signin(user: UserLogin) {
  const userPayload = await UserLoginSchema.parseAsync(user);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/login/access-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: userPayload.email,
        password: userPayload.password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to signin");
  }

  return response.json();
}

export async function recoverPassword(user: UserRecoverPassword) {
  const userPayload = await UserRecoverPasswordSchema.parseAsync(user);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/password-recovery/${userPayload.email}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  return response.json();
}

export async function updatePassword(user: UserUpdatePassword) {}

export async function verifyEmail(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/verify/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to verify email");
  }

  return response.json();
}

export async function sendVerificationEmail() {
  // Get the token from the request
  const token = await getToken({
    req: {
      headers: Object.fromEntries(headers()),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value])
      ),
    } as any,
  });

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/send-verification-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send verification email");
  }

  return response.json();
}
