import { describe, expect, it } from "vitest";
import type { Activity, ActivityCompletion, Goal } from "@/types";
import {
  recommendActivity,
  type RecommendActivityInput,
} from "./recommendActivity";

const createGoal = (overrides: Partial<Goal> = {}): Goal => ({
  id: "goal-1",
  category: "idiomas",
  name: "Estudar idiomas",
  level: "basico",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  status: "active",
  ...overrides,
});

const createActivity = (
  id: string,
  overrides: Partial<Activity> = {}
): Activity => ({
  id,
  category: "idiomas",
  subgoal: "vocabulario",
  name: id,
  description: "",
  result: "",
  durationMin: 10,
  durationIdeal: 15,
  durationMax: 20,
  level: "basico",
  difficulty: "facil",
  type: "praticar",
  xp: 10,
  frequency: "diario",
  tags: [],
  ...overrides,
});

const createCompletion = (
  activityId: string,
  completedAt: string
): ActivityCompletion => ({
  id: `completion-${activityId}`,
  activityId,
  completedAt,
  earnedXp: 10,
  source: "manual",
});

const recommend = (
  activities: readonly Activity[],
  options: Partial<RecommendActivityInput> = {}
) =>
  recommendActivity({
    goal: createGoal(),
    availableTimeMinutes: 15,
    activities,
    ...options,
  });

describe("recommendActivity", () => {
  it("recommends an activity from the goal category", () => {
    expect(
      recommend([
        createActivity("wrong-category", { category: "financas" }),
        createActivity("matching-category"),
      ])?.id
    ).toBe("matching-category");
  });

  it("excludes activities above the available minimum duration", () => {
    expect(
      recommend([
        createActivity("too-long", { durationMin: 20, durationIdeal: 20 }),
        createActivity("eligible", { durationIdeal: 30 }),
      ])?.id
    ).toBe("eligible");
  });

  it("prefers the closest ideal duration", () => {
    expect(
      recommend([
        createActivity("farther", { durationIdeal: 10 }),
        createActivity("closest", { durationIdeal: 20 }),
      ])?.id
    ).toBe("closest");
  });

  it("treats 45 as 45+ and excludes activities over 45 minutes minimum", () => {
    expect(
      recommend(
        [
          createActivity("over-45", { durationMin: 46, durationIdeal: 45 }),
          createActivity("within-45", { durationMin: 45, durationIdeal: 45 }),
        ],
        { availableTimeMinutes: 45 }
      )?.id
    ).toBe("within-45");
  });

  it("prefers the goal level without filtering other levels", () => {
    expect(
      recommend(
        [
          createActivity("different-level", { level: "iniciante" }),
          createActivity("matching-level", { level: "basico" }),
        ],
        { goal: createGoal({ level: "basico" }) }
      )?.id
    ).toBe("matching-level");

    expect(
      recommend([createActivity("only-different", { level: "avancado" })], {
        goal: createGoal({ level: "basico" }),
      })?.id
    ).toBe("only-different");
  });

  it("relegates activities completed in the last seven days", () => {
    expect(
      recommend(
        [createActivity("recent"), createActivity("not-recent")],
        {
          activityHistory: [
            createCompletion("recent", "2026-09-10T00:00:00.000Z"),
          ],
          now: "2026-09-12T00:00:00.000Z",
        }
      )?.id
    ).toBe("not-recent");
  });

  it("returns null when there is no eligible candidate", () => {
    expect(
      recommend([createActivity("wrong-category", { category: "financas" })])
    ).toBeNull();
  });

  it("uses id as a deterministic tie-breaker", () => {
    const candidates = [
      createActivity("activity-b"),
      createActivity("activity-a"),
    ];

    expect(recommend(candidates)?.id).toBe("activity-a");
    expect(recommend(candidates)?.id).toBe("activity-a");
  });
});
