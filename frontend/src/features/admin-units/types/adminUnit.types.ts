export type AdminUnitType =
  | "WARD_POLICE"
  | "DISTRICT_POLICE"
  | "CRIMINAL_POLICE"
  | "EMERGENCY_CENTER";

export type AdminArea = {
  id: string;
  code: string;
  name: string;
  areaType: string;
};

export type AdminPoliceUnit = {
  id: string;
  code: string;
  name: string;
  areaId: string;
  areaName: string;
  address: string;
  latitude: string;
  longitude: string;
  unitType: AdminUnitType;
  active: boolean;
};
