import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherHistoryContent } from "@/features/dispatcher-history/components/DispatcherHistoryContent";

export default function DispatcherHistoryPage() {
  return (
    <DispatcherShell>
      <DispatcherHistoryContent />
    </DispatcherShell>
  );
}
