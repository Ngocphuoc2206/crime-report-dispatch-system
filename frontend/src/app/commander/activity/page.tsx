import { CommanderActivityContent } from "@/features/commander-activity/components/CommanderActivityContent";
import { CommanderShell } from "@/features/commander-dashboard/components/CommanderShell";

export default function CommanderActivityPage() {
  return (
    <CommanderShell>
      <CommanderActivityContent />
    </CommanderShell>
  );
}
