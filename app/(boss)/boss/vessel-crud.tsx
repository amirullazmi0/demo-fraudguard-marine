"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createVessel, deleteVessel, updateVessel } from "@/actions/admin";
import { CrudAlert } from "@/components/crud-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VesselView } from "@/lib/types";

type Result = { success?: boolean; error?: string };
export function VesselCrud({ vessels }: { vessels: VesselView[] }) { const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null); const [pending, startTransition] = useTransition(); function run(action: (data: FormData) => Promise<Result>, form: HTMLFormElement, success: string) { const data = new FormData(form); startTransition(async () => { const result = await action(data); setMessage(result.error ? { type: "error", text: result.error } : { type: "success", text: success }); }); } return <div><CrudAlert message={message} /><Card><CardHeader><CardTitle>Tambah kapal</CardTitle></CardHeader><CardContent><form onSubmit={event => { event.preventDefault(); run(createVessel, event.currentTarget, "Kapal berhasil ditambahkan."); }} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><div className="space-y-2"><Label>Nama</Label><Input name="name" placeholder="MV Baru Vessel" required /></div><div className="space-y-2"><Label>Nomor IMO</Label><Input name="imoNumber" placeholder="IMO 1234567" required /></div><Button disabled={pending} type="submit"><Plus className="mr-2 h-4 w-4" />Tambah</Button></form></CardContent></Card><div className="mt-6 space-y-3">{vessels.map(vessel => <Card key={vessel.id}><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><form onSubmit={event => { event.preventDefault(); run(updateVessel, event.currentTarget, "Kapal berhasil diperbarui."); }} className="grid flex-1 gap-3 sm:grid-cols-2"><input type="hidden" name="id" value={vessel.id} /><Input name="name" defaultValue={vessel.name} required /><Input name="imoNumber" defaultValue={vessel.imoNumber} required /><Button variant="outline" disabled={pending} type="submit"><Pencil className="mr-2 h-4 w-4" />Perbarui</Button></form><form onSubmit={event => { if (!window.confirm(`Hapus ${vessel.name}?`)) event.preventDefault(); else { event.preventDefault(); run(deleteVessel, event.currentTarget, "Kapal berhasil dihapus."); } }}><input type="hidden" name="id" value={vessel.id} /><Button variant="ghost" disabled={pending} type="submit" className="text-rose-600"><Trash2 className="mr-2 h-4 w-4" />Hapus</Button></form></CardContent></Card>)}</div></div>; }
