import { describe, expect, it } from "vitest";
import type { ActivityCompletion, Goal, Task } from "@/types";
import {
  DEFAULT_TARGET_ACTIVITIES,
  getGoalProgress,
  syncActivityCompletionForTask,
} from "./goalProgress";

const goal = (id = "goal-1"): Goal => ({
  id,
  category: "idiomas",
  name: "Estudar idiomas",
  level: "todos",
  targetActivities: DEFAULT_TARGET_ACTIVITIES,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  status: "active",
});

const task = (id: string, completed: boolean, activityId = id): Task => ({
  id,
  text: id,
  completed,
  activityId,
  goalId: "goal-1",
});

const completion = (
  activityId: string,
  taskId: string,
  goalId = "goal-1"
): ActivityCompletion => ({
  id: `completion-${taskId}`,
  taskId,
  activityId,
  goalId,
  completedAt: "2026-09-13T00:00:00.000Z",
  earnedXp: 0,
  source: "suggestion",
});

describe("goal activity progress", () => {
  it("starts new goals with a target of 10 activities", () => {
    expect(DEFAULT_TARGET_ACTIVITIES).toBe(10);
  });

  it("increases progress after one activity completion", () => {
    expect(getGoalProgress(goal(), [completion("activity-1", "task-1")])).toEqual({
      completedActivities: 1,
      targetActivities: 10,
      percentage: 10,
    });
  });

  it("counts two completed activities as 2 of 10", () => {
    expect(
      getGoalProgress(goal(), [
        completion("activity-1", "task-1"),
        completion("activity-2", "task-2"),
      ]).completedActivities
    ).toBe(2);
  });

  it("caps progress at 100 percent", () => {
    const history = Array.from({ length: 12 }, (_, index) =>
      completion(`activity-${index}`, `task-${index}`)
    );

    expect(getGoalProgress(goal(), history).percentage).toBe(100);
  });

  it("keeps ten activities at 100 percent", () => {
    const history = Array.from({ length: 10 }, (_, index) =>
      completion(`activity-${index}`, `task-${index}`)
    );

    expect(getGoalProgress(goal(), history).percentage).toBe(100);
  });

  it("removes a task contribution when it is unchecked", () => {
    const history = [completion("activity-1", "task-1")];
    const nextHistory = syncActivityCompletionForTask(
      history,
      task("task-1", false),
      "2026-09-13T01:00:00.000Z"
    );

    expect(getGoalProgress(goal(), nextHistory).completedActivities).toBe(0);
  });

  it("does not duplicate a task completion when it is checked again", () => {
    const history = [completion("activity-1", "task-1")];
    const nextHistory = syncActivityCompletionForTask(
      history,
      task("task-1", true),
      "2026-09-13T01:00:00.000Z"
    );

    expect(nextHistory).toHaveLength(1);
    expect(nextHistory[0].taskId).toBe("task-1");
  });

  it("does not create an activity completion for a manual task", () => {
    const history = [completion("activity-1", "task-1")];
    const nextHistory = syncActivityCompletionForTask(
      history,
      { id: "manual-1", text: "Tarefa manual", completed: true },
      "2026-09-13T01:00:00.000Z"
    );

    expect(nextHistory).toEqual(history);
  });
});
