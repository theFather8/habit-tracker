// Type definitions for the Habit Tracker app

export type HabitFrequency = 'minutely' | 'hourly' | 'daily' | 'weekly';

export interface Habit {
  id: string;
  title: string;
  description: string;
  color: string;
  frequency: HabitFrequency;
  streak: number;
  completed: boolean;
  lastCompleted: string | null;
  completedDates: string[];
  createdAt: number;
}
