"use server";

import { requireSession } from "@/app/api/_server/auth/session";
import { processMaintenanceReport } from "@/app/api/_server/services/maintenance.service";

export async function submitReport(formData: FormData) {
  const session = await requireSession();
  return processMaintenanceReport(formData, session);
}
