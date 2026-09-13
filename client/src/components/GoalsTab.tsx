import { activities } from "@/data/activityCatalog";
import type { ActivityLevel, Goal } from "@/types";
import {
  TimeAvailabilitySelector,
  type AvailableTimeMinutes,
} from "@/components/TimeAvailabilitySelector";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Pencil, Plus, RotateCcw, Target, X, Zap } from "lucide-react";
import { useMemo, useState } from "react";

export type GoalDraft = {
  name: string;
  category: string;
  level: "" | ActivityLevel;
};

const emptyDraft: GoalDraft = { name: "", category: "", level: "" };

const levelLabels: Record<ActivityLevel, string> = {
  todos: "Todos os níveis",
  iniciante: "Iniciante",
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

type GoalsTabProps = {
  goals: Goal[];
  onSave: (draft: GoalDraft, goalId?: string) => void;
  onArchive: (goalId: string) => void;
  onRestore: (goalId: string) => void;
};

function GoalCard({
  goal,
  archived,
  onEdit,
  onArchive,
  onRestore,
  onAdvance,
}: {
  goal: Goal;
  archived?: boolean;
  onEdit?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onAdvance?: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`rounded-2xl border p-4 backdrop-blur-xl ${
        archived
          ? "border-white/10 bg-black/25 opacity-75"
          : "border-purple-500/40 bg-linear-to-br from-black/45 via-purple-900/20 to-black/40 shadow-[0_0_24px_rgba(139,92,246,0.1)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
          <Target size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-white">{goal.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-purple-400/30 bg-purple-500/15 px-2 py-1 text-purple-200">
              {goal.category}
            </span>
            {goal.level !== "todos" && (
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-cyan-200">
                {levelLabels[goal.level]}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {archived ? (
          <button
            onClick={onRestore}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/20"
          >
            <RotateCcw size={15} /> Restaurar
          </button>
        ) : (
          <>
            <button
              onClick={onAdvance}
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-cyan-400/35 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-400/20"
            >
              <Zap size={15} /> Quero avançar
            </button>
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-400/35 bg-purple-500/10 px-3 py-2 text-sm font-semibold text-purple-200 transition-colors hover:bg-purple-500/20"
            >
              <Pencil size={15} /> Editar
            </button>
            <button
              onClick={onArchive}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={`Arquivar ${goal.name}`}
            >
              <Archive size={15} /> Arquivar
            </button>
          </>
        )}
      </div>
    </motion.article>
  );
}

export function GoalsTab({ goals, onSave, onArchive, onRestore }: GoalsTabProps) {
  const [draft, setDraft] = useState<GoalDraft>(emptyDraft);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [availableTimeMinutes, setAvailableTimeMinutes] =
    useState<AvailableTimeMinutes | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(activities.map(activity => activity.category))).sort(),
    []
  );
  const activeGoals = goals.filter(goal => goal.status === "active");
  const archivedGoals = goals.filter(goal => goal.status === "archived");
  const selectedGoal = activeGoals.find(goal => goal.id === selectedGoalId);

  const startAdvanceFlow = (goalId: string) => {
    setSelectedGoalId(goalId);
    setAvailableTimeMinutes(null);
  };

  const closeForm = () => {
    setDraft(emptyDraft);
    setEditingGoalId(null);
    setError("");
    setIsFormOpen(false);
  };

  const openNewGoal = () => {
    setDraft(emptyDraft);
    setEditingGoalId(null);
    setError("");
    setIsFormOpen(true);
  };

  const openEditGoal = (goal: Goal) => {
    setDraft({
      name: goal.name,
      category: goal.category,
      level: goal.level === "todos" ? "" : goal.level,
    });
    setEditingGoalId(goal.id);
    setError("");
    setIsFormOpen(true);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.category) {
      setError("Informe um nome e uma categoria para continuar.");
      return;
    }
    onSave({ ...draft, name: draft.name.trim() }, editingGoalId ?? undefined);
    closeForm();
  };

  return (
    <div className="w-full max-w-md pb-6">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Sua jornada</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Objetivos</h1>
          <p className="mt-1 text-sm text-purple-200/60">Escolha onde você quer chegar.</p>
        </div>
        <button
          onClick={openNewGoal}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-purple-400/45 bg-purple-500/20 px-3 py-2 text-sm font-semibold text-purple-100 shadow-[0_0_18px_rgba(139,92,246,0.18)] transition-colors hover:bg-purple-500/30"
        >
          <Plus size={16} /> Novo
        </button>
      </motion.header>

      <AnimatePresence mode="wait">
        {isFormOpen && (
          <motion.form
            key="goal-form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={submit}
            className="mb-5 rounded-2xl border border-cyan-400/35 bg-linear-to-br from-black/60 via-purple-950/45 to-black/55 p-4 shadow-[0_0_28px_rgba(6,182,212,0.1)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">{editingGoalId ? "Editar objetivo" : "Novo objetivo"}</h2>
              <button type="button" onClick={closeForm} className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white" aria-label="Fechar formulário">
                <X size={18} />
              </button>
            </div>
            <label className="mb-3 block text-sm text-purple-100/80">
              Nome
              <input
                autoFocus
                value={draft.name}
                onChange={event => setDraft(current => ({ ...current, name: event.target.value }))}
                maxLength={80}
                placeholder="Ex.: Falar inglês com confiança"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-white outline-none placeholder:text-white/25 focus:border-purple-400"
              />
            </label>
            <label className="mb-3 block text-sm text-purple-100/80">
              Categoria
              <select
                value={draft.category}
                onChange={event => setDraft(current => ({ ...current, category: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-white outline-none focus:border-purple-400"
              >
                <option value="" className="bg-slate-950">Selecione uma categoria</option>
                {categories.map(category => <option key={category} value={category} className="bg-slate-950">{category}</option>)}
              </select>
            </label>
            <label className="block text-sm text-purple-100/80">
              Nível <span className="text-white/35">(opcional)</span>
              <select
                value={draft.level}
                onChange={event => setDraft(current => ({ ...current, level: event.target.value as GoalDraft["level"] }))}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/35 px-3 py-2.5 text-white outline-none focus:border-purple-400"
              >
                <option value="" className="bg-slate-950">Qualquer nível</option>
                {(Object.keys(levelLabels).filter(level => level !== "todos") as ActivityLevel[]).map(level => (
                  <option key={level} value={level} className="bg-slate-950">{levelLabels[level]}</option>
                ))}
              </select>
            </label>
            {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={closeForm} className="flex-1 rounded-xl border border-white/15 py-2.5 text-sm font-semibold text-white/65 hover:bg-white/10">Cancelar</button>
              <button type="submit" className="flex-1 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] hover:brightness-110">
                {editingGoalId ? "Salvar" : "Criar objetivo"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {activeGoals.length === 0 && !isFormOpen ? (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-purple-400/35 bg-black/25 px-6 py-10 text-center">
          <Target className="mx-auto mb-3 text-cyan-300" size={32} />
          <h2 className="font-semibold text-white">Comece sua próxima missão</h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-purple-100/55">Objetivos dão direção à sua jornada. Crie um para usar nas próximas etapas do app.</p>
          <button onClick={openNewGoal} className="mt-5 rounded-xl border border-purple-400/45 bg-purple-500/15 px-4 py-2.5 text-sm font-semibold text-purple-100 hover:bg-purple-500/25">Criar primeiro objetivo</button>
        </motion.section>
      ) : (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-200/80">Ativos</h2>
            <span className="text-xs text-white/40">{activeGoals.length}</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} onAdvance={() => startAdvanceFlow(goal.id)} onEdit={() => openEditGoal(goal)} onArchive={() => onArchive(goal.id)} />)}
            </AnimatePresence>
          </div>
        </section>
      )}

      <AnimatePresence>
        {selectedGoal && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-5 rounded-2xl border border-cyan-400/35 bg-linear-to-br from-black/55 via-cyan-950/25 to-black/45 p-4 shadow-[0_0_28px_rgba(6,182,212,0.1)]"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-200/75">Preparar avanço</p>
                <h2 className="mt-1 font-semibold text-white">{selectedGoal.name}</h2>
              </div>
              <button type="button" onClick={() => setSelectedGoalId(null)} className="rounded-lg p-1 text-white/45 hover:bg-white/10 hover:text-white" aria-label="Fechar seleção de tempo">
                <X size={18} />
              </button>
            </div>
            <TimeAvailabilitySelector
              value={availableTimeMinutes}
              onChange={setAvailableTimeMinutes}
            />
            {availableTimeMinutes !== null && (
              <p className="mt-4 rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-2 text-sm text-purple-100/75">
                Tempo de sessão definido. A sugestão de atividade será a próxima etapa.
              </p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {archivedGoals.length > 0 && (
        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/45">Arquivados</h2>
            <span className="text-xs text-white/35">{archivedGoals.length}</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {archivedGoals.map(goal => <GoalCard key={goal.id} goal={goal} archived onRestore={() => onRestore(goal.id)} />)}
            </AnimatePresence>
          </div>
        </section>
      )}
    </div>
  );
}
