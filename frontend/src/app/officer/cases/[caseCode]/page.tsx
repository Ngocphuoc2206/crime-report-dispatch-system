import { OfficerCaseDetailContent } from "@/features/officer-cases/components/OfficerCaseDetailContent";
import { OfficerShell } from "@/features/officer-dashboard/components/OfficerShell";

type OfficerCaseDetailPageProps = {
  params: Promise<{
    caseCode: string;
  }>;
};

export default async function OfficerCaseDetailPage({
  params,
}: OfficerCaseDetailPageProps) {
  const { caseCode } = await params;

  return (
    <OfficerShell>
      <OfficerCaseDetailContent caseCode={decodeURIComponent(caseCode)} />
    </OfficerShell>
  );
}
