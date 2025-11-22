import { API_BASE_URL } from '../config/api';

export interface AuthUser {
  id: string;
  email: string;
  theme_mode: 'light' | 'dark';
};

export type CompanyBranding = {
  primary_color: string;
  secondary_color: string;
  logo_light_url: string;
  logo_dark_url: string;
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  branding?: CompanyBranding;
};

export type LoginResponse = {
  user: AuthUser;
  company: Company;
  token: string;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    // TODO: inspect status and map to better error messages
    throw new Error('Login failed');
  }

  return res.json();
};

export type MeResponse = {
  user: AuthUser;
  company: Company;
};

export const fetchMe = async (token: string): Promise<MeResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to restore session');
  }

  return res.json();
};

export const updateTheme = async (token: string, themeMode: 'light' | 'dark'): Promise<{ user: AuthUser }> => {
  const res = await fetch(`${API_BASE_URL}/api/theme`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ theme_mode: themeMode }),
  });

  if (!res.ok) {
    throw new Error('Failed to update theme');
  }

  return res.json();
};
