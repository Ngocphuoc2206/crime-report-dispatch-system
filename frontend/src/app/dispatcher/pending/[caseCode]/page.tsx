import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherPendingDetailContent } from "@/features/dispatcher-pending/components/DispatcherPendingDetailContent";

type DispatcherPendingDetailPageProps = {
  params: Promise<{
    caseCode: string;
  }>;
};

export default async function DispatcherPendingDetailPage({
  params,
}: DispatcherPendingDetailPageProps) {
  const { caseCode } = await params;

  return (
    <DispatcherShell>
      <DispatcherPendingDetailContent caseCode={decodeURIComponent(caseCode)} />
    </DispatcherShell>
  );
}
