const BACKEND_TIME_ZONE = "Asia/Bangkok";
const TIME_ZONE_PATTERN = /(?:z|[+-]\d{2}:\d{2})$/i;

export function parseBackendDateTime(value?: string | null) {
  if (!value) return null;

  const normalized = TIME_ZONE_PATTERN.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function getBackendDateTimeMs(value?: string | null) {
  return parseBackendDateTime(value)?.getTime() ?? Number.NaN;
}

export function formatVietnamTime(value?: string | null) {
  const date = parseBackendDateTime(value);
  if (!date) return value ?? "--";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BACKEND_TIME_ZONE,
  }).format(date);
}

export function formatVietnamDate(value?: string | null) {
  const date = parseBackendDateTime(value);
  if (!date) return value ?? "--";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeZone: BACKEND_TIME_ZONE,
  }).format(date);
}

export function formatVietnamDateTime(value?: string | null) {
  const date = parseBackendDateTime(value);
  if (!date) return value ?? "--";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: BACKEND_TIME_ZONE,
  }).format(date);
}
