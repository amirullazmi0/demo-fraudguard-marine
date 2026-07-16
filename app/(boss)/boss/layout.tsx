import { AdminSidebar } from "@/components/admin-sidebar";
import { AppShell } from "@/components/app-shell";

export default function BossLayout({ children }: { children: React.ReactNode }) { return <AppShell role="boss"><div className="mx-auto max-w-[1440px] px-0 py-0 sm:px-6 sm:py-5 lg:px-8"><div className="flex min-w-0 flex-col overflow-hidden border-slate-200 bg-white sm:rounded-2xl sm:border sm:shadow-sm lg:min-h-[calc(100vh-9rem)] lg:flex-row"><AdminSidebar /><div className="min-w-0 flex-1 overflow-x-hidden bg-[#f4f8fb]">{children}</div></div></div></AppShell>; }