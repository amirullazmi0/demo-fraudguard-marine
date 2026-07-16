"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/app/api/_server/db/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/app/api/_server/auth/session";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function loginAction(_previousState: { error?: string } | undefined, formData: FormData) {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success || !prisma) return { error: "Email atau password tidak valid." };
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return { error: "Email atau password tidak valid." };
  const token = await createSessionToken({ userId: user.id, email: user.email, role: user.role });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect(user.role === "ADMIN" ? "/boss" : "/crew");
}

export async function logoutAction() { const cookieStore = await cookies(); cookieStore.delete(SESSION_COOKIE); redirect("/login"); }


