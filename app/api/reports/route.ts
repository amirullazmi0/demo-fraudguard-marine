import { NextResponse } from "next/server";
import { getFleetDashboard } from "@/app/api/_server/services/fleet.service";
import { requireAdmin, requireSession } from "@/app/api/_server/auth/session";
import { submitReport } from "@/actions/maintenance";

export async function GET(request: Request) {
     await requireAdmin();
     const data = await getFleetDashboard();
     const vesselId = new URL(request.url).searchParams.get("vesselId");
     const reports = data.vessels
          .flatMap(vessel =>
               vessel.equipments.flatMap(equipment =>
                    equipment.logs.map(log => ({
                         ...log,
                         vesselId: vessel.id,
                         vesselName: vessel.name,
                         equipmentId: equipment.id,
                         equipmentName: equipment.name,
                    })),
               ),
          )
          .filter(report => !vesselId || report.vesselId === vesselId);
     return NextResponse.json({ reports });
}
export async function POST(request: Request) {
     await requireSession();
     const formData = await request.formData();
     const result = await submitReport(formData);
     if (!result.ok) return NextResponse.json(result, { status: 400 });
     return NextResponse.json(result, { status: 201 });
}


