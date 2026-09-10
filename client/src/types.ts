export type Difficulty = "easy" | "medium" | "hard";
export type AppLanguage = "en" | "pt";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  difficulty?: Difficulty;
}

export interface DayStats {
  date: string;
  completedCount: number;
}

export interface WeeklyTasks {
  [key: string]: Task[];
}

export interface HistoryEntry {
  date: string;
  xp: number;
}

export interface CompletedTodayRecord {
  date: string;
  ids: string[];
}

export interface AppStorageMeta {
  version: number;
  updatedAt: string;
}
