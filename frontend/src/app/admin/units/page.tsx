import { AdminShell } from "@/features/admin-dashboard/components/AdminShell";
import { AdminUnitsContent } from "@/features/admin-units/components/AdminUnitsContent";

export default function AdminUnitsPage() {
  return (
    <AdminShell>
      <AdminUnitsContent />
    </AdminShell>
  );
}
