import { CommanderMapContent } from "@/features/commander-dashboard/components/CommanderMapContent";
import { CommanderShell } from "@/features/commander-dashboard/components/CommanderShell";

export default function CommanderMapPage() {
  return (
    <CommanderShell>
      <CommanderMapContent />
    </CommanderShell>
  );
}
