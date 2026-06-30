export type DispatcherMapPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type DispatcherMapStatus =
  | "PENDING"
  | "DISPATCHED"
  | "ON_SCENE"
  | "RESOLVED";

export type DispatcherMapCase = {
  id: string;
  caseCode: string;
  title: string;
  type: string;
  priority: DispatcherMapPriority;
  status: DispatcherMapStatus;
  location: string;
  district: string;
  reportedAt: string;
  lat: number;
  lng: number;
  nearestUnit: string;
  eta: string;
  description: string;
};

export type DispatcherMapUnit = {
  id: string;
  unitCode: string;
  unitName: string;
  status: "READY" | "BUSY" | "OFFLINE";
  location: string;
  lat: number;
  lng: number;
};
