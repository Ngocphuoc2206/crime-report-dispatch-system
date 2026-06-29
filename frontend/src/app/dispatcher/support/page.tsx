import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherSupportContent } from "@/features/dispatcher-support/components/DispatcherSupportContent";

export default function DispatcherSupportPage() {
  return (
    <DispatcherShell>
      <DispatcherSupportContent />
    </DispatcherShell>
  );
}
