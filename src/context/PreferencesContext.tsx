import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { TRANSLATIONS, Language, TranslationKey } from '../constants/translations';

type PreferencesContextValue = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  sensitivity: 'Low' | 'Medium' | 'High';
  setSensitivity: (sens: 'Low' | 'Medium' | 'High') => void;
  t: (key: TranslationKey) => string;
  theme: typeof LIGHT_COLORS;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguageState] = useState<Language>('English');
  const [sensitivity, setSensitivityState] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const setSensitivity = useCallback((sens: 'Low' | 'Medium' | 'High') => {
    setSensitivityState(sens);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const langTranslations = TRANSLATIONS[language] || TRANSLATIONS.English;
    return langTranslations[key] || TRANSLATIONS.English[key] || String(key);
  }, [language]);

  const theme = useMemo(() => {
    return darkMode ? DARK_COLORS : LIGHT_COLORS;
  }, [darkMode]);

  const value = useMemo(() => ({
    darkMode,
    toggleDarkMode,
    language,
    setLanguage,
    sensitivity,
    setSensitivity,
    t,
    theme,
  }), [darkMode, toggleDarkMode, language, setLanguage, sensitivity, setSensitivity, t, theme]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
