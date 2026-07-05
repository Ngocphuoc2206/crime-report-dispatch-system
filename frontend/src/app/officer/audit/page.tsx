import { OfficerAuditContent } from "@/features/officer-audit/components/OfficerAuditContent";
import { OfficerShell } from "@/features/officer-dashboard/components/OfficerShell";

export default function OfficerAuditPage() {
  return (
    <OfficerShell>
      <OfficerAuditContent />
    </OfficerShell>
  );
}
