"use client";

import Link from "next/link";
import { BarChart3, ClipboardList, Ship, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [{ href: "/boss", label: "Dashboard", icon: BarChart3 }, { href: "/boss/vessels", label: "Vessels", icon: Ship }, { href: "/boss/equipment", label: "Equipment", icon: Wrench }, { href: "/boss/reports", label: "Reports", icon: ClipboardList }];
export function AdminSidebar() { const pathname = usePathname(); return <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-56 lg:border-b-0 lg:border-r"><div className="grid grid-cols-4 gap-1 p-2 lg:block lg:space-y-1 lg:p-4">{items.map(item => { const active = item.href === "/boss" ? pathname === item.href : pathname.startsWith(item.href); const Icon = item.icon; return <Link key={item.href} href={item.href} className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center text-[10px] font-semibold transition sm:flex-row sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm lg:justify-start ${active ? "bg-cyan-50 text-cyan-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon className="h-4 w-4 shrink-0" /><span className="truncate">{item.label}</span></Link>; })}</div></aside>; }