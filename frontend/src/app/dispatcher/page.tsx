import { DispatcherOverviewContent } from "@/features/dispatcher-dashboard/components/DispatcherOverviewContent";
import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";

export default function DispatcherPage() {
  return (
    <DispatcherShell>
      <DispatcherOverviewContent />
    </DispatcherShell>
  );
}
