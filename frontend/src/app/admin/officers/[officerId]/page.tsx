import { AdminShell } from "@/features/admin-dashboard/components/AdminShell";
import { AdminOfficerDetailContent } from "@/features/admin-officers/components/AdminOfficerDetailContent";

type AdminOfficerDetailPageProps = {
  params: Promise<{
    officerId: string;
  }>;
};

export default async function AdminOfficerDetailPage({
  params,
}: AdminOfficerDetailPageProps) {
  const { officerId } = await params;

  return (
    <AdminShell>
      <AdminOfficerDetailContent officerId={decodeURIComponent(officerId)} />
    </AdminShell>
  );
}
