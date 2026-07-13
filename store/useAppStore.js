import { create } from 'zustand'

export const useAppStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  language: 'en',
  setLanguage: (language) => set({ language }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
