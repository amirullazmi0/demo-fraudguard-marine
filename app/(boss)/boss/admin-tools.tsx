"use client";

import { Plus, Ship, Wrench } from "lucide-react";
import { createEquipment, createVessel } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { VesselView } from "@/lib/types";

export function AdminTools({ vessels }: { vessels: VesselView[] }) {
  return <div className="mt-6 grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle><Ship className="mr-2 inline h-4 w-4 text-cyan-600" />Tambah kapal</CardTitle></CardHeader><CardContent><form action={async (formData) => { await createVessel(formData); }} className="space-y-4"><div className="space-y-2"><Label>Nama</Label><Input name="name" placeholder="MV Baru Vessel" required /></div><div className="space-y-2"><Label>Nomor IMO</Label><Input name="imoNumber" placeholder="IMO 1234567" required /></div><Button type="submit"><Plus className="mr-2 h-4 w-4" />Tambah kapal</Button></form></CardContent></Card><Card><CardHeader><CardTitle><Wrench className="mr-2 inline h-4 w-4 text-cyan-600" />Tambah equipment</CardTitle></CardHeader><CardContent><form action={async (formData) => { await createEquipment(formData); }} className="space-y-4"><div className="space-y-2"><Label>Kapal</Label><Select name="vesselId" required><SelectTrigger><SelectValue placeholder="Pilih kapal" /></SelectTrigger><SelectContent>{vessels.map(vessel => <SelectItem key={vessel.id} value={vessel.id}>{vessel.name}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Nama</Label><Input name="name" placeholder="Main Engine" required /></div><div className="space-y-2"><Label>Kategori</Label><Input name="category" placeholder="Propulsion" required /></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Masa pakai (bulan)</Label><Input name="lifespanMonths" type="number" min="1" required /></div><div className="space-y-2"><Label>Servis terakhir</Label><Input name="lastServiceDate" type="date" required /></div></div><Button type="submit"><Plus className="mr-2 h-4 w-4" />Tambah equipment</Button></form></CardContent></Card></div>;
}


