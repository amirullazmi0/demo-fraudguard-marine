import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" }) {
  return <button className={cn("inline-flex h-10 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50", variant === "default" && "bg-cyan-600 text-white shadow-sm hover:bg-cyan-700", variant === "outline" && "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50", variant === "ghost" && "text-slate-600 hover:bg-slate-100", className)} {...props} />;
}
