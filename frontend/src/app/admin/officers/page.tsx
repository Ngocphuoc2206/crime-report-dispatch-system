import { AdminShell } from "@/features/admin-dashboard/components/AdminShell";
import { AdminOfficersContent } from "@/features/admin-officers/components/AdminOfficersContent";

export default function AdminOfficersPage() {
  return (
    <AdminShell>
      <AdminOfficersContent />
    </AdminShell>
  );
}
