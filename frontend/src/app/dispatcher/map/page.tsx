import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherMapContent } from "@/features/dispatcher-map/components/DispatcherMapContent";

export default function DispatcherMapPage() {
  return (
    <DispatcherShell>
      <DispatcherMapContent />
    </DispatcherShell>
  );
}
