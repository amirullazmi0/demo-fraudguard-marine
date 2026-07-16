import { findFleet } from "@/app/api/_server/repositories/fleet.repository";
export async function getFleetDashboard() { return { source: "database" as const, vessels: await findFleet() }; }
export { findReportById } from "@/app/api/_server/repositories/fleet.repository";
