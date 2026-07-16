import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/api/_server/db/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/app/api/_server/auth/session";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success || !prisma) return NextResponse.json({ error: "Email atau password tidak valid." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: body.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(body.data.password, user.passwordHash))) return NextResponse.json({ error: "Email atau password tidak valid." }, { status: 401 });
  const token = await createSessionToken({ userId: user.id, email: user.email, role: user.role });
  const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}

