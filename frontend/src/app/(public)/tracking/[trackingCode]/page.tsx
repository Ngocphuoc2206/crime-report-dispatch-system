import { TrackingDetailPageContent } from "@/features/tracking/components/TrackingDetailPageContent";

type TrackingDetailPageProps = {
  params: Promise<{
    trackingCode: string;
  }>;
};

export default async function TrackingDetailPage({
  params,
}: TrackingDetailPageProps) {
  const { trackingCode } = await params;

  return (
    <TrackingDetailPageContent
      trackingCode={decodeURIComponent(trackingCode)}
    />
  );
}
