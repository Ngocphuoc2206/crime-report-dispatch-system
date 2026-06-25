import { OfficerCaseDetailContent } from "@/features/officer-cases/components/OfficerCaseDetailContent";
import { OfficerShell } from "@/features/officer-dashboard/components/OfficerShell";

type OfficerMyCaseDetailPageProps = {
  params: Promise<{
    caseCode: string;
  }>;
};

export default async function OfficerMyCaseDetailPage({
  params,
}: OfficerMyCaseDetailPageProps) {
  const { caseCode } = await params;

  return (
    <OfficerShell>
      <OfficerCaseDetailContent
        caseCode={decodeURIComponent(caseCode)}
        backHref="/officer/my-cases"
        backLabel="Quay lại hồ sơ của tôi"
      />
    </OfficerShell>
  );
}
