import type { ActivityCompletion, Goal, Task } from "@/types";

export const DEFAULT_TARGET_ACTIVITIES = 10;

export const syncActivityCompletionForTask = (
  history: readonly ActivityCompletion[],
  task: Task,
  completedAt: string
): ActivityCompletion[] => {
  const withoutTaskCompletion = history.filter(
    completion => completion.taskId !== task.id
  );

  if (!task.completed || !task.activityId || !task.goalId) {
    return [...withoutTaskCompletion];
  }

  return [
    ...withoutTaskCompletion,
    {
      id: `task-completion-${task.id}`,
      taskId: task.id,
      activityId: task.activityId,
      goalId: task.goalId,
      completedAt,
      earnedXp: 0,
      source: "suggestion",
    },
  ];
};

export const getGoalCompletedActivities = (
  goalId: string,
  history: readonly ActivityCompletion[]
): number =>
  new Set(
    history
      .filter(completion => completion.goalId === goalId)
      .map(completion => completion.activityId)
  ).size;

export const getGoalProgress = (
  goal: Goal,
  history: readonly ActivityCompletion[]
): { completedActivities: number; targetActivities: number; percentage: number } => {
  const completedActivities = getGoalCompletedActivities(goal.id, history);
  const targetActivities = goal.targetActivities;
  const percentage =
    targetActivities > 0
      ? Math.min(100, (completedActivities / targetActivities) * 100)
      : 0;

  return { completedActivities, targetActivities, percentage };
};
