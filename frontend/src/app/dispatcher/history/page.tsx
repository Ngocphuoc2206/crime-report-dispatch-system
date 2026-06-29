import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherAssignedContent } from "@/features/dispatcher-assigned/components/DispatcherAssignedContent";

export default function DispatcherHistoryPage() {
  return (
    <DispatcherShell>
      <DispatcherAssignedContent />
    </DispatcherShell>
  );
}
