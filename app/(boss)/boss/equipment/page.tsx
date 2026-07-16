import { EquipmentCrud } from "@/app/(boss)/boss/equipment-crud";
import { getFleetDashboard } from "@/app/api/_server/services/fleet.service";
export default async function EquipmentPage() {
     const data = await getFleetDashboard();
     const equipment = data.vessels.flatMap(vessel =>
          vessel.equipments.map(item => ({
               ...item,
               vesselId: vessel.id,
               vesselName: vessel.name,
          })),
     );
     return (
          <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    Pengaturan armada
               </p>
               <h1 className="mt-2 text-3xl font-bold text-slate-950">Equipment</h1>
               <p className="mt-2 text-sm text-slate-500">
                    Kategori equipment dikontrol oleh enum sistem. Setiap data membutuhkan 1-10
                    foto.
               </p>
               <div className="mt-6">
                    <EquipmentCrud vessels={data.vessels} equipment={equipment} />
               </div>
          </div>
     );
}
