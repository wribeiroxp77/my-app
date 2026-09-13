import type { Activity, ActivityCompletion, Goal } from "@/types";

const RECENT_ACTIVITY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export interface RecommendActivityInput {
  goal: Goal;
  availableTimeMinutes: number | "45+";
  activities: readonly Activity[];
  activityHistory?: readonly ActivityCompletion[];
  now?: Date | string;
}

const getTimeReference = (
  availableTimeMinutes: RecommendActivityInput["availableTimeMinutes"]
): number | null => {
  if (availableTimeMinutes === "45+" || availableTimeMinutes === 45) {
    return 45;
  }

  return Number.isFinite(availableTimeMinutes) && availableTimeMinutes >= 0
    ? availableTimeMinutes
    : null;
};

const isRecentlyCompleted = (
  activityId: string,
  activityHistory: readonly ActivityCompletion[] | undefined,
  now: Date | string | undefined
): boolean => {
  if (!activityHistory || now === undefined) return false;

  const nowMs = new Date(now).getTime();
  if (!Number.isFinite(nowMs)) return false;

  return activityHistory.some(completion => {
    if (completion.activityId !== activityId) return false;

    const completedAtMs = new Date(completion.completedAt).getTime();
    if (!Number.isFinite(completedAtMs)) return false;

    const elapsedMs = nowMs - completedAtMs;
    return elapsedMs >= 0 && elapsedMs <= RECENT_ACTIVITY_WINDOW_MS;
  });
};

const getLevelPenalty = (activity: Activity, goal: Goal): number =>
  goal.level === "todos" || activity.level === goal.level ? 0 : 1;

export const recommendActivity = ({
  goal,
  availableTimeMinutes,
  activities,
  activityHistory,
  now,
}: RecommendActivityInput): Activity | null => {
  const timeReference = getTimeReference(availableTimeMinutes);
  if (timeReference === null) return null;

  const candidates = activities
    .map((activity, index) => {
      if (
        activity.category !== goal.category ||
        activity.durationMin > timeReference
      ) {
        return null;
      }

      return {
        activity,
        index,
        distance: Math.abs(activity.durationIdeal - timeReference),
        recentPenalty: isRecentlyCompleted(
          activity.id,
          activityHistory,
          now
        )
          ? 1
          : 0,
        levelPenalty: getLevelPenalty(activity, goal),
      };
    })
    .filter(
      (
        candidate
      ): candidate is {
        activity: Activity;
        index: number;
        distance: number;
        recentPenalty: number;
        levelPenalty: number;
      } => candidate !== null
    );

  candidates.sort((left, right) => {
    if (left.distance !== right.distance) {
      return left.distance - right.distance;
    }
    if (left.recentPenalty !== right.recentPenalty) {
      return left.recentPenalty - right.recentPenalty;
    }
    if (left.levelPenalty !== right.levelPenalty) {
      return left.levelPenalty - right.levelPenalty;
    }

    const idComparison = left.activity.id.localeCompare(right.activity.id);
    return idComparison !== 0 ? idComparison : left.index - right.index;
  });

  return candidates[0]?.activity ?? null;
};
