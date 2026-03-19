import { type Request } from "express";

export interface User {
  id: string;
  email?: string;
  phone: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  user_id: string;
  name: string;
  aadhaar_last4?: string;
  land_id?: string;
  land_area?: number;
  beneficiary_type: 'individual' | 'wua';
  water_source?: string;
}

export interface WaterRequest {
  id: string;
  user_id: string;
  crop: string;
  season: 'kharif' | 'rabi' | 'hotWeather';
  duration_days: number;
  land_area: number;
  geo_location?: { lat: number; lng: number };
  photo_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  bill_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface Billing {
  id: string;
  user_id: string;
  request_id: string;
  amount: number;
  paid: boolean;
  paid_at?: Date;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
  token?: string;
}
