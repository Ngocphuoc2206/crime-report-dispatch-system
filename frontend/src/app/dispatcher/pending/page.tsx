import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherPendingContent } from "@/features/dispatcher-pending/components/DispatcherPendingContent";

export default function DispatcherPendingPage() {
  return (
    <DispatcherShell>
      <DispatcherPendingContent />
    </DispatcherShell>
  );
}
