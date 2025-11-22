import { API_BASE_URL } from '../config/api';
import { useAuthStore } from '../stores/auth-store';
import { useThemeStore } from '../stores/theme-store';

export const DEFAULT_PRIMARY_COLOR = '#25a1c9';
export const DEFAULT_SECONDARY_COLOR = '#222253';

const DEFAULT_LOGO_LIGHT_URL = `${API_BASE_URL}/branding/logo_for_light.png`;
const DEFAULT_LOGO_DARK_URL = `${API_BASE_URL}/branding/logo_for_dark.png`;

export const useBranding = () => {
  const companyBranding = useAuthStore((state) => state.company?.branding);
  const themeMode = useThemeStore((state) => state.mode);

  const primaryColor = companyBranding?.primary_color ?? DEFAULT_PRIMARY_COLOR;
  const secondaryColor = companyBranding?.secondary_color ?? DEFAULT_SECONDARY_COLOR;

  const logoLightUrl = companyBranding?.logo_light_url ?? DEFAULT_LOGO_LIGHT_URL;
  const logoDarkUrl = companyBranding?.logo_dark_url ?? DEFAULT_LOGO_DARK_URL;

  const isDarkMode = themeMode === 'dark';
  const currentLogoUrl = isDarkMode ? logoDarkUrl : logoLightUrl;

  const backgroundColor = isDarkMode ? '#050816' : '#f8fafc';
  const surfaceColor = isDarkMode ? 'rgba(0,0,0,0.3)' : '#ffffff';
  const cardBackgroundColor = isDarkMode ? 'rgba(0,0,0,0.3)' : '#ffffff';
  const primaryTextColor = isDarkMode ? '#ffffff' : '#111827';
  const secondaryTextColor = isDarkMode ? '#d1d5db' : '#4b5563';
  const mutedTextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const borderBaseColor = isDarkMode ? 'rgba(255,255,255,0.2)' : '#d1d5db';
  const inputBackgroundColor = isDarkMode ? '#111827' : '#ffffff';

  return {
    primaryColor,
    secondaryColor,
    logoLightUrl,
    logoDarkUrl,
    currentLogoUrl,
    isDarkMode,
    backgroundColor,
    surfaceColor,
    cardBackgroundColor,
    primaryTextColor,
    secondaryTextColor,
    mutedTextColor,
    borderBaseColor,
    inputBackgroundColor,
  };
};
