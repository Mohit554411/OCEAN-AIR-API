export enum VehicleType {
  TRACTOR = 'tractor',
  TRAILER = 'trailer',
  VESSEL = 'vessel',
  BARGE = 'barge',
  RAIL = 'rail',
  TERMINAL = 'terminal'
}

export interface Equipment {
  equipmentId: string;
  equipmentType: 'container' | 'pallet' | 'parcel' | 'bulk';
}

export interface VehicleData {
  licensePlateNumber: string;
  vehicleType: VehicleType;
  trackerId?: string;
  equipment?: Equipment[];
  isActive?: boolean;
}

export interface Allocation {
  trackerId?: string;
  licensePlateNumber: string;
  createdAt: string;
}

export interface VehicleAllocationRequest {
  licensePlateNumber: string;
}
