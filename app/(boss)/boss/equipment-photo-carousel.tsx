"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

export function EquipmentPhotoCarousel({ name, photos }: { name: string; photos: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  if (!photos.length) return <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><Images className="h-4 w-4" /></div>;
  const previous = () => setIndex(current => (current - 1 + photos.length) % photos.length);
  const next = () => setIndex(current => (current + 1) % photos.length);
  return <><button type="button" onClick={() => { setIndex(0); setOpen(true); }} className="group relative flex -space-x-2 text-left" aria-label={`Open ${name} photos`}><span className="sr-only">Open photos</span>{photos.slice(0, 3).map((url, photoIndex) => <Image key={url} src={url} alt={`${name} ${photoIndex + 1}`} width={48} height={48} className="h-12 w-12 rounded-lg border-2 border-white object-cover transition group-hover:brightness-75" />)}{photos.length > 3 && <span className="absolute -bottom-2 -right-2 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">+{photos.length - 3}</span>}</button>{open && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true" aria-label={`${name} photo carousel`} onClick={() => setOpen(false)}><div className="relative w-full max-w-3xl rounded-2xl bg-white p-3 shadow-2xl" onClick={event => event.stopPropagation()}><button type="button" onClick={() => setOpen(false)} className="absolute right-5 top-5 z-10 rounded-full bg-slate-950/70 p-2 text-white hover:bg-slate-950" aria-label="Tutup carousel"><X className="h-5 w-5" /></button><Image src={photos[index]} alt={`${name} ${index + 1}`} width={1200} height={800} className="max-h-[75vh] w-full rounded-xl object-contain" /><button type="button" onClick={previous} className="absolute left-5 top-1/2 rounded-full bg-slate-950/70 p-2 text-white hover:bg-slate-950" aria-label="Foto sebelumnya"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={next} className="absolute right-5 top-1/2 rounded-full bg-slate-950/70 p-2 text-white hover:bg-slate-950" aria-label="Foto berikutnya"><ChevronRight className="h-5 w-5" /></button><div className="flex items-center justify-between px-2 pt-3 text-sm text-slate-500"><span>{name}</span><span>{index + 1} / {photos.length}</span></div></div></div>}</>;
}
