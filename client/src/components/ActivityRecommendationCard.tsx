import type { Activity } from "@/types";
import { Check, Clock3, Sparkles, Zap } from "lucide-react";

type ActivityRecommendationCardProps = {
  activity: Activity;
  availableTimeMinutes: number;
  confirmed: boolean;
  onConfirm: () => void;
  onAnotherSuggestion: () => void;
};

const difficultyLabels: Record<Activity["difficulty"], string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

const levelLabels: Record<Activity["level"], string> = {
  todos: "Todos os níveis",
  iniciante: "Iniciante",
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function ActivityRecommendationCard({
  activity,
  availableTimeMinutes,
  confirmed,
  onConfirm,
  onAnotherSuggestion,
}: ActivityRecommendationCardProps) {
  return (
    <div className="mt-5 rounded-2xl border border-purple-400/35 bg-linear-to-br from-black/60 via-purple-950/45 to-cyan-950/25 p-4 shadow-[0_0_28px_rgba(139,92,246,0.16)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-300/35 bg-purple-400/15 text-purple-200">
          <Sparkles size={19} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-200/75">
            Sugestão para você
          </p>
          <h3 className="mt-1 font-semibold text-white">{activity.name}</h3>
          <span className="mt-2 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">
            {activity.category}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-purple-100/70">
        A duração ideal desta atividade é próxima dos {availableTimeMinutes}{" "}
        minutos disponíveis.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-purple-100/75">
          <Clock3 size={15} className="text-cyan-300" />
          Ideal: {activity.durationIdeal} min
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-purple-100/75">
          <Zap size={15} className="text-amber-300" />
          {activity.xp} XP
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-purple-100/75">
          Dificuldade: {difficultyLabels[activity.difficulty]}
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-purple-100/75">
          Nível: {levelLabels[activity.level]}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmed}
          className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-cyan-600 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(139,92,246,0.3)] transition hover:brightness-110 disabled:cursor-default disabled:opacity-80"
        >
          <Check size={16} />
          {confirmed ? "Atividade selecionada" : "Fazer esta atividade"}
        </button>
        <button
          type="button"
          onClick={onAnotherSuggestion}
          className="rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          Outra sugestão
        </button>
      </div>
    </div>
  );
}
