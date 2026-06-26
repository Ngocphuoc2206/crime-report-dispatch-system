import { CommanderDashboardContent } from "@/features/commander-dashboard/components/CommanderDashboardContent";
import { CommanderShell } from "@/features/commander-dashboard/components/CommanderShell";

export default function CommanderPage() {
  return (
    <CommanderShell>
      <CommanderDashboardContent />
    </CommanderShell>
  );
}
