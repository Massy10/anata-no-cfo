import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform, NativeModules } from 'react-native';
import ja from './ja';
import en from './en';

function getDeviceLocale(): string {
  let locale = 'ja';
  try {
    if (Platform.OS === 'ios') {
      locale =
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        'ja';
    } else {
      locale = NativeModules.I18nManager?.localeIdentifier || 'ja';
    }
  } catch {
    locale = 'ja';
  }
  // Normalize: "ja_JP" -> "ja", "en_US" -> "en"
  return locale.split(/[-_]/)[0];
}

i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng: getDeviceLocale(),
  fallbackLng: 'ja',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
