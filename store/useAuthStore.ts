import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  profileCompletion: number;
  user: any | null;
  setTokens: (access: string, refresh: string) => void;
  clearAuth: () => void;
  setProfileCompletion: (percentage: number) => void;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      profileCompletion: 0,
      user: null,
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null, profileCompletion: 0 }),
      setProfileCompletion: (percentage) => set({ profileCompletion: percentage }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
