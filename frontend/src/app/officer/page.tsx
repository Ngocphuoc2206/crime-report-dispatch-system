import { OfficerDashboardContent } from "@/features/officer-dashboard/components/OfficerDashboardContent";
import { OfficerShell } from "@/features/officer-dashboard/components/OfficerShell";

export default function OfficerPage() {
  return (
    <OfficerShell>
      <OfficerDashboardContent />
    </OfficerShell>
  );
}
