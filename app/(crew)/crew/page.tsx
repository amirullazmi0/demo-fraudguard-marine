import { Camera, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { ReportForm } from "@/app/(crew)/crew/report-form";
import { getFleetDashboard } from "@/app/api/_server/services/fleet.service";

export default async function CrewPage() {
  const data = await getFleetDashboard();
  return <div className="min-h-[calc(100vh-128px)] bg-slate-200/70 px-0 py-0 sm:py-8"><div className="mx-auto min-h-[calc(100vh-128px)] w-full max-w-[430px] bg-[#f4f8fb] px-4 py-6 shadow-xl sm:min-h-0 sm:rounded-[2rem] sm:px-5 sm:py-7"><section><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-700"><ShieldCheck className="h-3.5 w-3.5" />Crew operations</div><h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950">Laporkan kondisi equipment dalam hitungan detik.</h1><p className="mt-3 text-sm leading-6 text-slate-500">Ambil bukti langsung dari ponsel untuk pemeriksaan teknis yang cepat.</p><div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-xl border border-slate-200 bg-white p-3"><Camera className="h-4 w-4 text-cyan-600" /><p className="mt-2 text-xs font-semibold">Utamakan kamera</p></div><div className="rounded-xl border border-slate-200 bg-white p-3"><Sparkles className="h-4 w-4 text-cyan-600" /><p className="mt-2 text-xs font-semibold">Dibantu AI</p></div><div className="rounded-xl border border-slate-200 bg-white p-3"><Clock3 className="h-4 w-4 text-cyan-600" /><p className="mt-2 text-xs font-semibold">Dapat dilacak</p></div></div></section><div className="mt-6"><ReportForm vessels={data.vessels} /></div></div></div>;
}


