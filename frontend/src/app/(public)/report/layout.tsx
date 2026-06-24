import { EvidenceFilesProvider } from "@/features/report-submission/contexts/EvidenceFilesContext";

export default function ReportLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <EvidenceFilesProvider>{children}</EvidenceFilesProvider>;
}
