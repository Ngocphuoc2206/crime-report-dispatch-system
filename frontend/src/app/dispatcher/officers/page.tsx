import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherOfficersContent } from "@/features/dispatcher-officers/components/DispatcherOfficersContent";

export default function DispatcherOfficersPage() {
  return (
    <DispatcherShell>
      <DispatcherOfficersContent />
    </DispatcherShell>
  );
}
