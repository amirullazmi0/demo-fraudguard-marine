import Link from "next/link";
import { Anchor, Bell, ClipboardCheck, LayoutDashboard, LogOut, Ship } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { getSession } from "@/app/api/_server/auth/session";

export async function AppShell({
     children,
     role,
}: {
     children: React.ReactNode;
     role: "crew" | "boss";
}) {
     const session = await getSession();
     return (
          <div className="min-h-screen overflow-x-hidden bg-[#f4f8fb] text-slate-900">
               <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
                         <Link
                              href={role === "boss" ? "/boss" : "/crew"}
                              className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
                         >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-700 text-white">
                                   <Anchor className="h-5 w-5" />
                              </span>
                              <span className="min-w-0">
                                   <span className="block truncate text-sm font-bold tracking-wide text-slate-950 sm:text-base">
                                        MARINEGUARD
                                   </span>
                                   <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                                        Maintenance intelligence
                                   </span>
                              </span>
                         </Link>
                         <nav className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                              <Link
                                   aria-label="Report"
                                   href="/crew"
                                   className={`rounded-lg px-2 py-2 text-sm font-medium sm:px-3 ${role === "crew" ? "bg-cyan-50 text-cyan-700" : "text-slate-500 hover:bg-slate-50"}`}
                              >
                                   <ClipboardCheck className="h-5 w-5 sm:mr-1.5 sm:inline" />
                                   <span className="hidden sm:inline">Report</span>
                              </Link>
                              {session?.role === "ADMIN" && (
                                   <Link
                                        aria-label="Dashboard"
                                        href="/boss"
                                        className={`rounded-lg px-2 py-2 text-sm font-medium sm:px-3 ${role === "boss" ? "bg-cyan-50 text-cyan-700" : "text-slate-500 hover:bg-slate-50"}`}
                                   >
                                        <LayoutDashboard className="h-5 w-5 sm:mr-1.5 sm:inline" />
                                        <span className="hidden sm:inline">Dashboard</span>
                                   </Link>
                              )}
                              <span className="hidden max-w-40 truncate px-2 text-xs text-slate-400 lg:inline">
                                   {session?.email}
                              </span>
                              <form action={logoutAction}>
                                   <button
                                        aria-label="Logout"
                                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"
                                   >
                                        <LogOut className="h-4 w-4" />
                                   </button>
                              </form>
                              <button
                                   aria-label="Notifications"
                                   className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-50 sm:block"
                              >
                                   <Bell className="h-4 w-4" />
                              </button>
                         </nav>
                    </div>
               </header>
               <main>{children}</main>
               <footer className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-6 text-[10px] text-slate-400 sm:px-6 sm:text-xs lg:px-8">
                    <span>MARINEGUARD</span>
                    <span className="hidden items-center gap-1 sm:flex">
                         <Ship className="h-3.5 w-3.5" /> Fleet operations console
                    </span>
               </footer>
          </div>
     );
}
