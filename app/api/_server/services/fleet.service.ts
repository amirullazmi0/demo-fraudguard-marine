import { findFleet } from "@/app/api/_server/repositories/fleet.repository";
import type { DashboardData } from "@/lib/types";
export async function getFleetDashboard(): Promise<DashboardData> { return { source: "database" as const, vessels: await findFleet() }; }
export { findReportById } from "@/app/api/_server/repositories/fleet.repository";
