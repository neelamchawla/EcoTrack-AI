export const ACTIVITY_CATEGORIES = [
  "transport",
  "food",
  "energy",
  "shopping",
  "other",
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export interface UserProfile {
  displayName: string;
  weeklyGoalKg: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarbonActivity {
  uid: string;
  category: ActivityCategory;
  description: string;
  co2Kg: number;
  recordedAt: Date;
  createdAt: Date;
}

export interface CarbonActivityInput {
  category: ActivityCategory;
  description: string;
  co2Kg: number;
  recordedAt: Date;
}

export interface WeeklySummary {
  totalCo2Kg: number;
  activityCount: number;
  byCategory: Record<ActivityCategory, number>;
}
