import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, Company, LoginResponse, fetchMe, updateTheme, login as loginRequest } from '../services/auth-service';
import { saveAuth, clearAuth } from '../storage/auth-storage';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateTheme: (mode: 'light' | 'dark') => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      company: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const data = await fetchMe(token);
          set({
            user: data.user,
            company: data.company,
            isAuthenticated: true,
            isLoading: false,
          });
          // Sync theme to global store
          const { setThemeMode } = await import('./theme-store');
          setThemeMode(data.user.theme_mode);
        } catch (err) {
          set({ token: null, user: null, company: null, isAuthenticated: false, isLoading: false, error: 'Session expired' });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const data: LoginResponse = await loginRequest(email, password);
          set({
            token: data.token,
            user: data.user,
            company: data.company,
            isAuthenticated: true,
            isLoading: false,
          });
          // Sync theme to global store
          const { setThemeMode } = await import('./theme-store');
          setThemeMode(data.user.theme_mode);
          await saveAuth({ user: data.user, company: data.company, token: data.token });
        } catch {
          set({ isLoading: false, error: 'Login failed' });
        }
      },

      logout: () => {
        set({ token: null, user: null, company: null, isAuthenticated: false, error: null });
        void clearAuth();
      },

      updateTheme: async (mode: 'light' | 'dark') => {
        const token = get().token;
        if (!token) return;
        try {
          const { user } = await updateTheme(token, mode);
          set({ user });
          // Sync theme to global store
          const { setThemeMode } = await import('./theme-store');
          setThemeMode(mode);
        } catch {
          // Optionally show error
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, user: state.user, company: state.company }),
    }
  )
);
