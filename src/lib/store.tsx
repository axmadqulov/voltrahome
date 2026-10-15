import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  INITIAL_BILLS,
  INITIAL_HISTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENTS,
  type AppNotification,
  type Bill,
  type BillId,
  type HistoryItem,
  type Payment,
} from "./data";

export type DeviceKey = "electricity" | "gas" | "water";

export interface User {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface Prefs {
  dark: boolean;
  language: "en" | "uz" | "ru";
  emailNotif: boolean;
  systemNotif: boolean;
  paymentNotif: boolean;
  twoFactor: boolean;
}

interface AppState {
  devices: Record<DeviceKey, boolean>;
  history: HistoryItem[];
  payments: Payment[];
  bills: Bill[];
  notifications: AppNotification[];
  prefs: Prefs;
}

const USERS_KEY = "sh_users";
const SESSION_KEY = "sh_session";
const STATE_KEY = "sh_state_v1";

const DEMO_USER: User = { username: "demo", email: "demo@smarthome.app", password: "demo123" };

const DEFAULT_STATE: AppState = {
  devices: { electricity: true, gas: true, water: false },
  history: INITIAL_HISTORY,
  payments: INITIAL_PAYMENTS,
  bills: INITIAL_BILLS,
  notifications: INITIAL_NOTIFICATIONS,
  prefs: { dark: false, language: "en", emailNotif: true, systemNotif: true, paymentNotif: true, twoFactor: false },
};

const isBrowser = () => typeof window !== "undefined";
const uid = () => Math.random().toString(36).slice(2, 10);

export function getSession(): string | null {
  return isBrowser() ? localStorage.getItem(SESSION_KEY) : null;
}

function loadUsers(): User[] {
  if (!isBrowser()) return [DEMO_USER];
  try {
    const list = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
    return list.some((u) => u.username === DEMO_USER.username) ? list : [DEMO_USER, ...list];
  } catch {
    return [DEMO_USER];
  }
}
const saveUsers = (u: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

function loadState(): AppState {
  if (!isBrowser()) return DEFAULT_STATE;
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
    return s ? { ...DEFAULT_STATE, ...s, prefs: { ...DEFAULT_STATE.prefs, ...s.prefs } } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

interface Store extends AppState {
  user: User | null;
  unread: number;
  register: (u: User) => string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => string | null;
  setDevice: (d: DeviceKey, on: boolean) => void;
  recordPayment: (billId: BillId, amount: number, txId: string, date: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  notify: (n: Omit<AppNotification, "id" | "read" | "date">) => void;
  setPrefs: (p: Partial<Prefs>) => void;
}

const Ctx = createContext<Store | null>(null);

const LABEL: Record<DeviceKey, string> = { electricity: "Electricity", gas: "Gas", water: "Water" };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [user, setUser] = useState<User | null>(null);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    setState(loadState());
    const s = getSession();
    if (s) setUser(loadUsers().find((u) => u.username === s) ?? null);
  }, []);

  useEffect(() => {
    if (!isBrowser()) return;
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    document.documentElement.classList.toggle("dark", state.prefs.dark);
  }, [state]);

  const register = useCallback((u: User) => {
    const users = loadUsers();
    if (users.some((x) => x.username.toLowerCase() === u.username.toLowerCase()))
      return "Username already exists.";
    saveUsers([...users, u]);
    return null;
  }, []);

  const login = useCallback((username: string, password: string) => {
    const found = loadUsers().find((u) => u.username === username.trim() && u.password === password);
    if (!found) return false;
    localStorage.setItem(SESSION_KEY, found.username);
    setUser(found);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!user) return "Not signed in.";
      const users = loadUsers();
      if (
        patch.username &&
        patch.username !== user.username &&
        users.some((u) => u.username.toLowerCase() === patch.username!.toLowerCase())
      )
        return "Username already exists.";
      const next = { ...user, ...patch };
      saveUsers(users.map((u) => (u.username === user.username ? next : u)));
      localStorage.setItem(SESSION_KEY, next.username);
      setUser(next);
      return null;
    },
    [user],
  );

  const pushNotif = (s: AppState, n: Omit<AppNotification, "id" | "read" | "date">): AppState => ({
    ...s,
    notifications: [{ ...n, id: uid(), read: false, date: new Date().toISOString() }, ...s.notifications],
  });

  const setDevice = useCallback((d: DeviceKey, on: boolean) => {
    setState((s) => {
      const now = new Date().toISOString();
      let next: AppState = {
        ...s,
        devices: { ...s.devices, [d]: on },
        history: [{ id: uid(), text: `${LABEL[d]} turned ${on ? "ON" : "OFF"}`, date: now }, ...s.history].slice(0, 50),
      };
      if (s.prefs.systemNotif)
        next = pushNotif(next, {
          title: `${LABEL[d]} system`,
          message: d === "water" ? `Water system was turned ${on ? "on" : "off"}.` : `${LABEL[d]} was turned ${on ? "on" : "off"} remotely.`,
          type: on ? "success" : "info",
        });
      return next;
    });
  }, []);

  const recordPayment = useCallback((billId: BillId, amount: number, txId: string, date: string) => {
    setState((s) => {
      const bill = s.bills.find((b) => b.id === billId)!;
      let next: AppState = {
        ...s,
        bills: s.bills.map((b) => {
          if (b.id !== billId) return b;
          const debt = Math.max(0, +(b.debt - amount).toFixed(2));
          return { ...b, debt, status: debt === 0 ? "Paid" : b.status };
        }),
        payments: [{ id: txId, billId, utility: bill.name, amount, date }, ...s.payments],
      };
      if (s.prefs.paymentNotif)
        next = pushNotif(next, { title: "Payment successful", message: `${bill.name} payment of $${amount.toFixed(2)} was completed.`, type: "success" });
      return next;
    });
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      user,
      unread: state.notifications.filter((n) => !n.read).length,
      register,
      login,
      logout,
      updateProfile,
      setDevice,
      recordPayment,
      markRead: (id) => setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      removeNotification: (id) => setState((s) => ({ ...s, notifications: s.notifications.filter((n) => n.id !== id) })),
      notify: (n) => setState((s) => pushNotif(s, n)),
      setPrefs: (p) => setState((s) => ({ ...s, prefs: { ...s.prefs, ...p } })),
    }),
    [state, user, register, login, logout, updateProfile, setDevice, recordPayment],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}
