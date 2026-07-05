import { apiClient } from "@/services/apiClient";

export async function openEvidenceFile(path: string, fileName: string) {
  const blob = await apiClient.blob(path, { auth: true });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60_000);
}
