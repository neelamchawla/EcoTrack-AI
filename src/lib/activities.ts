import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase.js";
import type {
  ActivityCategory,
  CarbonActivity,
  CarbonActivityInput,
  UserProfile,
  WeeklySummary,
} from "./types.js";
import { ACTIVITY_CATEGORIES } from "./types.js";

function requireUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("Sign in before accessing EcoTrack data.");
  }
  return uid;
}

function toDate(value: Timestamp | Date): Date {
  return value instanceof Timestamp ? value.toDate() : value;
}

function mapActivity(data: Record<string, unknown>): CarbonActivity {
  return {
    uid: data.uid as string,
    category: data.category as ActivityCategory,
    description: data.description as string,
    co2Kg: data.co2Kg as number,
    recordedAt: toDate(data.recordedAt as Timestamp),
    createdAt: toDate(data.createdAt as Timestamp),
  };
}

export async function upsertUserProfile(
  displayName: string,
  weeklyGoalKg: number,
): Promise<void> {
  const uid = requireUserId();
  const userRef = doc(db, "users", uid);
  const existing = await getDoc(userRef);
  const now = serverTimestamp();

  if (existing.exists()) {
    await setDoc(
      userRef,
      {
        displayName,
        weeklyGoalKg,
        updatedAt: now,
      },
      { merge: true },
    );
    return;
  }

  await setDoc(userRef, {
    displayName,
    weeklyGoalKg,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const uid = requireUserId();
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    displayName: data.displayName,
    weeklyGoalKg: data.weeklyGoalKg,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function logActivity(input: CarbonActivityInput): Promise<string> {
  const uid = requireUserId();
  const docRef = await addDoc(collection(db, "activities"), {
    uid,
    category: input.category,
    description: input.description.trim(),
    co2Kg: input.co2Kg,
    recordedAt: Timestamp.fromDate(input.recordedAt),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function listRecentActivities(limit = 20): Promise<CarbonActivity[]> {
  const uid = requireUserId();
  const activitiesQuery = query(
    collection(db, "activities"),
    where("uid", "==", uid),
    orderBy("recordedAt", "desc"),
  );
  const snapshot = await getDocs(activitiesQuery);
  return snapshot.docs.slice(0, limit).map((docSnap) => mapActivity(docSnap.data()));
}

export async function listActivitiesByCategory(
  category: ActivityCategory,
  limit = 20,
): Promise<CarbonActivity[]> {
  const uid = requireUserId();
  const activitiesQuery = query(
    collection(db, "activities"),
    where("uid", "==", uid),
    where("category", "==", category),
    orderBy("recordedAt", "desc"),
  );
  const snapshot = await getDocs(activitiesQuery);
  return snapshot.docs.slice(0, limit).map((docSnap) => mapActivity(docSnap.data()));
}

export function summarizeWeek(activities: CarbonActivity[]): WeeklySummary {
  const byCategory = ACTIVITY_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {} as Record<ActivityCategory, number>,
  );

  let totalCo2Kg = 0;
  for (const activity of activities) {
    totalCo2Kg += activity.co2Kg;
    byCategory[activity.category] += activity.co2Kg;
  }

  return {
    totalCo2Kg,
    activityCount: activities.length,
    byCategory,
  };
}
