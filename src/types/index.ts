export interface PageInfo {
  total: number;
  has_more: boolean;
  cursor?: string;
}

export interface Address {
  streetAddress?: string;
  city?: string;
  state?: string;
  country: string;
  zipcode?: string;
}

export interface GeoPosition {
  lat: number;
  lng: number;
}

export interface CustomField {
  value?: string;
  values?: string[];
  visibility?: 'creator' | 'forwarding_chain' | 'everyone';
}

export interface Pagination {
  skip?: number;
  take?: number;
  cursor?: string;
}
