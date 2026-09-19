import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type StoredAccount = User & { password: string };

const USER_SESSION_KEY = '@sonic_sentinel_user_session';
const ACCOUNTS_KEY = '@sonic_sentinel_accounts';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<Map<string, StoredAccount>>(new Map());

  // Load user session and registered accounts on startup
  useEffect(() => {
    async function loadData() {
      try {
        const sessionStr = await AsyncStorage.getItem(USER_SESSION_KEY);
        if (sessionStr) {
          setUser(JSON.parse(sessionStr));
        }

        const accountsStr = await AsyncStorage.getItem(ACCOUNTS_KEY);
        if (accountsStr) {
          const parsedAccounts = JSON.parse(accountsStr) as [string, StoredAccount][];
          setAccounts(new Map(parsedAccounts));
        }
      } catch (e) {
        console.error('Failed to load auth data from storage:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accounts.get(normalizedEmail);

    if (!account) {
      return { ok: false as const, message: 'No account found. Please sign up first.' };
    }
    if (account.password !== password) {
      return { ok: false as const, message: 'Incorrect password.' };
    }

    const loggedInUser = { name: account.name, email: account.email };
    setUser(loggedInUser);
    try {
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(loggedInUser));
    } catch (e) {
      console.error('Failed to save session:', e);
    }
    return { ok: true as const };
  }, [accounts]);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (accounts.has(normalizedEmail)) {
        return { ok: false as const, message: 'An account with this email already exists.' };
      }

      const account: StoredAccount = {
        name: name.trim(),
        email: normalizedEmail,
        password,
      };
      
      const newAccounts = new Map(accounts);
      newAccounts.set(normalizedEmail, account);
      setAccounts(newAccounts);

      const signedUpUser = { name: account.name, email: account.email };
      setUser(signedUpUser);
      
      try {
        await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(Array.from(newAccounts.entries())));
        await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(signedUpUser));
      } catch (e) {
        console.error('Failed to save signup data:', e);
      }

      return { ok: true as const };
    },
    [accounts],
  );

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(USER_SESSION_KEY);
    } catch (e) {
      console.error('Failed to remove session:', e);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: user !== null,
      login,
      signup,
      logout,
      isLoading,
    }),
    [user, login, signup, logout, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
