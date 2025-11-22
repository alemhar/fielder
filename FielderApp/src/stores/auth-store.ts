import { create } from 'zustand';
import { AuthUser, Company, login as loginRequest } from '../services/auth-service';
import { saveAuth, clearAuth } from '../storage/auth-storage';

type AuthState = {
  user: AuthUser | null;
  company: Company | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSession: (payload: { user: AuthUser; company: Company; token: string }) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  company: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const { user, company, token } = await loginRequest(email, password);
      set({ user, company, token, isLoading: false, error: null });
      await saveAuth({ user, company, token });
      // TODO: persist token/user to secure storage if you want session restore
    } catch (err) {
      set({
        isLoading: false,
        error: 'Invalid email or password',
      });
    }
  },

  logout: () => {
    set({ user: null, company: null, token: null });
    void clearAuth();
  },

  setSession: ({ user, company, token }) => {
    set({ user, company, token });
  },
}));
