export type Difficulty = "easy" | "medium" | "hard";
export type AppLanguage = "en" | "pt";
export type ActivityType =
  | "aprender"
  | "praticar"
  | "produzir"
  | "organizar"
  | "cuidar";
export type ActivityLevel =
  | "todos"
  | "iniciante"
  | "basico"
  | "intermediario"
  | "avancado";
export type ActivityDifficulty = "facil" | "medio" | "dificil";

export interface Activity {
  id: string;
  category: string;
  subgoal: string;
  name: string;
  description: string;
  result: string;
  durationMin: number;
  durationIdeal: number;
  durationMax: number;
  level: ActivityLevel;
  difficulty: ActivityDifficulty;
  type: ActivityType;
  xp: number;
  frequency: string;
  tags: string[];
}

export type GoalStatus = "active" | "archived";

export interface Goal {
  id: string;
  category: string;
  name: string;
  level: ActivityLevel;
  createdAt: string;
  updatedAt: string;
  status: GoalStatus;
}

export interface ActivityCompletion {
  id: string;
  activityId: string;
  goalId?: string;
  completedAt: string;
  durationMinutes?: number;
  earnedXp: number;
  source: "suggestion" | "manual";
}

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
