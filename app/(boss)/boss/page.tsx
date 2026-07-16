import { Dashboard } from "@/app/(boss)/boss/dashboard";
import { getFleetDashboard } from "@/app/api/_server/services/fleet.service";

export default async function BossPage({ searchParams }: { searchParams: Promise<{ vessel?: string }> }) {
  const data = await getFleetDashboard();
  const params = await searchParams;
  return <Dashboard data={data} selectedVessel={params.vessel ?? ""} />;
}
