import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Habit, HabitFrequency} from '@/stores/types';

interface HabitContextType {
  habits: Habit[];
  addHabit: (
    title: string,
    description: string,
    frequency: HabitFrequency,
    color: string,
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string) => void;
  loading: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const STORAGE_KEY = '@habits_storage';

export const HabitProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load habits from AsyncStorage
  const loadHabits = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedHabits: Habit[] = JSON.parse(stored);
        // Check and reset habits based on their frequency
        const resetHabits = checkHabitResets(parsedHabits);
        setHabits(resetHabits);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save habits to AsyncStorage
  const saveHabits = useCallback(async (habitsToSave: Habit[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habitsToSave));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  }, []);

  // Check and reset habits based on frequency
  const checkHabitResets = (habitsToCheck: Habit[]): Habit[] => {
    const now = new Date();

    return habitsToCheck.map(habit => {
      if (!habit.lastCompleted) return habit;

      const lastCompletedDate = new Date(habit.lastCompleted);
      let shouldReset = false;
      let shouldResetStreak = false;

      switch (habit.frequency) {
        case 'minutely':
          // Reset if 60 seconds have passed since last completion
          const minutesDiff =
            (now.getTime() - lastCompletedDate.getTime()) / (1000 * 60);
          shouldReset = minutesDiff >= 1;

          // Reset streak if missed the window (e.g., > 2 minutes passed)
          shouldResetStreak = minutesDiff >= 2;
          break;

        case 'hourly':
          // Reset if 60 minutes have passed since last completion
          const hoursDiff =
            (now.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60);
          shouldReset = hoursDiff >= 1;

          // Reset streak if missed the window (e.g., > 2 hours passed)
          shouldResetStreak = hoursDiff >= 2;
          break;

        case 'daily':
          // Reset if not completed today
          const isToday =
            lastCompletedDate.getDate() === now.getDate() &&
            lastCompletedDate.getMonth() === now.getMonth() &&
            lastCompletedDate.getFullYear() === now.getFullYear();
          shouldReset = !isToday;

          // Reset streak if missed yesterday (grace period of 1 day)
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday =
            lastCompletedDate.getDate() === yesterday.getDate() &&
            lastCompletedDate.getMonth() === yesterday.getMonth() &&
            lastCompletedDate.getFullYear() === yesterday.getFullYear();
          shouldResetStreak = !isToday && !wasYesterday;
          break;

        case 'weekly':
          // Reset if not in current week
          const getWeekStart = (date: Date) => {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
            return new Date(d.setDate(diff));
          };

          const currentWeekStart = getWeekStart(now);
          const lastCompletedWeekStart = getWeekStart(lastCompletedDate);
          shouldReset =
            currentWeekStart.getTime() !== lastCompletedWeekStart.getTime();

          // Reset streak if missed last week
          const lastWeekStart = new Date(currentWeekStart);
          lastWeekStart.setDate(lastWeekStart.getDate() - 7);
          shouldResetStreak =
            shouldReset &&
            lastCompletedWeekStart.getTime() !== lastWeekStart.getTime();
          break;
      }

      if (shouldReset || shouldResetStreak) {
        return {
          ...habit,
          completed: false,
          streak: shouldResetStreak ? 0 : habit.streak,
        };
      }

      return habit;
    });
  };

  // Add a new habit
  const addHabit = useCallback(
    (
      title: string,
      description: string,
      frequency: HabitFrequency,
      color: string,
    ) => {
      const newHabit: Habit = {
        id: Date.now().toString(),
        title,
        description,
        color,
        frequency,
        streak: 0,
        completed: false,
        lastCompleted: null,
        completedDates: [],
        createdAt: Date.now(),
      };

      setHabits(prev => {
        const updated = [...prev, newHabit];
        saveHabits(updated);
        return updated;
      });
    },
    [saveHabits],
  );

  // Update an existing habit
  const updateHabit = useCallback(
    (id: string, updates: Partial<Habit>) => {
      setHabits(prev => {
        const updated = prev.map(habit =>
          habit.id === id ? {...habit, ...updates} : habit,
        );
        saveHabits(updated);
        return updated;
      });
    },
    [saveHabits],
  );

  // Delete a habit
  const deleteHabit = useCallback(
    (id: string) => {
      setHabits(prev => {
        const updated = prev.filter(habit => habit.id !== id);
        saveHabits(updated);
        return updated;
      });
    },
    [saveHabits],
  );

  // Toggle habit completion
  const toggleHabitCompletion = useCallback(
    (id: string) => {
      setHabits(prev => {
        const updated = prev.map(habit => {
          if (habit.id !== id) return habit;

          const now = new Date();
          const isCompleting = !habit.completed;

          if (isCompleting) {
            // Mark as complete and increment streak
            const today = now.toISOString().split('T')[0];
            return {
              ...habit,
              completed: true,
              lastCompleted: now.toISOString(),
              streak: habit.streak + 1,
              completedDates: [...habit.completedDates, today],
            };
          } else {
            // Mark as incomplete (undo completion)
            const today = now.toISOString().split('T')[0];
            return {
              ...habit,
              completed: false,
              streak: Math.max(0, habit.streak - 1),
              completedDates: habit.completedDates.filter(d => d !== today),
            };
          }
        });

        saveHabits(updated);
        return updated;
      });
    },
    [saveHabits],
  );

  // Load habits on mount
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Check for resets when app comes to foreground or periodically
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setHabits(currentHabits => {
          const resetHabits = checkHabitResets(currentHabits);
          // Only update if changes occurred
          if (JSON.stringify(resetHabits) !== JSON.stringify(currentHabits)) {
            saveHabits(resetHabits);
            return resetHabits;
          }
          return currentHabits;
        });
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Check every second for real-time updates
    const intervalId = setInterval(() => {
      setHabits(currentHabits => {
        const resetHabits = checkHabitResets(currentHabits);
        if (JSON.stringify(resetHabits) !== JSON.stringify(currentHabits)) {
          saveHabits(resetHabits);
          return resetHabits;
        }
        return currentHabits;
      });
    }, 1000); // Check every second

    return () => {
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [saveHabits]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        loading,
      }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
