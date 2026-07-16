import type { EquipmentView, VesselView } from "@/lib/types";
import { prisma } from "@/app/api/_server/db/prisma";

export async function findFleet() {
  if (!prisma) return [] as VesselView[];
  const vessels = await prisma.vessel.findMany({
    include: { equipments: { include: { maintenanceLogs: { orderBy: { createdAt: "desc" }, include: { createdBy: true, photos: true } }, photos: true } } },
    orderBy: { name: "asc" },
  });
  return vessels.map((vessel): VesselView => ({
    id: vessel.id,
    name: vessel.name,
    imoNumber: vessel.imoNumber,
    equipments: vessel.equipments.map((equipment): EquipmentView => ({
      id: equipment.id,
      name: equipment.name,
      category: equipment.category,
      lifespanMonths: equipment.lifespanMonths,
      status: equipment.status,
      photoUrls: equipment.photos.map(photo => photo.url),
      lastServiceDate: equipment.lastServiceDate.toISOString(),
      logs: equipment.maintenanceLogs.map(log => ({ id: log.id, photoUrls: log.photos.map(photo => photo.url), damageReason: log.damageReason, aiAnalysis: log.aiAnalysisJson as EquipmentView["logs"][number]["aiAnalysis"], isFraud: log.isFraud, createdAt: log.createdAt.toISOString(), createdBy: log.createdBy.email })),
    })),
  }));
}

export async function findReportById(id: string) {
  return prisma?.maintenanceLog.findUnique({ where: { id }, include: { createdBy: true, photos: true, equipment: { include: { vessel: true } } } }) ?? null;
}


