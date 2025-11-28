import {makeAutoObservable} from 'mobx';
import {hydrateStore, makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Habit, IStore, PVoid} from './types';

export class HabitStore implements IStore {
  habits: Habit[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'HabitStore',
      properties: ['habits'],
      storage: AsyncStorage,
    });
  }

  addHabit = (title: string, description: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      description,
      color,
      completedDates: [],
      createdAt: Date.now(),
    };
    this.habits.push(newHabit);
  };

  deleteHabit = (id: string) => {
    this.habits = this.habits.filter(h => h.id !== id);
  };

  toggleCompletion = (id: string, date: string) => {
    const habit = this.habits.find(h => h.id === id);
    if (habit) {
      if (habit.completedDates.includes(date)) {
        habit.completedDates = habit.completedDates.filter(d => d !== date);
      } else {
        habit.completedDates.push(date);
      }
    }
  };

  hydrate = async (): PVoid => {
    await hydrateStore(this);
  };
}
