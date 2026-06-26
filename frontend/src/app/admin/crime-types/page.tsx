import { AdminShell } from "@/features/admin-dashboard/components/AdminShell";
import { AdminCrimeTypesContent } from "@/features/admin-crime-types/components/AdminCrimeTypesContent";

export default function AdminCrimeTypesPage() {
  return (
    <AdminShell>
      <AdminCrimeTypesContent />
    </AdminShell>
  );
}
