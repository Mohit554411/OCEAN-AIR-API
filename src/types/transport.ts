import { GeoPosition, CustomField } from './index';

export enum TransportType {
  ROAD = 'road',
  OCEAN = 'ocean',
  AIR = 'air'
}

export enum TrackingState {
  PENDING = 'pending',
  TRACKING = 'tracking',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface VehicleTelemetry {
  timestamp: string;
  position: GeoPosition;
  direction?: number;
  speed?: number;
  odometer?: number;
  isEngineRunning?: boolean;
  frontAxleWeightKg?: number;
  rearAxleWeightKg?: number;
  totalWeightKg?: number;
  altitudeMeters?: number;
  fuelLevelPct?: number;
  cleanSourcePct?: number;
  totalFuelConsumptionLiters?: number;
}

export interface DeliveryEvent {
  eventId: string;
  timestamp: string;
  qualifier?: 'started' | 'completed' | 'arrived' | 'departed' | 'heading_towards';
  qualifierCustom?: string;
  position?: GeoPosition;
  deletedAt?: string;
}

export interface TransportEvent {
  eventId: string;
  timestamp: string;
  qualifier?: 'completed' | 'tracking_started';
  qualifierCustom?: string;
  locationData?: {
    name?: string;
    locode?: string;
  };
  position?: GeoPosition;
  deletedAt?: string;
}

export interface CreateTransportRequest {
  transportNumber: string;
  type: TransportType;
  startTime?: string;
  endTime?: string;
  customFields?: Record<string, CustomField>;
  company?: string;
  stops?: any[];
}

export interface TransportStatusUpdate {
  transportId?: string;
  transportNumber?: string;
  vehicleTelemetry?: VehicleTelemetry;
  loadingStatus?: {
    timestamp: string;
    eta?: string;
    estimatedRemainingDistanceMeters?: number;
    events?: DeliveryEvent[];
  };
  unloadingStatus?: {
    timestamp: string;
    eta?: string;
    estimatedRemainingDistanceMeters?: number;
    events?: DeliveryEvent[];
  };
  transportEvents?: TransportEvent[];
}
