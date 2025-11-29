export type UIAppearance = 'System' | 'Light' | 'Dark';
export type AppearanceMode = 'light' | 'dark';

export type AppearanceAction = {
  name: UIAppearance;
};

export type Language = 'en' | 'dh';
export type UILanguage = 'English' | 'Dhivehi';

export type PVoid = Promise<void>;
export interface IService {
  init?: () => PVoid;
}

export interface IStore {
  hydrate?: () => PVoid;
}

export type HabitFrequency = 'minutely' | 'hourly' | 'daily' | 'weekly';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  color: string;
  frequency: HabitFrequency;
  streak: number;
  completed: boolean;
  lastCompleted: string | null; // ISO timestamp
  completedDates: string[]; // YYYY-MM-DD - keeping for historical tracking
  createdAt: number;
}
