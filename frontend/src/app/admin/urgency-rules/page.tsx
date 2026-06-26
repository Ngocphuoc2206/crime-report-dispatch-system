import { AdminShell } from "@/features/admin-dashboard/components/AdminShell";
import { AdminUrgencyRulesContent } from "@/features/admin-urgency-rules/components/AdminUrgencyRulesContent";

export default function AdminUrgencyRulesPage() {
  return (
    <AdminShell>
      <AdminUrgencyRulesContent />
    </AdminShell>
  );
}
