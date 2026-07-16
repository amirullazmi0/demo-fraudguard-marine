import { NextResponse } from "next/server";
import { findReportById } from "@/app/api/_server/services/fleet.service";
import { requireAdmin } from "@/app/api/_server/auth/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
     await requireAdmin();
     const report = await findReportById((await params).id);
     if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });
     return NextResponse.json({ report });
}


