import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from './colors';
import { useAuth } from '@/contexts/AuthContext';

export function useTheme() {
  const systemScheme = useColorScheme();
  let appearanceMode: 'light' | 'dark' | 'system' = 'system';
  try {
    const auth = useAuth();
    appearanceMode = auth.appearanceMode || 'system';
  } catch {
    /* outside provider */
  }

  const isDark =
    appearanceMode === 'dark' ||
    (appearanceMode === 'system' && systemScheme === 'dark');
  return { colors: isDark ? DarkColors : LightColors, isDark };
}
