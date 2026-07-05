import { DispatcherShell } from "@/features/dispatcher-dashboard/components/DispatcherShell";
import { DispatcherAssignedDetailContent } from "@/features/dispatcher-assigned/components/DispatcherAssignedDetailContent";

type DispatcherAssignedDetailPageProps = {
  params: Promise<{
    taskId: string;
  }>;
};

export default async function DispatcherAssignedDetailPage({
  params,
}: DispatcherAssignedDetailPageProps) {
  const { taskId } = await params;

  return (
    <DispatcherShell>
      <DispatcherAssignedDetailContent taskId={decodeURIComponent(taskId)} />
    </DispatcherShell>
  );
}
