import type {
  AppLanguage,
  CompletedTodayRecord,
  DayStats,
  Difficulty,
  HistoryEntry,
  Task,
  WeeklyTasks,
} from "@/types";

export const STORAGE_VERSION = 1;
export const STORAGE_PREFIX = "single-player";

export const STORAGE_KEYS = {
  tasks: "tasks",
  streak: "streak",
  weeklyTasks: "weeklyTasks",
  dayStats: "dayStats",
  currentDay: "currentDay",
  lastStreakDate: "lastStreakDate",
  completedToday: "completedToday",
  history: "historico_tarefas",
  playerName: "playerName",
  language: "language",
  theme: "theme",
  schemaVersion: `${STORAGE_PREFIX}:schemaVersion`,
} as const;

const isValidDifficulty = (value: unknown): value is Difficulty =>
  value === "easy" || value === "medium" || value === "hard";

const normalizeTask = (value: unknown): Task | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const text = typeof candidate.text === "string" ? candidate.text : "";
  const difficulty = isValidDifficulty(candidate.difficulty)
    ? candidate.difficulty
    : "easy";

  return {
    id: typeof candidate.id === "string" ? candidate.id : String(Date.now()),
    text,
    completed: Boolean(candidate.completed),
    difficulty,
  };
};

const normalizeTasks = (value: unknown): Task[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => normalizeTask(item))
    .filter((item): item is Task => Boolean(item));
};

const normalizeWeeklyTasks = (value: unknown): WeeklyTasks => {
  if (!value || typeof value !== "object") return {};

  const entries = value as Record<string, unknown>;
  const next: WeeklyTasks = {};

  Object.entries(entries).forEach(([day, tasks]) => {
    next[day] = normalizeTasks(tasks);
  });

  return next;
};

const normalizeHistory = (value: unknown): HistoryEntry[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(item => item && typeof item === "object")
    .map(item => {
      const entry = item as Record<string, unknown>;
      const date = typeof entry.date === "string" ? entry.date : "";
      const xp = typeof entry.xp === "number" ? entry.xp : 0;
      return date ? { date, xp } : null;
    })
    .filter((entry): entry is HistoryEntry => Boolean(entry));
};

const normalizeDayStats = (value: unknown): DayStats[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(item => item && typeof item === "object")
    .map(item => {
      const entry = item as Record<string, unknown>;
      const date = typeof entry.date === "string" ? entry.date : "";
      const completedCount =
        typeof entry.completedCount === "number" ? entry.completedCount : 0;
      return date ? { date, completedCount } : null;
    })
    .filter((entry): entry is DayStats => Boolean(entry));
};

const normalizeCompletedToday = (value: unknown): CompletedTodayRecord => {
  if (!value || typeof value !== "object") {
    return { date: "", ids: [] };
  }

  const record = value as Record<string, unknown>;
  const date = typeof record.date === "string" ? record.date : "";
  const ids = Array.isArray(record.ids)
    ? record.ids.filter((item): item is string => typeof item === "string")
    : [];

  return { date, ids };
};

const normalizeLanguage = (value: unknown): AppLanguage => {
  return value === "pt" ? "pt" : "en";
};

const safeRead = <T>(
  key: string,
  fallback: T,
  normalizer: (value: unknown) => T
): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return normalizer(parsed);
  } catch {
    return fallback;
  }
};

const safeWrite = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op: keep app behavior unchanged when storage is unavailable
  }
};

const migrateLegacyValues = () => {
  const currentVersion = Number(
    window.localStorage.getItem(STORAGE_KEYS.schemaVersion) ?? "0"
  );

  if (currentVersion >= STORAGE_VERSION) {
    return;
  }

  const existingTasks = safeRead(STORAGE_KEYS.tasks, [], normalizeTasks);
  const existingWeekly = safeRead(
    STORAGE_KEYS.weeklyTasks,
    {},
    normalizeWeeklyTasks
  );
  const existingHistory = safeRead(
    STORAGE_KEYS.history,
    [],
    normalizeHistory
  );
  const existingDayStats = safeRead(
    STORAGE_KEYS.dayStats,
    [],
    normalizeDayStats
  );

  if (existingTasks.length > 0) {
    safeWrite(STORAGE_KEYS.tasks, existingTasks);
  }

  if (Object.keys(existingWeekly).length > 0) {
    safeWrite(STORAGE_KEYS.weeklyTasks, existingWeekly);
  }

  if (existingHistory.length > 0) {
    safeWrite(STORAGE_KEYS.history, existingHistory);
  }

  if (existingDayStats.length > 0) {
    safeWrite(STORAGE_KEYS.dayStats, existingDayStats);
  }

  safeWrite(STORAGE_KEYS.schemaVersion, STORAGE_VERSION);
};

export const appStorage = {
  ensureVersion() {
    if (typeof window === "undefined") return;
    migrateLegacyValues();
  },

  getTasks() {
    return safeRead(STORAGE_KEYS.tasks, [], normalizeTasks);
  },

  setTasks(tasks: Task[]) {
    safeWrite(STORAGE_KEYS.tasks, tasks);
  },

  getWeeklyTasks() {
    return safeRead(STORAGE_KEYS.weeklyTasks, {}, normalizeWeeklyTasks);
  },

  setWeeklyTasks(tasks: WeeklyTasks) {
    safeWrite(STORAGE_KEYS.weeklyTasks, tasks);
  },

  getStreak() {
    const value = Number(window.localStorage.getItem(STORAGE_KEYS.streak) ?? "0");
    return Number.isFinite(value) ? value : 0;
  },

  setStreak(streak: number) {
    safeWrite(STORAGE_KEYS.streak, streak);
  },

  getDayStats() {
    return safeRead(STORAGE_KEYS.dayStats, [], normalizeDayStats);
  },

  setDayStats(dayStats: DayStats[]) {
    safeWrite(STORAGE_KEYS.dayStats, dayStats);
  },

  getHistory() {
    return safeRead(STORAGE_KEYS.history, [], normalizeHistory);
  },

  setHistory(history: HistoryEntry[]) {
    safeWrite(STORAGE_KEYS.history, history);
  },

  getCurrentDay() {
    return window.localStorage.getItem(STORAGE_KEYS.currentDay) ?? "";
  },

  setCurrentDay(date: string) {
    safeWrite(STORAGE_KEYS.currentDay, date);
  },

  getLastStreakDate() {
    return window.localStorage.getItem(STORAGE_KEYS.lastStreakDate) ?? "";
  },

  setLastStreakDate(date: string) {
    safeWrite(STORAGE_KEYS.lastStreakDate, date);
  },

  getCompletedToday() {
    return safeRead(
      STORAGE_KEYS.completedToday,
      { date: "", ids: [] },
      normalizeCompletedToday
    );
  },

  setCompletedToday(record: CompletedTodayRecord) {
    safeWrite(STORAGE_KEYS.completedToday, record);
  },

  getPlayerName() {
    const value = window.localStorage.getItem(STORAGE_KEYS.playerName);
    return value && value.trim() ? value : "Player";
  },

  setPlayerName(name: string) {
    safeWrite(STORAGE_KEYS.playerName, name);
  },

  getLanguage() {
    const value = window.localStorage.getItem(STORAGE_KEYS.language);
    return normalizeLanguage(value);
  },

  setLanguage(language: AppLanguage) {
    safeWrite(STORAGE_KEYS.language, language);
  },

  getTheme() {
    const value = window.localStorage.getItem(STORAGE_KEYS.theme);
    return value === "dark" ? "dark" : "light";
  },

  setTheme(theme: "light" | "dark") {
    safeWrite(STORAGE_KEYS.theme, theme);
  },

  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
    });
    safeWrite(STORAGE_KEYS.schemaVersion, STORAGE_VERSION);
  },
};

export const getStorageVersion = () => {
  return Number(
    window.localStorage.getItem(STORAGE_KEYS.schemaVersion) || STORAGE_VERSION
  );
};
