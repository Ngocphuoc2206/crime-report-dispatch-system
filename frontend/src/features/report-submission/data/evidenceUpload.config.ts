import { EvidenceFileKind } from "../types/reportSubmission.types";

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
export const MAX_EVIDENCE_FILES = 10;

export const allowedEvidenceMimeTypes: Record<string, EvidenceFileKind> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",

  "video/mp4": "video",
  "video/quicktime": "video",
  "video/webm": "video",

  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  "audio/webm": "audio",
  "audio/mp4": "audio",
  "audio/x-m4a": "audio",
};

export function getMaxFileSizeByKind(kind: EvidenceFileKind) {
  if (kind === "image") return MAX_IMAGE_SIZE;
  if (kind === "audio") return MAX_AUDIO_SIZE;
  return MAX_VIDEO_SIZE;
}

export function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
