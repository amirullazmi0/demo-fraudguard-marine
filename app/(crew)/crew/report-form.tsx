"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import { submitReport } from "@/actions/maintenance";
import { uploadImageDirect } from "@/lib/imagekit-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import type { AiAnalysis, VesselView } from "@/lib/types";

export function ReportForm({ vessels }: { vessels: VesselView[] }) {
     const [vesselId, setVesselId] = useState(vessels[0]?.id ?? "");
     const [equipmentId, setEquipmentId] = useState("");
     const [files, setFiles] = useState<File[]>([]);
     const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
     const [uploadPending, setUploadPending] = useState(false);
     const [result, setResult] = useState<AiAnalysis | null>(null);
     const [error, setError] = useState("");
     const [success, setSuccess] = useState("");
     const [pending, setPending] = useState(false);
     const inputRef = useRef<HTMLInputElement>(null);
     const equipment = vessels.find(vessel => vessel.id === vesselId)?.equipments ?? [];

     const previews = useMemo(
          () => files.map(file => ({ file, url: URL.createObjectURL(file) })),
          [files],
     );
     useEffect(
          () => () => previews.forEach(preview => URL.revokeObjectURL(preview.url)),
          [previews],
     );
     function handleVessel(value: string) {
          setVesselId(value);
          setEquipmentId("");
     }
     async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
          const incoming = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (!incoming.length) return;
          const available = incoming.slice(0, Math.max(0, 10 - files.length));
          if (incoming.length > available.length) setError("Maximum 10 photos.");
          setFiles(current => [...current, ...available]);
          setUploadPending(true);
          try {
               const uploaded = await Promise.all(available.map(file => uploadImageDirect(file, "/maintenance-reports")));
               setUploadedUrls(current => [...current, ...uploaded.map(item => item.url)]);
          } catch (uploadError) {
               setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
               setFiles(current => current.slice(0, current.length - available.length));
          } finally {
               setUploadPending(false);
          }
     }
     function removeFile(index: number) {
          setFiles(current => current.filter((_, fileIndex) => fileIndex !== index));
          setUploadedUrls(current => current.filter((_, urlIndex) => urlIndex !== index));
     }
     async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
          event.preventDefault();
          const form = event.currentTarget;
          setError("");
          setResult(null);
          if (uploadedUrls.length < 1) {
               setError("Upload at least 1 photo.");
               return;
          }
          if (uploadedUrls.length > 10) {
               setError("Upload a maximum of 10 photos.");
               return;
          }
          const formData = new FormData(form);
          formData.delete("photos");
          formData.delete("photoUrls");
          uploadedUrls.forEach(url => formData.append("photoUrls", url));
          setPending(true);
          const response = await submitReport(formData);
          setPending(false);
          if (response.ok) { form.reset(); setVesselId(""); setEquipmentId(""); setFiles([]); setUploadedUrls([]); if (inputRef.current) inputRef.current.value = ""; setResult(null); setSuccess("Report berhasil dikirim."); } else setError("Pengiriman report gagal. Silakan coba lagi.");
     }

     return (
          <Card className="overflow-hidden">
               <CardHeader className="border-b border-slate-100 bg-slate-50/70">
                    <CardTitle>Kirim bukti pemeliharaan</CardTitle>
                    <p className="mt-1 text-sm text-slate-500">
                         Unggah 1-10 foto yang jelas dan jelaskan dugaan kerusakan.
                    </p>
               </CardHeader>
               <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div className="space-y-2">
                              <Label>Kapal</Label>
                              <Select name="vesselId" value={vesselId} onValueChange={handleVessel}>
                                   <SelectTrigger>
                                        <SelectValue placeholder="Pilih kapal" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {vessels.map(vessel => (
                                             <SelectItem value={vessel.id} key={vessel.id}>
                                                  {vessel.name} · {vessel.imoNumber}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                         </div>
                         <div className="space-y-2">
                              <Label>Equipment</Label>
                              <Select
                                   name="equipmentId"
                                   value={equipmentId}
                                   onValueChange={setEquipmentId}
                              >
                                   <SelectTrigger>
                                        <SelectValue placeholder="Pilih equipment" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {equipment.map(item => (
                                             <SelectItem value={item.id} key={item.id}>
                                                  {item.name} · {item.category}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                         </div>
                         <div className="space-y-2">
                              <Label htmlFor="damageReason">Alasan kerusakan</Label>
                              <textarea id="damageReason" name="damageReason" placeholder="Contoh: terlihat rembesan oli di sekitar flange" required rows={4} className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                         </div>
                         <div className="space-y-3">
                              <label className="group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-5 text-center transition hover:border-cyan-400 hover:bg-cyan-50/30">
                                   <Camera className="mb-3 h-8 w-8 text-cyan-600" />
                                   <span className="text-sm font-semibold text-slate-700">
                                        Tambah foto
                                   </span>
                                   <span className="mt-1 text-xs text-slate-400">
                                        JPG, PNG atau HEIC · {files.length}/10 foto
                                   </span>
                                   <input
                                        ref={inputRef}
                                        name="photos"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        capture="environment"
                                        className="sr-only"
                                        onChange={handleFiles}
                                   />
                              </label>
                              {previews.length > 0 && (
                                   <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {previews.map((preview, index) => (
                                             <div
                                                  className="group relative overflow-hidden rounded-xl border border-slate-200"
                                                  key={`${preview.file.name}-${index}`}
                                             >
                                                  <Image
                                                       src={preview.url}
                                                       alt={`Preview ${index + 1}`}
                                                       width={320}
                                                       height={320}
                                                       unoptimized
                                                       className="aspect-square w-full object-cover"
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={() => removeFile(index)}
                                                       className="absolute right-2 top-2 rounded-full bg-slate-950/75 p-1.5 text-white opacity-100 transition hover:bg-rose-600"
                                                       aria-label={`Remove photo ${index + 1}`}
                                                  >
                                                       <X className="h-4 w-4" />
                                                  </button>
                                                  <span className="absolute bottom-2 left-2 rounded bg-slate-950/70 px-1.5 py-0.5 text-[10px] text-white">
                                                       {index + 1}/{files.length}
                                                  </span>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </div>
                         {success && (
                              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                   {success}
                              </p>
                         )}
                         {error && (
                              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                   {error}
                              </p>
                         )}
                         {result && (
                              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                   <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Report berhasil dianalisis
                                   </div>
                                   <p className="mt-2 text-sm leading-6 text-emerald-900">
                                        {result.analysis}
                                   </p>
                                   <p className="mt-2 text-xs text-emerald-700">
                                        Risiko fraud {result.fraud_risk_score}/100 · {result.severity}{" "}
                                        severity
                                   </p>
                              </div>
                         )}
                         <Button type="submit" className="w-full" disabled={pending || uploadPending}>
                              {uploadPending ? (
                                   <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Mengunggah foto…
                                   </>
                              ) : (
                                   <>
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        Kirim laporan
                                   </>
                              )}
                         </Button>
                    </form>
               </CardContent>
          </Card>
     );
}
