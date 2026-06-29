export type DispatchHistoryItem = {
  id: string;
  taskId: string | null;
  caseCode: string;
  title: string;
  urgencyLevel: string;
  action: string;
  previousStatus: string | null;
  nextStatus: string | null;
  assignedUnit: string;
  assignedOfficer: string;
  reason: string;
  actor: string;
  createdAt: string;
};
