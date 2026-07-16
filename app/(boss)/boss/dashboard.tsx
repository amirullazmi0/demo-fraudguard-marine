import Image from "next/image";
import Link from "next/link";
import {
     AlertTriangle,
     CalendarDays,
     ChevronRight,
     CircleCheck,
     Gauge,
     ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { DashboardData, EquipmentStatus } from "@/lib/types";
import { VesselSelector } from "@/app/(boss)/boss/vessel-selector";

const statusMeta: Record<
     EquipmentStatus,
     { label: string; variant: "success" | "warning" | "danger" | "muted" }
> = {
     OPERATIONAL: { label: "Operational", variant: "success" },
     ATTENTION: { label: "Attention", variant: "warning" },
     CRITICAL: { label: "Critical", variant: "danger" },
     OFFLINE: { label: "Offline", variant: "muted" },
};

export function Dashboard({
     data,
     selectedVessel,
}: Readonly<{
     data: DashboardData;
     selectedVessel: string;
}>) {
     const vessels = selectedVessel
          ? data.vessels.filter(vessel => vessel.id === selectedVessel)
          : data.vessels;
     const equipment = vessels.flatMap(vessel =>
          vessel.equipments.map(item => ({ ...item, vesselName: vessel.name })),
     );
     const logs = equipment
          .flatMap(item =>
               item.logs.map(log => ({
                    ...log,
                    equipmentName: item.name,
                    vesselName: item.vesselName,
               })),
          )
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
     const fraudCount = logs.filter(log => log.isFraud || Number(log.aiAnalysis.fraud_risk_score) > 70).length; const attentionCount = equipment.filter(item => item.status === "ATTENTION" || item.status === "CRITICAL" || item.logs.some(log => log.aiAnalysis.severity === "Medium" || log.aiAnalysis.severity === "High")).length;

     return (
          <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
               <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                         <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                              <Gauge className="h-4 w-4" />
                              Ringkasan armada
                         </div>
                         <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                              Pusat kendali pemeliharaan
                         </h1>
                         <p className="mt-2 text-sm text-slate-500">
                              Pantau kondisi armada yang Anda kelola secara langsung.
                         </p>
                    </div>
                    <VesselSelector vessels={data.vessels} selected={selectedVessel} />
               </div>
               <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Metric
                         title="Kapal armada"
                         value={vessels.length}
                         detail="dalam tampilan terpilih"
                         icon={<CalendarDays className="h-5 w-5" />}
                    />
                    <Metric
                         title="Equipment terpantau"
                         value={equipment.length}
                         detail="aset terdaftar"
                         icon={<Gauge className="h-5 w-5" />}
                    />
                    <Metric
                         title="Perlu perhatian"
                         value={attentionCount}
                         detail="perlu ditinjau"
                         icon={<AlertTriangle className="h-5 w-5" />}
                         accent="amber"
                    />
                    <Metric
                         title="Peringatan fraud"
                         value={fraudCount}
                         detail="Risiko AI di atas 70"
                         icon={<ShieldAlert className="h-5 w-5" />}
                         accent="rose"
                    />
               </div>
               <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <Card>
                         <CardHeader>
                              <div className="flex items-center justify-between">
                                   <div>
                                        <CardTitle>Kondisi equipment</CardTitle>
                                        <p className="mt-1 text-sm text-slate-500">
                                             Status berdasarkan kapal dan sistem kritis.
                                        </p>
                                   </div>
                                   <Badge variant="muted">{"PostgreSQL"}</Badge>
                              </div>
                         </CardHeader>
                         <CardContent className="space-y-3">
                              {equipment.map(item => (
                                   <div
                                        className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
                                        key={item.id}
                                   >
                                        <div className="min-w-0">
                                             <p className="truncate text-sm font-semibold text-slate-800">
                                                  {item.name}
                                             </p>
                                             <p className="mt-1 text-xs text-slate-400">
                                                  {item.vesselName} · {item.category}
                                             </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-3">
                                             <Badge variant={statusMeta[item.status].variant}>
                                                  {statusMeta[item.status].label}
                                             </Badge>
                                             <ChevronRight className="h-4 w-4 text-slate-300" />
                                        </div>
                                   </div>
                              ))}
                              {!equipment.length && (
                                   <p className="py-10 text-center text-sm text-slate-400">
                                        Tidak ada equipment untuk kapal ini.
                                   </p>
                              )}
                         </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                              <CardTitle>Feed audit AI</CardTitle>
                              <p className="mt-1 text-sm text-slate-500">
                                   Bukti pemeliharaan terbaru.
                              </p>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              {logs.slice(0, 5).map(log => (
                                   <details
                                        className="group rounded-xl border border-slate-100 p-3"
                                        key={log.id}
                                   >
                                        <summary className="flex cursor-pointer list-none items-start gap-3">
                                             <Image src={log.photoUrls[0]} alt="Bukti pemeliharaan" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                                             <span className="min-w-0 flex-1">
                                                  <span className="flex items-center justify-between gap-2">
                                                       <Link
                                                            href={`/boss/reports/${log.id}`}
                                                            className="truncate text-sm font-semibold text-slate-800 hover:text-cyan-700"
                                                       >
                                                            {log.equipmentName}
                                                       </Link>
                                                       {log.isFraud ? (
                                                            <Badge variant="danger">
                                                                 Peringatan fraud
                                                            </Badge>
                                                       ) : (
                                                            <CircleCheck className="h-4 w-4 text-emerald-500" />
                                                       )}
                                                  </span>
                                                  <span className="mt-1 block text-xs text-slate-400">
                                                       {log.vesselName} ·{" "}
                                                       {formatDate(log.createdAt)}
                                                  </span>
                                             </span>
                                        </summary>
                                        <div className="mt-3 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600">
                                             <p>{log.aiAnalysis.analysis}</p>
                                             <p className="mt-2 text-xs font-semibold text-slate-500">
                                                  Risiko fraud {log.aiAnalysis.fraud_risk_score}/100 ·{" "}
                                                  {log.aiAnalysis.severity}
                                             </p>
                                             <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                                                  <strong>Rekomendasi:</strong>{" "}
                                                  {log.aiAnalysis.recommendation}
                                             </p>
                                        </div>
                                   </details>
                              ))}
                              {!logs.length && (
                                   <p className="py-10 text-center text-sm text-slate-400">
                                        Belum ada report audit.
                                   </p>
                              )}
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}

function Metric({
     title,
     value,
     detail,
     icon,
     accent = "cyan",
}: {
     title: string;
     value: number;
     detail: string;
     icon: React.ReactNode;
     accent?: "cyan" | "amber" | "rose";
}) {
     const colors = {
          cyan: "bg-cyan-50 text-cyan-700",
          amber: "bg-amber-50 text-amber-700",
          rose: "bg-rose-50 text-rose-700",
     };
     return (
          <Card>
               <CardContent className="p-5">
                    <div
                         className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${colors[accent]}`}
                    >
                         {icon}
                    </div>
                    <p className="text-2xl font-bold text-slate-950">{value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">{title}</p>
                    <p className="mt-1 text-xs text-slate-400">{detail}</p>
               </CardContent>
          </Card>
     );
}
