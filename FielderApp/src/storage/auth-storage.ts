import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser, Company } from '../services/auth-service';

const AUTH_STORAGE_KEY = 'auth';

export type StoredAuth = {
  token: string;
  user: AuthUser;
  company: Company;
};

export const saveAuth = async (auth: StoredAuth): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // Ignore storage errors in prototype
  }
};

export const loadAuth = async (): Promise<StoredAuth | null> => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
};

export const clearAuth = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // Ignore storage errors in prototype
  }
};
