import { OfficerCaseInboxContent } from "@/features/officer-cases/components/OfficerCaseInboxContent";
import { OfficerShell } from "@/features/officer-dashboard/components/OfficerShell";

export default function OfficerCasesPage() {
  return (
    <OfficerShell>
      <OfficerCaseInboxContent />
    </OfficerShell>
  );
}
