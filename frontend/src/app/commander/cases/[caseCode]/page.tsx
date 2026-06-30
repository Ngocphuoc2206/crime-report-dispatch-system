import { CommanderShell } from "@/features/commander-dashboard/components/CommanderShell";
import { CommanderCaseDetailContent } from "@/features/commander-cases/components/CommanderCaseDetailContent";

type CommanderCaseDetailPageProps = {
  params: Promise<{
    caseCode: string;
  }>;
};

export default async function CommanderCaseDetailPage({
  params,
}: CommanderCaseDetailPageProps) {
  const { caseCode } = await params;

  return (
    <CommanderShell>
      <CommanderCaseDetailContent caseCode={decodeURIComponent(caseCode)} />
    </CommanderShell>
  );
}
