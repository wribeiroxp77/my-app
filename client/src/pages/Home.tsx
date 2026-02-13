import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Download, Trash2, Plus, X, BarChart3, User } from "lucide-react";
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_NAMES = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday"
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
  easy: `Fácil · ${DIFFICULTY_XP.easy} XP`,
  medium: `Médio · ${DIFFICULTY_XP.medium} XP`,
  hard: `Difícil · ${DIFFICULTY_XP.hard} XP`,
};

const getTaskDifficulty = (task: Task): Difficulty => task.difficulty || "easy";

const getDifficultyBadgeClasses = (task: Task) => {
  const base = "px-2 py-1 text-xs font-semibold rounded-full border whitespace-nowrap";
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

const ASTRONAUT_LOGO = "https://private-us-east-1.manuscdn.com/sessionFile/JKfrijgSHJWtYAWAoWAo99/sandbox/ZYgwdep9JZxuer1ajCjPml-img-1_1770684317000_na1fn_YXN0cm9uYXV0LWxvZ28tZmluYWw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSktmcmlqZ1NISld0WUFXQW9XQW85OS9zYW5kYm94L1pZZ3dkZXA5Slp4dWVyMWFqQ2pQbWwtaW1nLTFfMTc3MDY4NDMxNzAwMF9uYTFmbl9ZWE4wY201dVlYVjBMV3h2WjI4dFptbHVZV3cudG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=BnfgrJnVXWvgtiXUsue4LWjpuPDxRoaL0mfL4XUAA9FRGDmYeuDPO0cziicbSde1IHK0Syduvk-B1evBBzG6a3n2zwFbrV4TySlMfAwOrKWpMx19M6FBpwhI0Eptv5rkjUOaV3jCsj6GWQHRM1TgJt-Gs6Cexs39df3HxdR2esjYxErEFwTHxzJP6leMCQ~QG1gkOP-Rb3d32abifVJfRcbJxyYAB4bDEd~F-U4PuMwMqcesQSGa8NfCaZ5f6IXD3UiEkQwjxaRan6sgAeafWErimiJCyXvvpD2cwVD82uMFS5ICx8LHV1CV6M1nZW7HsSIvD6~yqTfJpgNYe1VJZQ__";

function StatsTab({ streak }: { streak: number }) {
  const xpHistory = useXPHistoryLast7Days();

  const chartData = xpHistory.map((point) => {
    const date = new Date(point.date);
    return {
      date: point.date,
      day: `${date.getDate()}/${date.getMonth() + 1}`,
      xp: point.xp,
    };
  });

  const chartConfig = {
    xp: {
      label: "XP",
      color: "hsl(var(--chart-1))",
    },
  } as const;

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">Statistics</h1>
        <p className="text-muted-foreground text-lg">Your progress</p>
      </div>

      <div className="glass-card p-6 mb-6 text-center">
        <div className="text-5xl font-bold text-accent mb-2">{streak}</div>
        <p className="text-muted-foreground">Day Streak</p>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">XP - Last 7 Days</h3>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            barCategoryGap="28%"
            barGap={4}
          >
            <defs>
              <linearGradient id="barGradientRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(251, 113, 133)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="barGradientYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(253, 224, 71)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgb(234, 179, 8)" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.15)"
              strokeWidth={1}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 50]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={32}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value} XP`, "XP"]}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload as any;
                    return p?.day || "";
                  }}
                />
              }
            />
            <Bar
              dataKey="xp"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
              animationDuration={400}
              animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
            >
              {chartData.map((entry) => {
                const xp = entry.xp || 0;
                let fill = "url(#barGradientRed)";
                if (xp >= 15 && xp <= 40) {
                  fill = "url(#barGradientYellow)";
                } else if (xp > 40) {
                  fill = "url(#barGradientGreen)";
                }
                return <Cell key={entry.date} fill={fill} stroke="none" />;
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState<"home" | "stats" | "profile">("home");
  const [showSettings, setShowSettings] = useState(false);
  const [showWeeklyEditor, setShowWeeklyEditor] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayDate, setTodayDate] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [dayStats, setDayStats] = useState<DayStats[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTasks>({});
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<Difficulty>("easy");
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");
  const [streakClaimedToday, setStreakClaimedToday] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
  const today = new Date().toDateString();
  setTodayDate(formatDate(new Date()));

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
  const tasksForToday = (parsedWeekly[dayName] || []).map((task: Task) => ({
    ...task,
    completed: false,
    difficulty: task.difficulty || "easy"
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
        difficulty: task.difficulty || "easy"
      }));

      setTasks(newTasks);
      setStreakClaimedToday(false);
      setTodayDate(formatDate(new Date()));
    }
  }, 60000); // checa a cada 1 minuto

  return () => clearInterval(interval);
}, []);

  const loadTasksForToday = () => {
    const today = new Date();
    const dayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
    const tasksForToday: Task[] = (weeklyTasks[dayName] || []).map((task: Task) => ({
      ...task,
      difficulty: task.difficulty || "easy"
    }));
    
    if (tasksForToday.length > 0) {
      setTasks(tasksForToday);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
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

    const index = history.findIndex((entry) => entry.date === dateISO);

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

    const updated = tasks.map((t) => {
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
    
    const dayName = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const weeklyUpdated = { ...weeklyTasks, [dayName]: updated };
    setWeeklyTasks(weeklyUpdated);
    
    localStorage.setItem("tasks", JSON.stringify(updated));
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

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: "New task",
      completed: false,
      difficulty: newTaskDifficulty
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    
    const today = new Date();
    const dayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
    const weeklyUpdated = { ...weeklyTasks, [dayName]: updated };
    setWeeklyTasks(weeklyUpdated);
    
    localStorage.setItem("tasks", JSON.stringify(updated));
    localStorage.setItem("weeklyTasks", JSON.stringify(weeklyUpdated));
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    
    const today = new Date();
    const dayName = DAYS[today.getDay() === 0 ? 6 : today.getDay() - 1];
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
    
    const updated = tasks.map(t => t.id === id ? { ...t, text } : t);
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
      difficulty: "easy"
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
    const updated = dayTasks.map(t => t.id === taskId ? { ...t, text } : t);
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
      exportDate: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `single-player-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const progress = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
  const xp = tasks.reduce((total, task) => {
    if (!task.completed) return total;
    const difficulty = getTaskDifficulty(task);
    return total + DIFFICULTY_XP[difficulty];
  }, 0);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background with noise pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px"
      }} />

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
                animationDelay: Math.random() * 0.5 + "s"
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 pt-24">
        <AnimatePresence mode="wait">
        {/* HOME TAB */}
        {currentTab === "home" && (
          <AnimatedPage key="home" className="w-full max-w-md">
            <div className="mb-8 text-center pt-4" style={{
              background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              border: '2px solid rgba(147, 112, 219, 0.4)',
              boxShadow: '0 12px 40px rgba(147, 112, 219, 0.15)',
              padding: '2rem 1.5rem'
            }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg className="w-14 h-14" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  {/* Left Arm */}
                  <rect x="20" y="48" width="12" height="6" rx="3" fill="#1a1a1a" stroke="#ffffff" strokeWidth="1.5"/>
                  {/* Right Arm */}
                  <rect x="68" y="48" width="12" height="6" rx="3" fill="#1a1a1a" stroke="#ffffff" strokeWidth="1.5"/>
                  {/* Body */}
                  <ellipse cx="50" cy="65" rx="18" ry="22" fill="#1a1a1a" stroke="#ffffff" strokeWidth="2"/>
                  {/* Stripes on suit */}
                  <rect x="38" y="52" width="24" height="2.5" fill="#ffffff" transform="rotate(-25 50 65)"/>
                  <rect x="38" y="68" width="24" height="2.5" fill="#ffffff" transform="rotate(-25 50 65)"/>
                  {/* Head/Helmet outer ring */}
                  <circle cx="50" cy="32" r="20" fill="none" stroke="#ffffff" strokeWidth="2"/>
                  {/* Helmet glass */}
                  <ellipse cx="50" cy="30" rx="15" ry="17" fill="#87ceeb" opacity="0.7" stroke="#1a1a1a" strokeWidth="1.5"/>
                  {/* Helmet shine/reflection */}
                  <ellipse cx="46" cy="18" rx="5" ry="7" fill="#ffffff" opacity="0.7"/>
                </svg>
                <h1 className="text-4xl font-bold text-foreground">Single Player</h1>
              </div>
              <p className="text-muted-foreground text-lg">Earn your time.</p>
            </div>

            <div className="glass-card p-6 mb-6 animate-slide-up bg-card/80 border-border/50" style={{ animationDelay: "0.1s" }}>
              <p className="text-sm text-muted-foreground mb-4">{todayDate}</p>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-foreground font-semibold">Progress</span>
                  <span className="text-accent font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden border border-border/30">
                  <AnimatedProgressBar progress={progress} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-accent">
                <span className="text-lg">🔥</span>
                <span className="font-semibold">Streak: {streak} day{streak !== 1 ? 's' : ''}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">XP:</span>
                <AnimatedNumber value={xp} />
              </div>
            </div>

            <div className="glass-card p-6 mb-6 animate-slide-up bg-card/80 border-border/50" style={{ animationDelay: "0.2s" }}>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <AnimatedTaskCard
                    key={task.id}
                    completed={task.completed}
                    onClick={() => toggleTask(task.id)}
                    className={`p-4 rounded-lg border ${
                      task.completed
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-muted/20 border-border/30 hover:border-border/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
					  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
  task.completed
    ? "bg-green-500 border-green-500 scale-95 opacity-80"
    : "border-muted-foreground"
}`}
					  >
                       {task.completed && (
                     <span className="text-white text-sm animate-bounce">✓</span>
                     )}
                      </div>
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) => updateTaskText(task.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 bg-transparent outline-none ${
                          task.completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      />
                      </div>
                      <span
                        onClick={(e) => e.stopPropagation()}
                        className={getDifficultyBadgeClasses(task)}
                      >
                        {DIFFICULTY_LABELS[getTaskDifficulty(task)]}
                      </span>
                    </div>
                  </AnimatedTaskCard>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm text-muted-foreground">
                  Difficulty
                </label>
                <select
                  value={newTaskDifficulty}
                  onChange={(e) => setNewTaskDifficulty(e.target.value as Difficulty)}
                  className="flex-1 bg-background/60 border border-border/40 rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="easy">Fácil (5 XP)</option>
                  <option value="medium">Médio (10 XP)</option>
                  <option value="hard">Difícil (15 XP)</option>
                </select>
              </div>

              <AnimatedButton
                onClick={addTask}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add task
              </AnimatedButton>
            </div>

            {progress === 100 && tasks.length > 0 && (
              <div className="glass-card p-6 bg-yellow-500/10 border border-yellow-500/30 text-center animate-slide-up">
                <div className="text-4xl mb-2">🎁</div>
                <h3 className="text-lg font-bold text-yellow-400 mb-1">Leisure Voucher</h3>
                <p className="text-muted-foreground text-sm">Unlocked! You earned your time. 🎉</p>
              </div>
            )}
          </AnimatedPage>
        )}

        {/* STATS TAB */}
        {currentTab === "stats" && (
          <AnimatedPage key="stats" className="w-full max-w-md">
            <StatsTab streak={streak} />
          </AnimatedPage>
        )}

        {/* PROFILE TAB */}
        {currentTab === "profile" && (
          <AnimatedPage key="profile" className="w-full max-w-md">
            {!showSettings && !showWeeklyEditor ? (
              /* Main Profile View */
              <>
                <div className="mb-8 text-center">
                  <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
                  <p className="text-muted-foreground text-lg">Your settings</p>
                </div>

                <div className="glass-card p-6 mb-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-4 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Player</h2>
                  <p className="text-muted-foreground text-sm">Level 1 - Keep going! 🚀</p>
                </div>

                <AnimatedButton
                  onClick={() => setShowWeeklyEditor(true)}
                  className="w-full glass-card p-4 flex items-center justify-center gap-2 text-foreground font-semibold hover:bg-accent/20 mb-4"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Tasks
                </AnimatedButton>

                <AnimatedButton
                  onClick={() => setShowSettings(true)}
                  className="w-full glass-card p-4 flex items-center justify-center gap-2 text-foreground font-semibold hover:bg-accent/20"
                >
                  <span className="text-lg">⚙️</span>
                  Settings
                </AnimatedButton>
              </>
            ) : showWeeklyEditor ? (
              <>
                <div className="mb-8 text-center">
                  <button
                    onClick={() => setShowWeeklyEditor(false)}
                    className="text-muted-foreground hover:text-foreground mb-4 text-lg"
                  >
                    ← Back
                  </button>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Edit Weekly Tasks</h1>
                  <p className="text-muted-foreground text-lg">Customize your schedule</p>
                </div>

                <div className="glass-card p-6 mb-4">
                  <div className="space-y-3">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => setEditingDay(editingDay === day ? null : day)}
                        className={`w-full p-3 rounded-lg transition-all duration-300 text-left ${
                          editingDay === day
                            ? "bg-accent/30 border border-accent/50"
                            : "bg-muted/30 border border-border/30 hover:border-border/50"
                        }`}
                      >
                        <span className="font-semibold text-foreground">{DAY_NAMES[day as keyof typeof DAY_NAMES]}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({(weeklyTasks[day] || []).length} tasks)
                        </span>
                      </button>
                    ))}
                  </div>

                  {editingDay && (
                    <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-foreground">
                          {DAY_NAMES[editingDay as keyof typeof DAY_NAMES]}
                        </h4>
                        <button
                          onClick={() => setEditingDay(null)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        {(weeklyTasks[editingDay] || []).map((task) => (
                          <input
                            key={task.id}
                            type="text"
                            value={task.text}
                            onChange={(e) => updateTaskInDay(editingDay, task.id, e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border/30 rounded-lg text-foreground outline-none focus:border-accent/50"
                          />
                        ))}
                      </div>

                      <AnimatedButton
                        onClick={() => addTaskToDay(editingDay)}
                        className="w-full px-3 py-2 bg-accent/20 border border-accent/50 rounded-lg text-accent font-semibold flex items-center justify-center gap-2 hover:bg-accent/30"
                      >
                        <Plus className="w-4 h-4" />
                        Add task
                      </AnimatedButton>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-muted-foreground hover:text-foreground mb-4 text-lg"
                  >
                    ← Back
                  </button>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
                  <p className="text-muted-foreground text-lg">App configuration</p>
                </div>

                {/* Reset Today */}
                <AnimatedButton
                  onClick={() => {
                    if (confirm('Reset today\'s tasks only? Your streak and history will be preserved.')) {
                      setTasks([]);
                      const today = new Date().toISOString().split('T')[0];
                      const updated = dayStats.filter(d => d.date !== today);
                      setDayStats(updated);
                      localStorage.setItem('dayStats', JSON.stringify(updated));
                      alert('Today\'s tasks have been reset!');
                    }
                  }}
                  className="w-full glass-card p-4 flex items-center justify-center gap-2 text-yellow-400 font-semibold hover:bg-yellow-500/10 border border-yellow-500/30 mb-4"
                >
                  <Trash2 className="w-5 h-5" />
                  Reset Today
                </AnimatedButton>

                {/* Reset Everything */}
                <AnimatedButton
                  onClick={() => {
                    if (confirm('Are you sure you want to reset everything? This will delete all your data, tasks, and streak.')) {
                      localStorage.clear();
                      setTasks([]);
                      setStreak(0);
                      setWeeklyTasks({});
                      setDayStats([]);
                      alert('App has been reset! Refresh the page to start fresh.');
                    }
                  }}
                  className="w-full glass-card p-4 flex items-center justify-center gap-2 text-red-400 font-semibold hover:bg-red-500/10 border border-red-500/30 mb-4"
                >
                  <Trash2 className="w-5 h-5" />
                  Reset Everything
                </AnimatedButton>

                {/* Export Data */}
                <AnimatedButton
                  onClick={exportData}
                  className="w-full glass-card p-4 flex items-center justify-center gap-2 text-foreground font-semibold hover:bg-accent/20"
                >
                  <Download className="w-5 h-5" />
                  Export Data
                </AnimatedButton>
              </>
            )}
          </AnimatedPage>
        )}
        </AnimatePresence>
      </div>

      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border/30 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-around">
          <AnimatedButton
            onClick={() => setCurrentTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
              currentTab === "home"
                ? "text-accent bg-accent/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </AnimatedButton>

          <AnimatedButton
            onClick={() => setCurrentTab("stats")}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
              currentTab === "stats"
                ? "text-accent bg-accent/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Stats</span>
          </AnimatedButton>

          <AnimatedButton
            onClick={() => {
              setCurrentTab("profile");
              setShowSettings(false);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg ${
              currentTab === "profile"
                ? "text-accent bg-accent/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-xl">👤</span>
            <span className="text-xs font-medium">Profile</span>
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
