import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
export type UserRole = "ADMIN" | "ABK";

export const SESSION_COOKIE = "marineguard_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "development-only-secret-change-me");
export type Session = { userId: string; email: string; role: UserRole };
export async function createSessionToken(session: Session) { return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret); }
export async function verifySessionToken(token?: string) { if (!token) return null; try { const { payload } = await jwtVerify(token, secret); if (!payload.userId || !payload.email || !payload.role) return null; return { userId: String(payload.userId), email: String(payload.email), role: String(payload.role) as UserRole }; } catch { return null; } }
export async function getSession() { const store = await cookies(); return verifySessionToken(store.get(SESSION_COOKIE)?.value); }
export async function requireSession() { const session = await getSession(); if (!session) throw new Error("UNAUTHORIZED"); return session; }
export async function requireAdmin() { const session = await requireSession(); if (session.role !== "ADMIN") throw new Error("FORBIDDEN"); return session; }
