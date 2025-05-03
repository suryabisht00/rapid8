import { ReactNode } from 'react';

export interface Stats {
  activeEmergencies: number;
  availableBeds: number;
  icuAvailable: number;
  ambulancesAvailable: number;
  staffOnDuty: number;
}

export interface Emergency {
  id: number;
  patient: string;
  type: string;
  location: string;
  eta: string;
}

export interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  trend?: "up" | "down";
}

export interface ResourceChartProps {
  title: string;
  used: number;
  total: number;
  color: string;
}
