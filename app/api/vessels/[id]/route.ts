import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/api/_server/db/prisma";
import { requireAdmin } from "@/app/api/_server/auth/session";
const schema = z.object({ name: z.string().trim().min(2), imoNumber: z.string().trim().min(5) });
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) { await requireAdmin(); if (!prisma) return NextResponse.json({ error: "Database tidak tersedia." }, { status: 503 }); const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Data kapal tidak valid." }, { status: 400 }); const vessel = await prisma.vessel.update({ where: { id: (await params).id }, data: parsed.data }); return NextResponse.json({ vessel }); }
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) { await requireAdmin(); if (!prisma) return NextResponse.json({ error: "Database tidak tersedia." }, { status: 503 }); await prisma.vessel.delete({ where: { id: (await params).id } }); return NextResponse.json({ success: true }); }
