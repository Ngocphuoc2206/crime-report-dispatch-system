import { CommanderShell } from "@/features/commander-dashboard/components/CommanderShell";
import { CommanderCasesContent } from "@/features/commander-cases/components/CommanderCasesContent";

export default function CommanderCasesPage() {
  return (
    <CommanderShell>
      <CommanderCasesContent />
    </CommanderShell>
  );
}
