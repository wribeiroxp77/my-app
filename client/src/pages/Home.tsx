import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  Download,
  Trash2,
  Plus,
  X,
  BarChart3,
  User,
} from "lucide-react";
import {
  AnimatedPage,
  AnimatedProgressBar,
  AnimatedNumber,
  AnimatedTaskCard,
  AnimatedButton,
} from "@/components/animations";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useXPHistoryLast7Days,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const DAY_NAMES = {
  en: {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  },
  pt: {
    monday: "Segunda",
    tuesday: "Terça",
    wednesday: "Quarta",
    thursday: "Quinta",
    friday: "Sexta",
    saturday: "Sábado",
    sunday: "Domingo",
  },
};

type Difficulty = "easy" | "medium" | "hard";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  difficulty?: Difficulty;
}

const DIFFICULTY_XP: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 15,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: `Easy · ${DIFFICULTY_XP.easy} XP`,
  medium: `Medium · ${DIFFICULTY_XP.medium} XP`,
  hard: `Hard · ${DIFFICULTY_XP.hard} XP`,
};

const getTaskDifficulty = (task: Task): Difficulty => task.difficulty || "easy";

const getDifficultyBadgeClasses = (task: Task) => {
  const base =
    "px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
  const difficulty = getTaskDifficulty(task);
  switch (difficulty) {
    case "easy":
      return `${base} bg-emerald-500/10 text-emerald-300 border-emerald-500/40`;
    case "medium":
      return `${base} bg-yellow-500/10 text-yellow-300 border-yellow-500/40`;
    case "hard":
      return `${base} bg-rose-500/10 text-rose-300 border-rose-500/40`;
    default:
      return base;
  }
};

interface DayStats {
  date: string;
  completedCount: number;
}

interface WeeklyTasks {
  [key: string]: Task[];
}

const ASTRONAUT_LOGO =
  "https://private-us-east-1.manuscdn.com/sessionFile/JKfrijgSHJWtYAWAoWAo99/sandbox/ZYgwdep9JZxuer1ajCjPml-img-1_1770684317000_na1fn_YXN0cm9uYXV0LWxvZ28tZmluYWw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSktmcmlqZ1NISld0WUFXQW9XQW85OS9zYW5kYm94L1pZZ3dkZXA5Slp4dWVyMWFqQ2pQbWwtaW1nLTFfMTc3MDY4NDMxNzAwMF9uYTFmbl9ZWE4wY201dVlYVjBMV3h2WjI4dFptbHVZV3cudG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BnfgrJnVXWvgtiXUsue4LWjpuPDxRoaL0mfL4XUAA9FRGDmYeuDPO0cziicbSde1IHK0Syduvk-B1evBBzG6a3n2zwFbrV4TySlMfAwOrKWpMx19M6FBpwhI0Eptv5rkjUOaV3jCsj6GWQHRM1TgJt-Gs6Cexs39df3HxdR2esjYxErEFwTHxzJP6leMCQ~QG1gkOP-Rb3d32abifVJfRcbJxyYAB4bDEd~F-U4PuMwMqcesQSGa8NfCaZ5f6IXD3UiEkQwjxaRan6sgAeafWErimiJCyXvvpD2cwVD82uMFS5ICx8LHV1CV6M1nZW7HsSIvD6~yqTfJpgNYe1VJZQ__";

function StatsTab({
  streak,
  tasks,
  dayStats,
  language,
}: {
  streak: number;
  tasks: Task[];
  dayStats: DayStats[];
  language: "en" | "pt";
}) {
  const xpHistory = useXPHistoryLast7Days();

  // ── Gráfico ───────────────────────────────────────────────────────────────
  const chartData = xpHistory.map(point => {
    const date = new Date(point.date);
    return {
      date: point.date,
      day: `${date.getDate()}/${date.getMonth() + 1}`,
      xp: point.xp,
    };
  });

  const chartConfig = {
    xp: { label: "XP", color: "hsl(var(--chart-1))" },
  } as const;

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const completedTasks = tasks.filter(t => t.completed);
  const totalXP = completedTasks.reduce((sum, t) => {
    if (t.difficulty === "easy") return sum + 5;
    if (t.difficulty === "medium") return sum + 10;
    if (t.difficulty === "hard") return sum + 15;
    return sum;
  }, 0);

  const easyCount = completedTasks.filter(t => t.difficulty === "easy").length;
  const mediumCount = completedTasks.filter(
    t => t.difficulty === "medium"
  ).length;
  const hardCount = completedTasks.filter(t => t.difficulty === "hard").length;
  const totalDone = completedTasks.length || 1;

  // ── Nível ─────────────────────────────────────────────────────────────────
  let level = 1;
  let xpLeft = totalXP;
  while (xpLeft >= 50 * level) {
    xpLeft -= 50 * level;
    level++;
  }

  // ── Badges ────────────────────────────────────────────────────────────────
  const badges = [
    {
      icon: "⭐",
      label: "100 Tasks",
      current: completedTasks.length,
      goal: 100,
    },
    { icon: "💎", label: "500 XP", current: totalXP, goal: 500 },
    { icon: "💪", label: "50 hard", current: hardCount, goal: 50 },
    { icon: "🏆", label: "Level 5", current: level, goal: 5 },
  ];

  return (
    <div className="w-full max-w-md pb-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 text-center"
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">
          🛸 Stats Log
        </h1>
        <p className="text-purple-300/70 text-sm mt-1">
          Your journey through the stars
        </p>
      </motion.div>

      {/* ── Grid de resumo 2x2 ── */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          {
            label: "Tasks Done",
            value: completedTasks.length,
            icon: "✅",
            color: "from-cyan-500/20 to-cyan-500/5",
            border: "border-cyan-500/40",
            text: "text-cyan-400",
            delay: 0.05,
          },
          {
            label: "Total XP",
            value: totalXP,
            icon: "💎",
            color: "from-purple-500/20 to-purple-500/5",
            border: "border-purple-500/40",
            text: "text-purple-400",
            delay: 0.1,
          },
          {
            label: "Streak",
            value: `${streak}d`,
            icon: "🔥",
            color: "from-blue-500/20 to-blue-500/5",
            border: "border-blue-500/40",
            text: "text-blue-400",
            delay: 0.15,
          },
          {
            label: "Hard Tasks",
            value: hardCount,
            icon: "💪",
            color: "from-amber-500/20 to-amber-500/5",
            border: "border-amber-500/40",
            text: "text-amber-400",
            delay: 0.2,
          },
        ].map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: card.delay }}
            className={`rounded-2xl border ${card.border} bg-linear-to-br ${card.color} backdrop-blur-xl p-4 flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(168,85,247,0.08)]`}
          >
            <span className="text-2xl">{card.icon}</span>
            <span className={`text-2xl font-bold ${card.text}`}>
              {card.value}
            </span>
            <span className="text-white/50 text-xs text-center">
              {card.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── Dificulty Analysis── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-2xl border border-purple-500/40 bg-linear-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-5 mb-4 shadow-[0_0_40px_rgba(168,85,247,0.08)]"
      >
        <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase opacity-80">
          ⚔️ Difficulty Breakdown
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Easy",
              count: easyCount,
              color: "#06b6d4",
              bg: "bg-cyan-500",
              pct: Math.round((easyCount / totalDone) * 100),
            },
            {
              label: "Medium",
              count: mediumCount,
              color: "#8b5cf6",
              bg: "bg-purple-500",
              pct: Math.round((mediumCount / totalDone) * 100),
            },
            {
              label: "Hard",
              count: hardCount,
              color: "#f59e0b",
              bg: "bg-amber-500",
              pct: Math.round((hardCount / totalDone) * 100),
            },
          ].map((row, i) => (
            <div key={row.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-white/70 text-xs font-medium">
                  {row.label}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: row.color }}
                >
                  {row.count} task{row.count !== 1 ? "s" : ""} · {row.pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.1,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${row.bg}`}
                  style={{ boxShadow: `0 0 8px ${row.color}80` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Last 7 Days ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl border border-purple-500/40 bg-gradient-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-5 mb-4 shadow-[0_0_40px_rgba(168,85,247,0.08)]"
      >
        <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase opacity-80">
          📈 XP — Last 7 Days
        </h3>
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
            barCategoryGap="28%"
          >
            <defs>
              <linearGradient id="barGradPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="barGradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity={1} />
                <stop offset="100%" stopColor="#0891b2" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="barGradAmber" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde68a" stopOpacity={1} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148,163,184,0.12)"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(196,181,253,0.7)", fontSize: 11 }}
            />
            <YAxis
              domain={[0, "auto"]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "rgba(196,181,253,0.7)", fontSize: 11 }}
              width={32}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(139,92,246,0.1)" }}
              content={
                <ChartTooltipContent
                  formatter={value => [`${value} XP`, "XP"]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as any;
                    return p?.day || "";
                  }}
                />
              }
            />
            <Bar
              dataKey="xp"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
              animationDuration={500}
              animationEasing="ease-out"
            >
              {chartData.map(entry => {
                const xp = entry.xp || 0;
                let fill = "url(#barGradPurple)";
                if (xp >= 15 && xp <= 40) fill = "url(#barGradCyan)";
                else if (xp > 40) fill = "url(#barGradAmber)";
                return <Cell key={entry.date} fill={fill} stroke="none" />;
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          {[
            { color: "#a78bfa", label: "< 15 XP" },
            { color: "#67e8f9", label: "15–40 XP" },
            { color: "#fde68a", label: "> 40 XP" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ background: l.color }}
              />
              <span className="text-white/40 text-xs">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Progress Badges ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-2xl border border-purple-500/40 bg-linear-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(168,85,247,0.08)]"
      >
        <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase opacity-80">
          🏅 Achievements
        </h3>
        <div className="flex flex-col gap-4">
          {badges.map((badge, i) => {
            const pct = Math.min((badge.current / badge.goal) * 100, 100);
            const unlocked = pct >= 100;
            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.07 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl ${unlocked ? "" : "grayscale opacity-50"}`}
                    >
                      {badge.icon}
                    </span>
                    <span
                      className={`text-sm font-medium ${unlocked ? "text-white" : "text-white/50"}`}
                    >
                      {badge.label}
                    </span>
                    {unlocked && (
                      <span className="text-xs bg-purple-500/30 border border-purple-400/40 text-purple-300 px-1.5 py-0.5 rounded-full">
                        ✓ Desbloqueado
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/40">
                    {Math.min(badge.current, badge.goal)}/{badge.goal}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.45 + i * 0.07,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: unlocked
                        ? "linear-gradient(90deg, #a78bfa, #818cf8)"
                        : "linear-gradient(90deg, #6d28d9, #4c1d95)",
                      boxShadow: unlocked
                        ? "0 0 8px rgba(167,139,250,0.6)"
                        : "none",
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
function ProfileTab({
  streak,
  tasks,
  setTasks,
  dayStats,
  setDayStats,
  weeklyTasks,
  setWeeklyTasks,
  setStreak,
  showSettings,
  setShowSettings,
  showWeeklyEditor,
  setShowWeeklyEditor,
  editingDay,
  setEditingDay,
  playerName,
  setPlayerName,
  editingName,
  setEditingName,
  tempName,
  setTempName,
  language,
  setLanguage,
  resetModal,
  setResetModal,
  exportData,
  editingWeeklyTaskId,
  setEditingWeeklyTaskId,
  editingWeeklyText,
  setEditingWeeklyText,
  startEditingWeeklyTask,
  saveEditWeeklyTask,
  cancelEditWeeklyTask,
  addTaskToDay,
  deleteWeeklyTask,
}: {
  streak: number;
  tasks: Task[];
  setTasks: (t: Task[]) => void;
  dayStats: DayStats[];
  setDayStats: (d: DayStats[]) => void;
  weeklyTasks: WeeklyTasks;
  setWeeklyTasks: (w: WeeklyTasks) => void;
  setStreak: (s: number) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  showWeeklyEditor: boolean;
  setShowWeeklyEditor: (v: boolean) => void;
  editingDay: string | null;
  setEditingDay: (d: string | null) => void;
  playerName: string;
  setPlayerName: (n: string) => void;
  editingName: boolean;
  setEditingName: (v: boolean) => void;
  tempName: string;
  setTempName: (n: string) => void;
  language: "en" | "pt";
  setLanguage: (l: "en" | "pt") => void;
  resetModal: null | "today" | "all";
  setResetModal: (v: null | "today" | "all") => void;
  exportData: () => void;
  editingWeeklyTaskId: string | null;
  setEditingWeeklyTaskId: (id: string | null) => void;
  editingWeeklyText: string;
  setEditingWeeklyText: (t: string) => void;
  startEditingWeeklyTask: (day: string, id: string, text: string) => void;
  saveEditWeeklyTask: (day: string, id: string) => void;
  cancelEditWeeklyTask: () => void;
  addTaskToDay: (day: string) => void;
  deleteWeeklyTask: (day: string, id: string) => void;
}) {
  // ── Traduções ─────────────────────────────────────────────────────────────
  const T = {
    en: {
      profile: "Profile",
      subtitle: "Your command center",
      editTasks: "Edit Tasks",
      settings: "Settings",
      editWeekly: "Edit Weekly Tasks",
      schedule: "Customize your schedule",
      back: "← Back",
      addTask: "Add task",
      settingsTitle: "Settings",
      settingsSubtitle: "App configuration",
      resetToday: "Reset Today",
      resetAll: "Reset Everything",
      export: "Export Data",
      language: "Language",
      resetTodayConfirm: "Reset today's tasks only?",
      resetTodayDesc: "Your streak and history will be preserved.",
      resetAllConfirm: "Reset everything?",
      resetAllDesc: "This will delete ALL your data, tasks and streak.",
      cancel: "Cancel",
      confirm: "Confirm",
      tasks: "Tasks",
      level: "Level",
      tapToEdit: "Tap to edit name",
    },
    pt: {
      profile: "Perfil",
      subtitle: "Seu centro de comando",
      editTasks: "Editar Tasks",
      settings: "Configurações",
      editWeekly: "Editar Tasks Semanais",
      schedule: "Personalize sua agenda",
      back: "← Voltar",
      addTask: "Adicionar task",
      settingsTitle: "Configurações",
      settingsSubtitle: "Configuração do app",
      resetToday: "Resetar Hoje",
      resetAll: "Resetar Tudo",
      export: "Exportar Dados",
      language: "Idioma",
      resetTodayConfirm: "Resetar as tasks de hoje?",
      resetTodayDesc: "Seu streak e histórico serão preservados.",
      resetAllConfirm: "Resetar tudo?",
      resetAllDesc: "Isso vai apagar TODOS os seus dados, tasks e streak.",
      cancel: "Cancelar",
      confirm: "Confirmar",
      tasks: "Tasks",
      level: "Nível",
      tapToEdit: "Toque para editar o nome",
    },
  };
  const t = T[language];

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const completedTasks = tasks.filter(tk => tk.completed);
  const totalXP = completedTasks.reduce((sum, tk) => {
    if (tk.difficulty === "easy") return sum + 5;
    if (tk.difficulty === "medium") return sum + 10;
    if (tk.difficulty === "hard") return sum + 15;
    return sum;
  }, 0);

  let level = 1;
  let xpLeft = totalXP;
  while (xpLeft >= 50 * level) {
    xpLeft -= 50 * level;
    level++;
  }
  const xpNeeded = 50 * level;
  const xpPct = Math.min((xpLeft / xpNeeded) * 100, 100);

  const hardCount = completedTasks.filter(
    tk => tk.difficulty === "hard"
  ).length;

  const getPlayerTitle = () => {
    if (level >= 5) return { icon: "🌌", label: "Legend" };
    if (hardCount >= 20) return { icon: "💀", label: "Unstoppable" };
    if (streak >= 7) return { icon: "🔥", label: "On Fire" };
    if (completedTasks.length >= 20)
      return { icon: "⚡", label: "Rising Star" };
    if (completedTasks.length >= 10) return { icon: "✨", label: "Adventurer" };
    return { icon: "🌱", label: "Rookie" };
  };
  const title = getPlayerTitle();

  // ── Salvar nome ───────────────────────────────────────────────────────────
  const saveName = () => {
    const name = tempName.trim() || "Player";
    setPlayerName(name);
    localStorage.setItem("playerName", name);
    setEditingName(false);
  };

  const handleInstallApp = () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        (window as any).deferredPrompt = null;
      });
    } else {
      alert("To install: tap the browser menu and select 'Add to Home Screen'");
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Single Player",
        text: `I'm leveling up my productivity with Single Player! 🚀 Join me!`,
        url: "https://single-play.netlify.app/",
      });
    } else {
      navigator.clipboard.writeText("https://single-play.netlify.app/");
      alert("Link copied!");
    }
  };

  const handleNotification = async () => {
    if (!("Notification" in window)) {
      alert("Notifications not supported on this device.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("Single Player 🚀", {
        body: "Time to complete your tasks and level up!",
        icon: "/logo.png",
      });
      alert("Notifications enabled! ✅");
    } else {
      alert(
        "Permission denied. Enable notifications in your browser settings."
      );
    }
  };

  // ── Salvar idioma ─────────────────────────────────────────────────────────
  const toggleLanguage = () => {
    const next = language === "en" ? "pt" : "en";
    setLanguage(next);
    localStorage.setItem("language", next);
  };

  // ── Reset handlers ────────────────────────────────────────────────────────
  const handleResetToday = () => {
    setTasks([]);
    const today = new Date().toISOString().split("T")[0];
    const updated = dayStats.filter(d => d.date !== today);
    setDayStats(updated);
    localStorage.setItem("dayStats", JSON.stringify(updated));
    setResetModal(null);
  };

  const handleResetAll = () => {
    localStorage.clear();
    setTasks([]);
    setStreak(0);
    setWeeklyTasks({});
    setDayStats([]);
    setResetModal(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md pb-6 pt-0">
      {/* ── Reset Modal ── */}
      {resetModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm rounded-2xl border border-purple-500/40 bg-gradient-to-br from-black/80 via-purple-900/30 to-black/80 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(168,85,247,0.2)]"
          >
            <div className="text-4xl text-center mb-3">
              {resetModal === "today" ? "⚠️" : "💀"}
            </div>
            <h3 className="text-white font-bold text-center text-lg mb-1">
              {resetModal === "today" ? t.resetTodayConfirm : t.resetAllConfirm}
            </h3>
            <p className="text-white/50 text-sm text-center mb-6">
              {resetModal === "today" ? t.resetTodayDesc : t.resetAllDesc}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setResetModal(null)}
                className="flex-1 py-3 rounded-xl border border-white/20 text-white/60 font-semibold hover:bg-white/5 transition-all"
              >
                {t.cancel}
              </button>
              <button
                onClick={
                  resetModal === "today" ? handleResetToday : handleResetAll
                }
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  resetModal === "today"
                    ? "bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                    : "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {t.confirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN PROFILE VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {!showSettings && !showWeeklyEditor && (
        <>
          {/* Player Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-purple-500/40 bg-linear-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-xl p-6 mb-4 shadow-[0_0_40px_rgba(168,85,247,0.12)]"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-[0_0_30px_rgba(139,92,246,0.4)] border-2 border-purple-500/50">
                <img
                  src="/logo.png"
                  alt="Single Player"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nome editável */}
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={e => {
                      if (e.key === "Enter") saveName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    className="bg-white/10 border border-purple-500/50 rounded-lg px-3 py-1.5 text-white text-center text-lg font-bold outline-none focus:border-purple-400"
                    autoFocus
                    maxLength={20}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempName(playerName);
                    setEditingName(true);
                  }}
                  className="group flex items-center gap-1.5"
                >
                  <span className="text-xl font-bold text-white">
                    {playerName}
                  </span>
                  <span className="text-white/30 text-xs group-hover:text-purple-400 transition-colors">
                    ✏️
                  </span>
                </button>
              )}

              {/* Título dinâmico */}
              <div className="mt-2 flex items-center gap-1.5 bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1">
                <span className="text-sm">{title.icon}</span>
                <span className="text-purple-300 text-xs font-semibold tracking-wide">
                  {title.label}
                </span>
              </div>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                {
                  label: t.level,
                  value: level,
                  color: "text-purple-400",
                  icon: "⚡",
                },
                {
                  label: "XP",
                  value: totalXP,
                  color: "text-cyan-400",
                  icon: "💎",
                },
                {
                  label: t.tasks,
                  value: completedTasks.length,
                  color: "text-blue-400",
                  icon: "✅",
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 flex flex-col items-center gap-0.5"
                >
                  <span className="text-base">{stat.icon}</span>
                  <span className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-white/40 text-xs">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Barra de XP pro próximo level */}
            <div>
              <div className="flex justify-between text-xs text-white/40 mb-1">
                <span>
                  {t.level} {level}
                </span>
                <span>
                  {xpLeft}/{xpNeeded} XP
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  style={{ boxShadow: "0 0 8px rgba(139,92,246,0.5)" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Botões */}
          {[
            {
              label: t.editTasks,
              icon: "📅",
              delay: 0.1,
              onClick: () => setShowWeeklyEditor(true),
              border: "border-blue-500/40",
              text: "text-blue-300",
              glow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
            },
            {
              label: t.settings,
              icon: "⚙️",
              delay: 0.15,
              onClick: () => setShowSettings(true),
              border: "border-purple-500/40",
              text: "text-purple-300",
              glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
            },
          ].map(btn => (
            <motion.button
              key={btn.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: btn.delay }}
              onClick={btn.onClick}
              className={`w-full rounded-2xl border ${btn.border} bg-gradient-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between mb-3 ${btn.glow} transition-all duration-300`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{btn.icon}</span>
                <span className={`font-semibold ${btn.text}`}>{btn.label}</span>
              </div>
              <span className="text-white/30">›</span>
            </motion.button>
          ))}
          {/* Caixas extras */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            onClick={handleNotification}
            className="w-full rounded-2xl border border-blue-500/40 bg-gradient-to-br from-black/40 via-blue-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between mb-3 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <span className="font-semibold text-blue-300">
                Daily Reminder
              </span>
            </div>
            <span className="text-white/30">›</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            onClick={handleInstallApp}
            className="w-full rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-black/40 via-cyan-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between mb-3 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📱</span>
              <span className="font-semibold text-cyan-300">Install App</span>
            </div>
            <span className="text-white/30">›</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            onClick={handleShareApp}
            className="w-full rounded-2xl border border-purple-500/40 bg-gradient-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between mb-3 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔗</span>
              <span className="font-semibold text-purple-300">Share App</span>
            </div>
            <span className="text-white/30">›</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35 }}
            className="w-full rounded-2xl border border-purple-500/20 bg-gradient-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-5 text-center"
          >
            <p className="text-white/60 text-sm leading-relaxed">
              "You are the protagonist of this game.
              <br />
              Level up your life."
            </p>
            <div className="mt-3 h-px bg-purple-500/20" />
            <p className="mt-3 text-xs text-purple-400/60 font-medium tracking-widest uppercase">
              Made by rybeirdev
            </p>
            <p className="mt-1 text-xs text-white/20">Single Player · v1.0</p>
          </motion.div>
        </>
      )}
      {/* ══════════════════════════════════════════════════════════════════════
          WEEKLY EDITOR
      ══════════════════════════════════════════════════════════════════════ */}
      {showWeeklyEditor && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowWeeklyEditor(false)}
              className="text-purple-300/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
            >
              {t.back}
            </button>
            <h1 className="text-2xl font-bold text-white">{t.editWeekly}</h1>
            <p className="text-purple-300/70 text-sm mt-1">{t.schedule}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl border border-purple-500/40 bg-linear-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-4 mb-4 shadow-[0_0_40px_rgba(168,85,247,0.08)]"
          >
            <div className="space-y-2">
              {DAYS.map((day, i) => (
                <motion.button
                  key={day}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => setEditingDay(editingDay === day ? null : day)}
                  className={`w-full p-3.5 rounded-xl transition-all duration-300 text-left flex items-center justify-between ${
                    editingDay === day
                      ? "bg-purple-500/20 border border-purple-500/50"
                      : "bg-white/5 border border-white/10 hover:border-purple-500/30"
                  }`}
                >
                  <span className="font-semibold text-white text-sm">
                    {DAY_NAMES[language][day as keyof (typeof DAY_NAMES)["en"]]}
                  </span>
                  <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                    {(weeklyTasks[day] || []).length} {t.tasks.toLowerCase()}
                  </span>
                </motion.button>
              ))}
            </div>

            {editingDay && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white text-sm">
                    {
                      DAY_NAMES[language][
                        editingDay as keyof (typeof DAY_NAMES)["en"]
                      ]
                    }
                  </h4>
                  <button
                    onClick={() => setEditingDay(null)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {(weeklyTasks[editingDay] || []).map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-lg"
                    >
                      {editingWeeklyTaskId === task.id ? (
                        <input
                          type="text"
                          value={editingWeeklyText}
                          onChange={e => setEditingWeeklyText(e.target.value)}
                          onBlur={() => saveEditWeeklyTask(editingDay, task.id)}
                          onKeyDown={e => {
                            if (e.key === "Enter")
                              saveEditWeeklyTask(editingDay, task.id);
                            if (e.key === "Escape") cancelEditWeeklyTask();
                          }}
                          className="flex-1 px-2 py-1 bg-white/10 border border-purple-500/50 rounded-lg text-white text-sm outline-none"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className="flex-1 text-white/80 text-sm">
                            {task.text}
                          </span>
                          <button
                            onClick={() =>
                              startEditingWeeklyTask(
                                editingDay,
                                task.id,
                                task.text
                              )
                            }
                            className="text-white/30 hover:text-purple-400 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() =>
                              deleteWeeklyTask(editingDay, task.id)
                            }
                            className="text-white/30 hover:text-red-400 transition-colors"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => addTaskToDay(editingDay)}
                  className="w-full py-2 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-300 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-purple-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {t.addTask}
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SETTINGS
      ══════════════════════════════════════════════════════════════════════ */}
      {showSettings && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowSettings(false)}
              className="text-purple-300/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
            >
              {t.back}
            </button>
            <h1 className="text-2xl font-bold text-white">
              ⚙️ {t.settingsTitle}
            </h1>
            <p className="text-purple-300/70 text-sm mt-1">
              {t.settingsSubtitle}
            </p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {/* Language Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-black/40 via-cyan-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.06)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🌐</span>
                <span className="font-semibold text-cyan-300">
                  {t.language}
                </span>
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-500/40 rounded-xl px-4 py-1.5 transition-all hover:bg-cyan-500/30"
              >
                <span
                  className={`text-sm font-bold transition-colors ${language === "en" ? "text-cyan-300" : "text-white/30"}`}
                >
                  EN
                </span>
                <span className="text-white/20 mx-1">|</span>
                <span
                  className={`text-sm font-bold transition-colors ${language === "pt" ? "text-cyan-300" : "text-white/30"}`}
                >
                  PT
                </span>
              </button>
            </motion.div>

            {/* Reset Today */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              onClick={() => setResetModal("today")}
              className="w-full rounded-2xl border border-amber-500/40 bg-linear-to-br from-black/40 via-amber-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between hover:shadow-[0_0_20px_rgba(245,158,11,0.12)] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold text-amber-400">
                  {t.resetToday}
                </span>
              </div>
              <span className="text-white/30">›</span>
            </motion.button>

            {/* Reset Everything */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              onClick={() => setResetModal("all")}
              className="w-full rounded-2xl border border-red-500/40 bg-linear-to-br from-black/40 via-red-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between hover:shadow-[0_0_20px_rgba(239,68,68,0.12)] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">💀</span>
                <span className="font-semibold text-red-400">{t.resetAll}</span>
              </div>
              <span className="text-white/30">›</span>
            </motion.button>

            {/* Export Data */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              onClick={exportData}
              className="w-full rounded-2xl border border-purple-500/40 bg-linear-to-br from-black/40 via-purple-900/10 to-black/40 backdrop-blur-xl p-4 flex items-center justify-between hover:shadow-[0_0_20px_rgba(139,92,246,0.12)] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-purple-300">
                  {t.export}
                </span>
              </div>
              <span className="text-white/30">›</span>
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState<"home" | "stats" | "profile">(
    "home"
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showWeeklyEditor, setShowWeeklyEditor] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayDate, setTodayDate] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [dayStats, setDayStats] = useState<DayStats[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTasks>({});
  const [newTaskDifficulty, setNewTaskDifficulty] =
    useState<Difficulty>("easy");
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [streakClaimedToday, setStreakClaimedToday] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingWeeklyTaskId, setEditingWeeklyTaskId] = useState<string | null>(
    null
  );
  const [editingWeeklyText, setEditingWeeklyText] = useState("");
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [playerName, setPlayerName] = useState<string>(
    () => localStorage.getItem("playerName") || "Player"
  );
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [language, setLanguage] = useState<"en" | "pt">(
    () => (localStorage.getItem("language") as "en" | "pt") || "en"
  );
  const [resetModal, setResetModal] = useState<null | "today" | "all">(null);

  // Initialize
  useEffect(() => {
    const today = new Date().toDateString();
    setTodayDate(formatDate(new Date(), language));

    const savedTasks = localStorage.getItem("tasks");
    const savedStreak = localStorage.getItem("streak");
    const savedWeeklyTasks = localStorage.getItem("weeklyTasks");
    const savedDayStats = localStorage.getItem("dayStats");

    let parsedWeekly: WeeklyTasks = {};

    if (savedWeeklyTasks) {
      parsedWeekly = JSON.parse(savedWeeklyTasks);
      setWeeklyTasks(parsedWeekly);
    }

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDayStats) setDayStats(JSON.parse(savedDayStats));

    const lastStreakDate = localStorage.getItem("lastStreakDate");
    if (lastStreakDate === today) {
      setStreakClaimedToday(true);
    }

    // carregar tarefas corretas do dia
    const dayIndex = new Date().getDay();
    const dayName = DAYS[dayIndex === 0 ? 6 : dayIndex - 1];
    const todayISO = new Date().toISOString().split("T")[0];
    const savedCompleted = localStorage.getItem("completedToday");
    const parsedCompleted: { date: string; ids: string[] } = savedCompleted
      ? JSON.parse(savedCompleted)
      : { date: "", ids: [] };

    const completedIds =
      parsedCompleted.date === todayISO ? parsedCompleted.ids : [];

    const tasksForToday = (parsedWeekly[dayName] || []).map((task: Task) => ({
      ...task,
      completed: completedIds.includes(task.id),
      difficulty: task.difficulty || "easy",
    }));
    setTasks(tasksForToday);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem("currentDay");

      if (savedDate !== today) {
        localStorage.setItem("currentDay", today);

        const dayIndex = new Date().getDay();
        const dayName = DAYS[dayIndex === 0 ? 6 : dayIndex - 1];

        const savedWeekly = localStorage.getItem("weeklyTasks");
        if (!savedWeekly) return;

        const parsed = JSON.parse(savedWeekly);
        const newTasks: Task[] = (parsed[dayName] || []).map((task: Task) => ({
          ...task,
          completed: false,
          difficulty: task.difficulty || "easy",
        }));

        setTasks(newTasks);
        setStreakClaimedToday(false);
        setTodayDate(formatDate(new Date(), language));
      }
    }, 60000); // checa a cada 1 minuto

    return () => clearInterval(interval);
  }, []);

  const loadTasksForToday = () => {
    const today = new Date();
    const dayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
    const tasksForToday: Task[] = (weeklyTasks[dayName] || []).map(
      (task: Task) => ({
        ...task,
        difficulty: task.difficulty || "easy",
      })
    );

    if (tasksForToday.length > 0) {
      setTasks(tasksForToday);
    }
  };

  const formatDate = (date: Date, lang: "en" | "pt" = "en") => {
    return date.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const updateTaskHistory = (dateISO: string, xpDelta: number) => {
    if (xpDelta === 0) return;

    const savedHistory = localStorage.getItem("historico_tarefas");
    let history: { date: string; xp: number }[] = [];

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          history = parsed;
        }
      } catch {
        // ignore parse errors and reset history
      }
    }

    const index = history.findIndex(entry => entry.date === dateISO);

    if (index >= 0) {
      history[index].xp = Math.max(0, (history[index].xp || 0) + xpDelta);
    } else if (xpDelta > 0) {
      history.push({ date: dateISO, xp: xpDelta });
    }

    localStorage.setItem("historico_tarefas", JSON.stringify(history));

    // notificar gráficos para atualizarem em tempo real
    try {
      window.dispatchEvent(new Event("historico_tarefas_updated"));
    } catch {
      // window pode não existir em alguns ambientes, ignorar
    }
  };

  const toggleTask = (id: string) => {
    const todayISO = new Date().toISOString().split("T")[0];
    let xpDelta = 0;

    const updated = tasks.map(t => {
      if (t.id !== id) return t;

      const difficulty = getTaskDifficulty(t);
      const taskXP = DIFFICULTY_XP[difficulty];

      if (!t.completed) {
        xpDelta += taskXP;
        return { ...t, completed: true };
      } else {
        xpDelta -= taskXP;
        return { ...t, completed: false };
      }
    });

    setTasks(updated);

    const dayName =
      DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const weeklyUpdated = { ...weeklyTasks, [dayName]: updated };
    setWeeklyTasks(weeklyUpdated);

    localStorage.setItem("tasks", JSON.stringify(updated));
    const todayISO2 = new Date().toISOString().split("T")[0];
    const completedIds = updated.filter(t => t.completed).map(t => t.id);
    localStorage.setItem(
      "completedToday",
      JSON.stringify({ date: todayISO2, ids: completedIds })
    );
    localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));

    updateProgress(updated);

    // 🔥 salvar histórico diário automático (contagem de tarefas concluídas)
    const savedStats = localStorage.getItem("dayStats");
    const parsedStats = savedStats ? JSON.parse(savedStats) : {};

    parsedStats[todayISO] = updated.filter((t: Task) => t.completed).length;

    localStorage.setItem("dayStats", JSON.stringify(parsedStats));

    // salvar XP diário em historico_tarefas
    updateTaskHistory(todayISO, xpDelta);
  };
  const startEditing = (taskId: string, currentText: string) => {
    setEditingTaskId(taskId);
    setEditingText(currentText);
  };

  const saveEdit = (taskId: string) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, text: editingText } : task
      )
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);

    const dayName =
      DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const weeklyUpdated = { ...weeklyTasks, [dayName]: updatedTasks };
    setWeeklyTasks(weeklyUpdated);

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));
  };
  const startEditingWeeklyTask = (
    day: string,
    taskId: string,
    currentText: string
  ) => {
    setEditingWeeklyTaskId(taskId);
    setEditingWeeklyText(currentText);
  };

  const saveEditWeeklyTask = (day: string, taskId: string) => {
    const updatedTasks = (weeklyTasks[day] || []).map(task =>
      task.id === taskId ? { ...task, text: editingWeeklyText } : task
    );

    const updated = { ...weeklyTasks, [day]: updatedTasks };
    setWeeklyTasks(updated);
    localStorage.setItem("weeklyTasks", JSON.stringify(updated));

    setEditingWeeklyTaskId(null);
    setEditingWeeklyText("");
  };

  const cancelEditWeeklyTask = () => {
    setEditingWeeklyTaskId(null);
    setEditingWeeklyText("");
  };

  const deleteWeeklyTask = (day: string, taskId: string) => {
    const updatedTasks = (weeklyTasks[day] || []).filter(
      task => task.id !== taskId
    );

    const updated = { ...weeklyTasks, [day]: updatedTasks };
    setWeeklyTasks(updated);
    localStorage.setItem("weeklyTasks", JSON.stringify(updated));
  };
  const updateProgress = (currentTasks: Task[]) => {
    const completed = currentTasks.filter(t => t.completed).length;
    const total = currentTasks.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    if (progress === 100 && completed > 0) {
      setShowConfetti(true);
      if (!streakClaimedToday) {
        updateStreak();
      }
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastStreakDate = localStorage.getItem("lastStreakDate");

    // Only count streak once per day
    if (lastStreakDate === today) return;

    const newStreak = streak + 1;
    setStreak(newStreak);
    setStreakClaimedToday(true);
    localStorage.setItem("streak", newStreak.toString());
    localStorage.setItem("lastStreakDate", today);
  };

  const addTask = (difficulty: Difficulty) => {
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      difficulty: difficulty,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);

    const dayName =
      DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const weeklyUpdated = { ...weeklyTasks, [dayName]: updated };
    setWeeklyTasks(weeklyUpdated);

    localStorage.setItem("tasks", JSON.stringify(updated));
    localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));
  };

  const updateTaskText = (id: string, text: string) => {
    if (!text.trim()) {
      deleteTask(id);
      return;
    }

    const updated = tasks.map(t => (t.id === id ? { ...t, text } : t));
    setTasks(updated);

    const today = new Date();
    const dayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
    const weeklyUpdated = { ...weeklyTasks, [dayName]: updated };
    setWeeklyTasks(weeklyUpdated);

    localStorage.setItem("tasks", JSON.stringify(updated));
    localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));
  };

  const addTaskToDay = (day: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: "New task",
      completed: false,
      difficulty: "easy",
    };
    const dayTasks = weeklyTasks[day] || [];
    const updated = [...dayTasks, newTask];
    const weeklyUpdated = { ...weeklyTasks, [day]: updated };
    setWeeklyTasks(weeklyUpdated);
    localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));
  };

  const updateTaskInDay = (day: string, taskId: string, text: string) => {
    if (!text.trim()) {
      const dayTasks = weeklyTasks[day] || [];
      const updated = dayTasks.filter(t => t.id !== taskId);
      const weeklyUpdated = { ...weeklyTasks, [day]: updated };
      setWeeklyTasks(weeklyUpdated);
      localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));
      return;
    }

    const dayTasks = weeklyTasks[day] || [];
    const updated = dayTasks.map(t => (t.id === taskId ? { ...t, text } : t));
    const weeklyUpdated = { ...weeklyTasks, [day]: updated };
    setWeeklyTasks(weeklyUpdated);
    localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));
  };

  const exportData = () => {
    const data = {
      tasks,
      streak,
      dayStats,
      weeklyTasks,
      exportDate: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `single-player-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const progress =
    tasks.length > 0
      ? (tasks.filter(t => t.completed).length / tasks.length) * 100
      : 0;
  const xp = tasks.reduce((total, task) => {
    if (!task.completed) return total;
    const difficulty = getTaskDifficulty(task);
    return total + DIFFICULTY_XP[difficulty];
  }, 0);
  // Sistema de Níveis
  const calculateLevel = (totalXP: number) => {
    let level = 1;
    let xpNeeded = 50;
    let xpCounted = 0;

    while (xpCounted + xpNeeded <= totalXP) {
      xpCounted += xpNeeded;
      level++;
      xpNeeded = 50 * level;
    }

    return {
      level,
      currentLevelXP: totalXP - xpCounted,
      xpForNextLevel: xpNeeded,
      progressPercent: ((totalXP - xpCounted) / xpNeeded) * 100,
    };
  };

  const levelInfo = calculateLevel(xp);

  // Frases motivacionais aleatórias
  const motivationalQuotes = [
    "Discipline beats motivation.",
    "Earn your time.",
    "One day or day one.",
    "Small steps, big results.",
    "Progress over perfection.",
    "Your future self will thank you.",
    "Consistency is key.",
    "Make it happen.",
  ];

  const [currentQuote] = useState(
    () =>
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Badges desbloqueadas
  const totalTasksCompleted = tasks.filter(t => t.completed).length;
  const hardTasksCompleted = tasks.filter(
    t => t.completed && getTaskDifficulty(t) === "hard"
  ).length;

  const badges = [
    {
      icon: "⭐",
      unlocked: totalTasksCompleted >= 100,
      title: "Centurion",
      description: "100 tasks completed",
    },
    {
      icon: "💎",
      unlocked: xp >= 500,
      title: "XP Master",
      description: "500 XP earned",
    },
    {
      icon: "💪",
      unlocked: hardTasksCompleted >= 50,
      title: "Hardcore",
      description: "50 hard tasks",
    },
    {
      icon: "🏆",
      unlocked: levelInfo.level >= 5,
      title: "Level 5",
      description: "Reached level 5",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Galaxy Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0b2e] to-[#16213e] animate-gradient" />
      <div className="fixed inset-0 bg-gradient-to-tl from-[#6b21a8]/30 via-transparent to-[#0f2557]/30" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      {/* Animated stars */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>
      {/* Background with noise pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Confetti */}
      {showConfetti && (
        <div ref={confettiRef} className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full animate-bounce"
              style={{
                left: Math.random() * 100 + "%",
                top: -10 + "px",
                animation: `fall ${2 + Math.random() * 1}s linear forwards`,
                animationDelay: Math.random() * 0.5 + "s",
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <div
        className="relative z-10 min-h-screen flex items-start justify-center px-4 pt-4 pb-24"
        onTouchStart={e => {
          (window as any)._swipeStartX = e.touches[0].clientX;
          (window as any)._swipeStartY = e.touches[0].clientY;
        }}
        onTouchEnd={e => {
          const startX = (window as any)._swipeStartX;
          const startY = (window as any)._swipeStartY;
          if (startX == null || startY == null) return;
          const diffX = startX - e.changedTouches[0].clientX;
          const diffY = startY - e.changedTouches[0].clientY;
          // só muda se movimento horizontal for maior que vertical
          if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 60) {
            const tabs = ["home", "stats", "profile"] as const;
            const currentIndex = tabs.indexOf(currentTab as any);
            if (diffX > 0 && currentIndex < tabs.length - 1) {
              setCurrentTab(tabs[currentIndex + 1]);
            } else if (diffX < 0 && currentIndex > 0) {
              setCurrentTab(tabs[currentIndex - 1]);
            }
          }
          (window as any)._swipeStartX = null;
          (window as any)._swipeStartY = null;
        }}
      >
        <AnimatePresence mode="wait">
          {/* HOME TAB */}
          {currentTab === "home" && (
            <AnimatedPage key="home" className="w-full max-w-md">
              <div
                className="w-full max-w-md mx-auto mb-8 text-center relative rounded-2xl p-3
  bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40
  backdrop-blur-xl
  border-2 border-purple-500/40
  shadow-[0_0_40px_rgba(168,85,247,0.15)]"
              >
                {/* Badges espalhados tipo estrelas */}
                <div
                  className="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl
    ${badges[0].unlocked 
      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
      : 'bg-black/60 grayscale opacity-30'
    } transition-all"
                  title={
                    badges[0].unlocked
                      ? badges[0].title
                      : `🔒 ${badges[0].description}`
                  }
                >
                  {badges[0].icon}
                </div>

                <div
                  className="absolute top-12 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl
    ${badges[1].unlocked 
      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
      : 'bg-black/60 grayscale opacity-30'
    } transition-all"
                  title={
                    badges[1].unlocked
                      ? badges[1].title
                      : `🔒 ${badges[1].description}`
                  }
                >
                  {badges[1].icon}
                </div>

                <div
                  className="absolute top-2 left-2 w-10 h-10 rounded-full flex items-center justify-center text-xl
    ${badges[2].unlocked 
      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
      : 'bg-black/60 grayscale opacity-30'
    } transition-all"
                  title={
                    badges[2].unlocked
                      ? badges[2].title
                      : `🔒 ${badges[2].description}`
                  }
                >
                  {badges[2].icon}
                </div>

                <div
                  className="absolute top-12 left-4 w-10 h-10 rounded-full flex items-center justify-center text-xl
    ${badges[3].unlocked 
      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
      : 'bg-black/60 grayscale opacity-30'
    } transition-all"
                  title={
                    badges[3].unlocked
                      ? badges[3].title
                      : `🔒 ${badges[3].description}`
                  }
                >
                  {badges[3].icon}
                </div>

                {/* Logo */}
                <img
                  src="/logo.png"
                  alt="Single Player Logo"
                  className="w-52 h-52 mx-auto -mb-8 drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                />

                {/* Level e barra horizontal */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-purple-500/40">
                    <span className="text-purple-400 font-bold text-base">
                      Lvl {levelInfo.level}
                    </span>
                  </div>

                  <div className="w-32 bg-black/30 rounded-full h-2 overflow-hidden border border-purple-500/30">
                    <div
                      style={{ width: `${levelInfo.progressPercent}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-600 transition-all duration-700"
                    />
                  </div>

                  <span className="text-xs text-purple-300/60 whitespace-nowrap">
                    {Math.round(levelInfo.currentLevelXP)}/
                    {levelInfo.xpForNextLevel}
                  </span>
                </div>

                {/* Título */}
                <h1 className="text-4xl font-bold text-white mb-2">
                  Single Player
                </h1>

                {/* Frase motivacional */}
                <p className="text-purple-300/80 text-base mb-2 flex items-center justify-center gap-2">
                  <span className="text-yellow-400">🏆</span>
                  {currentQuote}
                </p>
              </div>

              <div
                className="relative p-6 mb-6 animate-slide-up rounded-2xl
  bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40
  backdrop-blur-xl
  border-2 border-purple-500/40
  shadow-[0_0_40px_rgba(168,85,247,0.15)]
  hover:border-purple-500/60 hover:shadow-[0_0_60px_rgba(168,85,247,0.25)]
  transition-all duration-300"
                style={{ animationDelay: "0.1s" }}
              >
                <p className="text-sm text-purple-300/70 mb-4">{todayDate}</p>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Progress</span>
                    <span className="text-purple-400 font-bold text-lg">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden border border-purple-500/30">
                    <div
                      style={{ width: `${progress}%` }}
                      className="relative h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-600 transition-all duration-700 ease-out overflow-hidden"
                    >
                      <div className="absolute inset-0 animate-shine bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400">
                    <span className="text-lg">🔥</span>
                    <span className="font-semibold">
                      Streak: {streak} day{streak !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-purple-400">
                    <span className="font-semibold">XP:</span>
                    <AnimatedNumber value={xp} />
                  </div>
                </div>
              </div>

              <div
                className="relative p-6 mb-6 animate-slide-up rounded-2xl
  bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40
  backdrop-blur-xl
  border-2 border-purple-500/40
  shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="space-y-3">
                  {tasks.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center py-8 px-4 text-center"
                    >
                      <motion.span
                        className="text-5xl mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⚔️
                      </motion.span>
                      <p className="text-white font-semibold text-lg mb-1">
                        Your quest awaits.
                      </p>
                      <p className="text-purple-300/60 text-sm mb-5">
                        Add your first task and start your journey.
                      </p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDifficultyMenu(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-medium text-sm hover:bg-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        Add Task
                      </motion.button>
                    </motion.div>
                  )}
                  {tasks.map(task => (
                    <AnimatedTaskCard
                      key={task.id}
                      completed={task.completed}
                      onClick={() => {
                        if (editingTaskId === task.id) {
                          saveEdit(task.id);
                        } else {
                          toggleTask(task.id);
                        }
                      }}
                      className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300
          ${
            task.completed
              ? "bg-green-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
              : "bg-black/20 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-purple-500/60 hover:scale-[1.02]"
          }`}
                    >
                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              task.completed
                                ? "bg-green-500 border-green-400 scale-95 opacity-80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                : "border-purple-400"
                            }`}
                          >
                            {task.completed && (
                              <span className="text-white text-sm animate-bounce">
                                ✓
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                value={editingText}
                                onChange={e => setEditingText(e.target.value)}
                                onClick={e => e.stopPropagation()}
                                onBlur={() => saveEdit(task.id)}
                                onKeyDown={e => {
                                  if (e.key === "Enter") saveEdit(task.id);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                className="w-full bg-black/40 border-2 border-purple-500/50 rounded-lg px-3 py-1.5 text-white outline-none focus:border-purple-400 transition-colors"
                                autoFocus
                              />
                            ) : (
                              <>
                                <span
                                  className={`flex-1 min-w-0 truncate ${
                                    task.completed
                                      ? "text-muted-foreground line-through"
                                      : "text-white"
                                  }`}
                                >
                                  {task.text}
                                </span>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      startEditing(task.id, task.text);
                                    }}
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      deleteTask(task.id);
                                    }}
                                    className="text-red-400/70 hover:text-red-400 transition-colors"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <span
                          onClick={e => e.stopPropagation()}
                          className={getDifficultyBadgeClasses(task)}
                        >
                          {DIFFICULTY_LABELS[getTaskDifficulty(task)]}
                        </span>
                      </div>
                    </AnimatedTaskCard>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowDifficultyMenu(true)}
                className="fixed bottom-24 right-6 w-16 h-16 rounded-full 
  bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500
  shadow-[0_0_60px_rgba(139,92,246,0.6),0_0_30px_rgba(59,130,246,0.4)]
  border-2 border-white/20
  flex items-center justify-center
  backdrop-blur-xl
  hover:scale-110 hover:shadow-[0_0_80px_rgba(139,92,246,0.8),0_0_40px_rgba(59,130,246,0.6)]
  active:scale-95
  transition-all duration-300 ease-out
  z-50 group
  animate-pulse-glow"
              >
                <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />

                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-50"></span>

                <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping-slow"></span>
              </button>
              {showDifficultyMenu && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div
                    className="bg-gradient-to-br from-black/90 via-purple-900/30 to-black/90 
      backdrop-blur-xl border-2 border-purple-500/40 rounded-2xl p-6 w-full max-w-sm 
      shadow-[0_0_60px_rgba(168,85,247,0.3)]"
                  >
                    <h2 className="text-xl font-bold text-white text-center mb-4">
                      Add New Task
                    </h2>

                    {/* Input do nome da task */}
                    <input
                      type="text"
                      placeholder="What do you need to do?"
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      onKeyDown={e => {
                        if (
                          e.key === "Enter" &&
                          newTaskText.trim() &&
                          selectedDifficulty
                        ) {
                          addTask(selectedDifficulty);
                          setShowDifficultyMenu(false);
                          setNewTaskText("");
                          setSelectedDifficulty(null);
                        }
                      }}
                      className="w-full mb-4 px-4 py-3 bg-black/40 border-2 border-purple-500/30 
          rounded-xl text-white placeholder:text-purple-300/40 
          focus:border-purple-400 focus:outline-none transition-colors"
                      autoFocus
                    />

                    {/* Botões de dificuldade */}
                    <div className="mb-4">
                      <p className="text-sm text-purple-300/70 mb-2">
                        Difficulty:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {(["easy", "medium", "hard"] as Difficulty[]).map(
                          level => (
                            <button
                              key={level}
                              onClick={() => setSelectedDifficulty(level)}
                              className={`py-2.5 rounded-lg font-semibold transition-all ${
                                selectedDifficulty === level
                                  ? level === "easy"
                                    ? "bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                                    : level === "medium"
                                      ? "bg-yellow-500/30 border-2 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                                      : "bg-rose-500/30 border-2 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(251,113,133,0.3)]"
                                  : "bg-black/40 border-2 border-purple-500/20 text-purple-300/60 hover:border-purple-500/40"
                              }`}
                            >
                              {DIFFICULTY_LABELS[level]}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowDifficultyMenu(false);
                          setNewTaskText("");
                          setSelectedDifficulty(null);
                        }}
                        className="flex-1 py-2.5 rounded-lg border-2 border-purple-500/30 
            text-purple-300 hover:bg-purple-500/10 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (newTaskText.trim() && selectedDifficulty) {
                            addTask(selectedDifficulty);
                            setShowDifficultyMenu(false);
                            setNewTaskText("");
                            setSelectedDifficulty(null);
                          }
                        }}
                        disabled={!newTaskText.trim() || !selectedDifficulty}
                        className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                          newTaskText.trim() && selectedDifficulty
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                            : "bg-black/40 text-purple-300/30 cursor-not-allowed"
                        }`}
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </AnimatedPage>
          )}

          {/* STATS TAB */}
          {currentTab === "stats" && (
            <AnimatedPage key="stats" className="w-full max-w-md">
              <StatsTab
                streak={streak}
                tasks={tasks}
                dayStats={dayStats}
                language={language}
              />
            </AnimatedPage>
          )}

          {/* PROFILE TAB */}
          {currentTab === "profile" && (
            <AnimatedPage key="profile" className="w-full max-w-md">
              <ProfileTab
                streak={streak}
                tasks={tasks}
                setTasks={setTasks}
                dayStats={dayStats}
                setDayStats={setDayStats}
                weeklyTasks={weeklyTasks}
                setWeeklyTasks={setWeeklyTasks}
                setStreak={setStreak}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                showWeeklyEditor={showWeeklyEditor}
                setShowWeeklyEditor={setShowWeeklyEditor}
                editingDay={editingDay}
                setEditingDay={setEditingDay}
                playerName={playerName}
                setPlayerName={setPlayerName}
                editingName={editingName}
                setEditingName={setEditingName}
                tempName={tempName}
                setTempName={setTempName}
                language={language}
                setLanguage={setLanguage}
                resetModal={resetModal}
                setResetModal={setResetModal}
                exportData={exportData}
                editingWeeklyTaskId={editingWeeklyTaskId}
                setEditingWeeklyTaskId={setEditingWeeklyTaskId}
                editingWeeklyText={editingWeeklyText}
                setEditingWeeklyText={setEditingWeeklyText}
                startEditingWeeklyTask={startEditingWeeklyTask}
                saveEditWeeklyTask={saveEditWeeklyTask}
                cancelEditWeeklyTask={cancelEditWeeklyTask}
                addTaskToDay={addTaskToDay}
                deleteWeeklyTask={deleteWeeklyTask}
              />
            </AnimatedPage>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe Handler */}
      {(() => {
        const tabs = ["home", "stats", "profile"] as const;
        return null;
      })()}

      {/* Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        onTouchStart={e => {
          (window as any)._swipeStartX = e.touches[0].clientX;
          (window as any)._swipeStartY = e.touches[0].clientY;
        }}
        onTouchEnd={e => {
          const startX = (window as any)._swipeStartX;
          const startY = (window as any)._swipeStartY;
          if (startX == null || startY == null) return;
          const diffX = startX - e.changedTouches[0].clientX;
          const diffY = startY - e.changedTouches[0].clientY;
          // só muda se movimento horizontal for maior que vertical
          if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 60) {
            const tabs = ["home", "stats", "profile"] as const;
            const currentIndex = tabs.indexOf(currentTab as any);
            if (diffX > 0 && currentIndex < tabs.length - 1) {
              setCurrentTab(tabs[currentIndex + 1]);
            } else if (diffX < 0 && currentIndex > 0) {
              setCurrentTab(tabs[currentIndex - 1]);
            }
          }
          (window as any)._swipeStartX = null;
          (window as any)._swipeStartY = null;
        }}
      >
        <div className="mx-3 mb-3 rounded-2xl border border-purple-500/40 bg-black/60 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <div className="max-w-md mx-auto px-2 py-2 flex justify-around items-center relative">
            {/* Indicador deslizante */}
            {(() => {
              const tabs = ["home", "stats", "profile"];
              const index = tabs.indexOf(currentTab);
              return (
                <motion.div
                  className="absolute top-2 bottom-2 w-[30%] rounded-xl bg-purple-500/15 border border-purple-500/40"
                  style={{
                    boxShadow: "0 0 20px rgba(139,92,246,0.2)",
                  }}
                  animate={{ left: `calc(${index} * 33.333% + 1.5%)` }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              );
            })()}

            {/* Home */}
            <AnimatedButton
              onClick={() => setCurrentTab("home")}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl w-1/3"
            >
              <motion.div
                animate={{ scale: currentTab === "home" ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
                    stroke={currentTab === "home" ? "#a855f7" : "#6b21a8"}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill={
                      currentTab === "home" ? "rgba(168,85,247,0.15)" : "none"
                    }
                  />
                  {currentTab === "home" && (
                    <motion.path
                      d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
                      stroke="#c084fc"
                      strokeWidth="0.5"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </svg>
              </motion.div>
              <span
                className={`text-xs font-medium tracking-wide transition-colors duration-200 ${
                  currentTab === "home" ? "text-purple-300" : "text-purple-900"
                }`}
              >
                Home
              </span>
            </AnimatedButton>

            {/* Stats */}
            <AnimatedButton
              onClick={() => setCurrentTab("stats")}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl w-1/3"
            >
              <motion.div
                animate={{ scale: currentTab === "stats" ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <motion.rect
                    x="3"
                    y="12"
                    width="4"
                    height="9"
                    rx="1"
                    stroke={currentTab === "stats" ? "#06b6d4" : "#164e63"}
                    strokeWidth="1.5"
                    fill={
                      currentTab === "stats" ? "rgba(6,182,212,0.15)" : "none"
                    }
                  />
                  <motion.rect
                    x="10"
                    y="7"
                    width="4"
                    height="14"
                    rx="1"
                    stroke={currentTab === "stats" ? "#06b6d4" : "#164e63"}
                    strokeWidth="1.5"
                    fill={
                      currentTab === "stats" ? "rgba(6,182,212,0.15)" : "none"
                    }
                  />
                  <motion.rect
                    x="17"
                    y="3"
                    width="4"
                    height="18"
                    rx="1"
                    stroke={currentTab === "stats" ? "#06b6d4" : "#164e63"}
                    strokeWidth="1.5"
                    fill={
                      currentTab === "stats" ? "rgba(6,182,212,0.15)" : "none"
                    }
                  />
                  {currentTab === "stats" && (
                    <motion.rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="#22d3ee"
                      strokeWidth="0.5"
                      fill="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </svg>
              </motion.div>
              <span
                className={`text-xs font-medium tracking-wide transition-colors duration-200 ${
                  currentTab === "stats" ? "text-cyan-300" : "text-cyan-900"
                }`}
              >
                Stats
              </span>
            </AnimatedButton>

            {/* Profile */}
            <AnimatedButton
              onClick={() => {
                setCurrentTab("profile");
                setShowSettings(false);
              }}
              className="relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl w-1/3"
            >
              <motion.div
                animate={{ scale: currentTab === "profile" ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <motion.circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke={currentTab === "profile" ? "#3b82f6" : "#1e3a5f"}
                    strokeWidth="1.5"
                    fill={
                      currentTab === "profile"
                        ? "rgba(59,130,246,0.15)"
                        : "none"
                    }
                  />
                  <motion.path
                    d="M4 20C4 17 7.6 14 12 14C16.4 14 20 17 20 20"
                    stroke={currentTab === "profile" ? "#3b82f6" : "#1e3a5f"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {currentTab === "profile" && (
                    <motion.circle
                      cx="12"
                      cy="8"
                      r="7"
                      stroke="#60a5fa"
                      strokeWidth="0.5"
                      fill="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </svg>
              </motion.div>
              <span
                className={`text-xs font-medium tracking-wide transition-colors duration-200 ${
                  currentTab === "profile" ? "text-blue-300" : "text-blue-900"
                }`}
              >
                Profile
              </span>
            </AnimatedButton>
          </div>
        </div>
      </div>
      <style>{`
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes gradient {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes gradient-slow {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  .animate-gradient {
    animation: gradient 8s ease-in-out infinite;
  }
    @keyframes shine {
  0% { transform: translateX(-100%) }
  100% { transform: translateX(100%) }
}

.animate-shine {
  animation: shine 2s linear infinite;
}
  @keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 60px rgba(139,92,246,0.6), 0 0 30px rgba(59,130,246,0.4);
  }
  50% { 
    box-shadow: 0 0 80px rgba(139,92,246,0.8), 0 0 50px rgba(59,130,246,0.6);
  }
}

@keyframes ping-slow {
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
  @keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

.animate-shine {
  animation: shine 3s ease-in-out infinite;
}
  
`}</style>
    </div>
  );
}
