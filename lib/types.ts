export type EquipmentStatus = "OPERATIONAL" | "ATTENTION" | "CRITICAL" | "OFFLINE";
export type EquipmentCategory = "PROPULSION" | "AUXILIARY" | "NAVIGATION" | "SAFETY" | "ELECTRICAL" | "DECK" | "OTHER";
export type Severity = "Low" | "Medium" | "High";
export type AiAnalysis = { analysis: string; fraud_risk_score: number; recommendation: string; severity: Severity };
export type MaintenanceLogView = { id: string; photoUrls: string[]; damageReason: string; aiAnalysis: AiAnalysis; isFraud: boolean; createdAt: string; createdBy: string };
export type EquipmentView = { id: string; name: string; category: EquipmentCategory; photoUrls: string[]; lifespanMonths: number; status: EquipmentStatus; lastServiceDate: string; logs: MaintenanceLogView[] };
export type VesselView = { id: string; name: string; imoNumber: string; equipments: EquipmentView[] };
export type DashboardData = { vessels: VesselView[]; source: "database" };
