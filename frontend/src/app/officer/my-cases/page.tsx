import { OfficerMyCasesContent } from "@/features/officer-cases/components/OfficerMyCasesContent";
import { OfficerShell } from "@/features/officer-dashboard/components/OfficerShell";

export default function OfficerMyCasesPage() {
  return (
    <OfficerShell>
      <OfficerMyCasesContent />
    </OfficerShell>
  );
}
