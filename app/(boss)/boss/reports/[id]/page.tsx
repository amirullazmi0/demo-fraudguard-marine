import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findReportById } from "@/app/api/_server/services/fleet.service";
import { formatDate } from "@/lib/utils";

export default async function ReportDetailPage({
     params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
     const report = await findReportById((await params).id);
     if (!report) notFound();
     const ai = report.aiAnalysisJson as {
          analysis: string;
          recommendation: string;
          fraud_risk_score: number;
          severity: "Low" | "Medium" | "High";
     };
     return (
          <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
               <Link href="/boss/reports" className="text-sm font-semibold text-cyan-700">
                    <ArrowLeft className="mr-1 inline h-4 w-4" />
                    Kembali ke report
               </Link>
               <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                         <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                              Laporan pemeliharaan
                         </p>
                         <h1 className="mt-2 text-3xl font-bold text-slate-950">
                              {report.equipment.name}
                         </h1>
                         <p className="mt-2 text-sm text-slate-500">
                              {report.equipment.vessel.name} · ID laporan {report.id}
                         </p>
                    </div>
                    {report.isFraud && (
                         <Badge variant="danger">
                              <ShieldAlert className="mr-1 h-3.5 w-3.5" />
                              Peringatan fraud
                         </Badge>
                    )}
               </div>
               <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <Card>
                         <CardContent className="p-5">
                              <div className="grid grid-cols-2 gap-3">
                                   {report.photos.map((photo: { id: string; url: string }) => (
                                        <Image
                                             key={photo.id}
                                             src={photo.url}
                                             alt="Bukti pemeliharaan"
                                             width={800}
                                             height={800}
                                             className="aspect-square w-full rounded-xl object-cover"
                                        />
                                   ))}
                              </div>
                              <div className="mt-5 space-y-4">
                                   <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                             Alasan kerusakan dari user
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-slate-700">
                                             {report.damageReason}
                                        </p>
                                   </div>
                                   <div className="flex flex-wrap gap-5 text-xs text-slate-500">
                                        <span>Dilaporkan oleh {report.createdBy.email}</span>
                                        <span>
                                             <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
                                             {formatDate(report.createdAt)}
                                        </span>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                              <CardTitle>Penilaian AI</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-5">
                              <div>
                                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Ringkasan pemeliharaan
                                   </p>
                                   <p className="mt-2 text-sm leading-6 text-slate-700">
                                        {ai.analysis}
                                   </p>
                              </div>
                              <div>
                                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Pendapat dan rekomendasi AI
                                   </p>
                                   <p className="mt-2 rounded-xl bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
                                        {ai.recommendation}
                                   </p>
                              </div>
                              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                                   <span className="text-sm font-semibold text-slate-700">
                                        Skor risiko fraud
                                   </span>
                                   <span
                                        className={`text-xl font-bold ${ai.fraud_risk_score > 70 ? "text-rose-600" : "text-cyan-700"}`}
                                   >
                                        {ai.fraud_risk_score}/100
                                   </span>
                              </div>
                              <Badge
                                   variant={
                                        ai.severity === "High"
                                             ? "danger"
                                             : ai.severity === "Medium"
                                               ? "warning"
                                               : "success"
                                   }
                              >
                                   Tingkat kerusakan: {ai.severity}
                              </Badge>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
