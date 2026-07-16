"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { VesselView } from "@/lib/types";

export function VesselSelector({ vessels, selected }: { vessels: VesselView[]; selected: string }) {
  const router = useRouter();
  const params = useSearchParams();
  function change(value: string) { const next = new URLSearchParams(params.toString()); if (value === "all") next.delete("vessel"); else next.set("vessel", value); router.push(`/boss${next.size ? `?${next.toString()}` : ""}`); }
  return <div className="w-full sm:w-72"><Select value={selected || "all"} onValueChange={change}><SelectTrigger><SelectValue placeholder="Semua kapal" /></SelectTrigger><SelectContent><SelectItem value="all">Semua kapal</SelectItem>{vessels.map(vessel => <SelectItem value={vessel.id} key={vessel.id}>{vessel.name}</SelectItem>)}</SelectContent></Select></div>;
}
