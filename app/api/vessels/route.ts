import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/api/_server/db/prisma";
import { requireAdmin, requireSession } from "@/app/api/_server/auth/session";

const vesselSchema = z.object({ name: z.string().trim().min(2).max(120), imoNumber: z.string().trim().min(5).max(30) });

export async function GET() { await requireSession(); if (!prisma) return NextResponse.json({ vessels: [] }); const vessels = await prisma.vessel.findMany({ include: { equipments: true }, orderBy: { name: "asc" } }); return NextResponse.json({ vessels }); }
export async function POST(request: Request) { await requireAdmin(); if (!prisma) return NextResponse.json({ error: "Database tidak tersedia." }, { status: 503 }); const parsed = vesselSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Vessel name and IMO number are required." }, { status: 400 }); try { const vessel = await prisma.vessel.create({ data: parsed.data }); return NextResponse.json({ vessel }, { status: 201 }); } catch { return NextResponse.json({ error: "The IMO number is already in use." }, { status: 409 }); } }

