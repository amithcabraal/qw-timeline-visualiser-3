import { create } from 'zustand';
import { Event } from '../types/Event';

const STORAGE_KEY = 'timeline-events';

interface EventStore {
  events: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  importEvents: (events: Event[]) => void;
  clearEvents: () => void;
}

// Load initial state from localStorage
const loadInitialState = (): Event[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    }));
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return [];
  }
};

export const useEventStore = create<EventStore>((set) => ({
  events: loadInitialState(),
  addEvent: (event) =>
    set((state) => {
      const newEvents = [...state.events, event];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      return { events: newEvents };
    }),
  removeEvent: (id) =>
    set((state) => {
      const newEvents = state.events.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      return { events: newEvents };
    }),
  updateEvent: (id, updatedEvent) =>
    set((state) => {
      const newEvents = state.events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
      return { events: newEvents };
    }),
  importEvents: (events) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    set({ events });
  },
  clearEvents: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ events: [] });
  },
}));