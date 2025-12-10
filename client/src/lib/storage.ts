import { useState, useEffect, useCallback } from 'react';

// --- LocalStorage Helper Hooks ---

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => setStoredValue(readValue());
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue] as const;
}

// --- Types based on requested keys ---

export interface UserProfile {
  name: string;
  about: string;
  avatarDataUrl: string; // Base64 string
  goal?: string;
  weight?: number;
  height?: number;
}

export interface ChallengeProgress {
  startDate: string;
  completedDays: number[]; // Array of day indices (1-based)
  streak: number;
}

export interface DailyStats {
  steps: number;
  calories: number;
  water: number; // Liters
  weight: number;
  workoutsLogged: number[]; // Workout IDs
}

export interface Booking {
  id: string;
  trainerId: number;
  trainerName: string;
  date: string;
  time: string;
  notes: string;
}

// --- Default Values ---

export const defaultProfile: UserProfile = {
  name: "Guest User",
  about: "I'm on a journey to get fit!",
  avatarDataUrl: "",
  goal: "Get Stronger",
  weight: 70,
  height: 175
};

// --- Keys Mapping ---
// fw_user_profile
// fw_favorites_workouts
// fw_favorites_meals
// fw_challenge_progress
// fw_tracker_data
// fw_friends
// fw_bookings
